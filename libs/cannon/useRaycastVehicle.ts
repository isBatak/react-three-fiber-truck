import { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { CannonContext } from './Cannon';
import {
  Box,
  Vec3,
  Body,
  RaycastVehicle,
  IWheelInfoOptions,
  Quaternion,
  Cylinder,
  World,
} from 'cannon';

const wheelInfoOptions: IWheelInfoOptions = {
  radius: 0.7,
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

function createRaycastVehicle(): RaycastVehicle {
  const chassisShape = new Box(new Vec3(2.4, 1.65, 1));
  const chassisBody = new Body({
    mass: 150,
  });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 0, 4);

  const vehicle = new RaycastVehicle({
    chassisBody: chassisBody,
  });

  wheelInfoOptions.chassisConnectionPointLocal.set(1.5, 1.57, -1);
  vehicle.addWheel(wheelInfoOptions);

  wheelInfoOptions.chassisConnectionPointLocal.set(1.5, -1.57, -1);
  vehicle.addWheel(wheelInfoOptions);

  wheelInfoOptions.chassisConnectionPointLocal.set(-1.75, 1.57, -1);
  vehicle.addWheel(wheelInfoOptions);

  wheelInfoOptions.chassisConnectionPointLocal.set(-1.75, -1.57, -1);
  vehicle.addWheel(wheelInfoOptions);

  return vehicle;
}

export function useRaycastVehicle() {
  const world = useContext<World>(CannonContext);
  const vehicle = useMemo<RaycastVehicle>(createRaycastVehicle, []);

  useEffect(() => {
    vehicle.addToWorld(world);

    const wheelBodies: Array<Body> = [];
    for (var i = 0; i < vehicle.wheelInfos.length; i++) {
      var wheel = vehicle.wheelInfos[i];
      var cylinderShape = new Cylinder(wheel.radius, wheel.radius, 0.6, 20);
      var wheelBody = new Body({
        mass: 0,
      });
      wheelBody.type = Body.KINEMATIC;
      wheelBody.collisionFilterGroup = 0; // turn off collisions
      var quaternion = new Quaternion();
      quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
      wheelBody.addShape(cylinderShape, new Vec3(), quaternion);
      wheelBodies.push(wheelBody);
      world.addBody(wheelBody);
    }

    // Update wheels
    world.addEventListener('postStep', () => {
      vehicle.wheelInfos.forEach((_, index) => {
        vehicle.updateWheelTransform(index);
        const transform = vehicle.wheelInfos[index].worldTransform;
        const wheelBody = wheelBodies[index];
        wheelBody.position.copy(transform.position);
        wheelBody.quaternion.copy(transform.quaternion);
      });
    });

    return () => {
      vehicle.removeFromWorld(world);
    };
  }, []);

  return vehicle;
}
