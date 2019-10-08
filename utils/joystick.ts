import { IJoystickPosition } from '../components/ui/Joystick';

enum JoystickDirection {
  Forward = 'forward',
  Right = 'right',
  Backward = 'backward',
  Left = 'left',
}

export function direction(atan2: number): string {
  if (atan2 > 2.35619449 || atan2 < -2.35619449) {
    return JoystickDirection.Forward;
  } else if (atan2 < 2.35619449 && atan2 > 0.785398163) {
    return JoystickDirection.Right;
  } else if (atan2 < -0.785398163) {
    return JoystickDirection.Left;
  }
  return JoystickDirection.Backward;
}

export function joystickEngineForceEventDispatcher({ y }: IJoystickPosition) {
  if (y < -20) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
  } else if (y < 0) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
  }

  if (y > 20) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
  } else if (y > 0) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }));
  }
}

export function joystickSteeringEventDispatcher({ x }: IJoystickPosition) {
  if (x < -20) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
  } else if (x < 0) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
  }

  if (x > 20) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
  } else if (x > 0) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }));
  }
}
