import React, {
  FC,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { useLoader } from '../hooks/useLoader';
import { CannonContext } from '../libs/cannon/Cannon';
import {
  Box,
  Vec3,
  Body,
  RaycastVehicle,
  IWheelInfoOptions,
  Quaternion,
  Cylinder,
} from 'cannon';
import { useEvent } from '../hooks/useEvent';
import { Mesh } from 'three';
import { useRender } from 'react-three-fiber';

const wheelInfoOptions: IWheelInfoOptions = {
  radius: 0.5,
  directionLocal: new Vec3(0, 0, -1),
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 5,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  axleLocal: new Vec3(0, 1, 0),
  chassisConnectionPointLocal: new Vec3(1, 1, 0),
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
};

const findMeshByName = (name: string) => (item: Mesh) => item.name === name;

export interface IVehicle {
  url: String;
  maxSteerValue?: number;
  maxForce?: number;
  brakeForce?: number;
}

export const Vehicle: FC<IVehicle> = ({
  url,
  maxSteerValue = 0.5,
  maxForce = 1000,
  brakeForce = 1000000,
}) => {
  // @ts-ignore
  const gltf = useLoader<GLTF>(GLTFLoader, url);

  const world = useContext(CannonContext);
  const [vehicle, setVehicle] = useState<RaycastVehicle>(null);

  const vehicleBodyMesh = useMemo<Mesh>(
    () => gltf && gltf.scene.children.find(findMeshByName('Body')),
    gltf
  );

  useEffect(() => {
    if (!gltf) {
      return () => null;
    }

    const { position, quaternion, geometry } = vehicleBodyMesh;

    geometry.computeBoundingBox();
    const { boundingBox } = geometry;

    const chassisShape = new Box(new Vec3(2, 1, 0.5));
    // const chassisShape = new Box(
    //   new Vec3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z)
    // );
    const chassisBody = new Body({ mass: 150 });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(0, 0, 4);
    chassisBody.angularVelocity.set(0, 0, 0.5);
    // chassisBody.position.set(position.x, position.y, position.z);
    // chassisBody.quaternion.set(
    //   quaternion.x,
    //   quaternion.y,
    //   quaternion.z,
    //   quaternion.w
    // );

    const vehicle = new RaycastVehicle({
      chassisBody: chassisBody,
      // indexRightAxis: 0,
      // indexUpAxis: 1,
      // indexLeftAxis: 2,
    });

    const axlewidth = 1;

    wheelInfoOptions.chassisConnectionPointLocal.set(axlewidth, 1, 0);
    vehicle.addWheel(wheelInfoOptions);

    wheelInfoOptions.chassisConnectionPointLocal.set(axlewidth, -1, 0);
    vehicle.addWheel(wheelInfoOptions);

    wheelInfoOptions.chassisConnectionPointLocal.set(-axlewidth, 1, 0);
    vehicle.addWheel(wheelInfoOptions);

    wheelInfoOptions.chassisConnectionPointLocal.set(-axlewidth, -1, 0);
    vehicle.addWheel(wheelInfoOptions);

    vehicle.addToWorld(world);

    const wheelBodies = [];
    for (var i = 0; i < vehicle.wheelInfos.length; i++) {
      var wheel = vehicle.wheelInfos[i];
      var cylinderShape = new Cylinder(
        wheel.radius,
        wheel.radius,
        wheel.radius / 2,
        20
      );
      var wheelBody = new Body({
        mass: 0,
      });
      wheelBody.type = Body.KINEMATIC;
      wheelBody.collisionFilterGroup = 0; // turn off collisions
      var q = new Quaternion();
      q.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
      wheelBody.addShape(cylinderShape, new Vec3(), q);
      wheelBodies.push(wheelBody);
      world.addBody(wheelBody);
    }
    // Update wheels
    world.addEventListener('postStep', function() {
      vehicle.wheelInfos.forEach((_, index) => {
        vehicle.updateWheelTransform(index);
        var t = vehicle.wheelInfos[index].worldTransform;
        var wheelBody = wheelBodies[index];
        wheelBody.position.copy(t.position);
        wheelBody.quaternion.copy(t.quaternion);
      });
    });

    setVehicle(vehicle);

    return () => {
      vehicle.removeFromWorld(world);
    };
  }, [gltf]);

  const onKeyHandler = useCallback(
    ({ key, type }) => {
      const up = type == 'keyup';
      if ((!up && type !== 'keydown') || !vehicle) {
        return;
      }

      vehicle.setBrake(0, 0);
      vehicle.setBrake(0, 1);
      vehicle.setBrake(0, 2);
      vehicle.setBrake(0, 3);

      switch (key) {
        case 'w': // forward
          vehicle.applyEngineForce(up ? 0 : -maxForce, 2);
          vehicle.applyEngineForce(up ? 0 : -maxForce, 3);
          break;
        case 's': // backward
          vehicle.applyEngineForce(up ? 0 : maxForce, 2);
          vehicle.applyEngineForce(up ? 0 : maxForce, 3);
          break;
        case 'd': // right
          vehicle.setSteeringValue(up ? 0 : -maxSteerValue, 0);
          vehicle.setSteeringValue(up ? 0 : -maxSteerValue, 1);
          break;
        case 'a': // left
          vehicle.setSteeringValue(up ? 0 : maxSteerValue, 0);
          vehicle.setSteeringValue(up ? 0 : maxSteerValue, 1);
          break;
        case 'b': // b
          vehicle.setBrake(brakeForce, 0);
          vehicle.setBrake(brakeForce, 1);
          vehicle.setBrake(brakeForce, 2);
          vehicle.setBrake(brakeForce, 3);
          break;
      }
    },
    [vehicle]
  );

  useEvent('keyup', onKeyHandler);
  useEvent('keydown', onKeyHandler);

  const ref = useRef<Mesh>(null);

  useRender(
    () => {
      if (ref.current && vehicle) {
        // console.log(ref.current.quaternion, vehicle.chassisBody.quaternion);
        // ref.current.position.copy(vehicle.chassisBody.position);
        // ref.current.quaternion.copy(vehicle.chassisBody.quaternion);
      }
    },
    false,
    [vehicle]
  );

  return gltf ? (
    <mesh ref={ref} name="Body" {...vehicleBodyMesh} castShadow />
  ) : null;
};
