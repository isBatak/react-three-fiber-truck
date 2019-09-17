import { useCallback } from 'react';
import { RaycastVehicle } from 'cannon';
import { useEvent } from './useEvent';

export const useVehicleKeyboardControls = (
  vehicle: RaycastVehicle,
  maxForce: number = 1000,
  brakeForce: number = 1000000,
  maxSteerValue: number = 0.5
) => {
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
    [vehicle, maxForce, maxSteerValue, brakeForce]
  );

  useEvent('keyup', onKeyHandler);
  useEvent('keydown', onKeyHandler);
};
