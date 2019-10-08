import React, { FC, useState } from 'react';
import { useDrag } from 'react-use-gesture';

function distance(dot1, dot2) {
  const [x1, y1] = dot1;
  const [x2, y2] = dot2;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function limit(x, y, radius) {
  const dist = distance([x, y], [0, 0]);
  if (dist <= radius) {
    return { x, y };
  } else {
    const radians = Math.atan2(y, x);
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    };
  }
}

function direction(atan2: number) {
  if (atan2 > 2.35619449 || atan2 < -2.35619449) {
    return 'FORWARD';
  } else if (atan2 < 2.35619449 && atan2 > 0.785398163) {
    return 'RIGHT';
  } else if (atan2 < -0.785398163) {
    return 'LEFT';
  }
  return 'BACKWARD';
}

interface IJoystickProps {
  radius?: number;
}

export const Joystick: FC<IJoystickProps> = ({ radius = 40 }) => {
  const [{ x, y }, setCoordinates] = useState(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ down, movement }) => {
    const result = down
      ? limit(movement[0], movement[1], radius)
      : { x: 0, y: 0 };

    console.log(direction(Math.atan2(result.x, result.y)));

    setCoordinates(result);
  });

  return (
    <>
      <div className="base">
        <div
          className="stick"
          {...bind()}
          style={{
            transform: `translate3d(${x}px, ${y}px, 0)`,
          }}
        />
      </div>
      <style jsx>{`
        .base {
          width: 80px;
          height: 80px;
          background: transparent;
          border-radius: 50%;
          border: 2px solid #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .stick {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          border: 2px solid #ffffff;
          cursor: move;
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
};
