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
  radius: 0.5,
  directionLocal: new Vec3(0, 1, 0),
  suspensionStiffness: 45,
  suspensionRestLength: 1,
  frictionSlip: 5,
  dampingRelaxation: 2.3,
  dampingCompression: 4.5,
  maxSuspensionForce: 200000,
  rollInfluence: 0.01,
  axleLocal: new Vec3(-1, 0, 0),
  chassisConnectionPointLocal: new Vec3(1, 1, 0),
  maxSuspensionTravel: 0.25,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
};

function createRaycastVehicle(): RaycastVehicle {
  const chassisShape = new Box(new Vec3(1, 0.5, 2));
  const chassisBody = new Body({ mass: 150 });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 4, 0);
  // chassisBody.angularVelocity.set(0, 0, 0);

  const vehicle = new RaycastVehicle({
    chassisBody: chassisBody,
    indexRightAxis: 0,
    indexUpAxis: 1,
    indexForwardAxis: 2,
  });

  const axlewidth = 1.4;

  wheelInfoOptions.chassisConnectionPointLocal.set(1.2, 0, axlewidth);
  vehicle.addWheel(wheelInfoOptions);

  wheelInfoOptions.chassisConnectionPointLocal.set(-1.2, 0, axlewidth);
  vehicle.addWheel(wheelInfoOptions);

  wheelInfoOptions.chassisConnectionPointLocal.set(1.2, 0, -axlewidth);
  vehicle.addWheel(wheelInfoOptions);

  wheelInfoOptions.chassisConnectionPointLocal.set(-1.2, 0, -axlewidth);
  vehicle.addWheel(wheelInfoOptions);

  return vehicle;
}

export function useRaycastVehicle() {
  const world = useContext<World>(CannonContext);
  const vehicle = useMemo<RaycastVehicle>(createRaycastVehicle, []);

  useEffect(() => {
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
      var quaternion = new Quaternion();
      quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
      wheelBody.addShape(cylinderShape, new Vec3(), quaternion);
      wheelBodies.push(wheelBody);
      world.addBody(wheelBody);
    }

    // Update wheels
    world.addEventListener('postStep', function() {
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
