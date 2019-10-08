import React, { FC, useState } from 'react';
import { useDrag } from 'react-use-gesture';

function distance(dot1, dot2) {
  const [x1, y1] = dot1;
  const [x2, y2] = dot2;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function limit(x, y, radius): IJoystickPosition {
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

export type Axis = 'x' | 'y';

export type IJoystickPosition = Record<Axis, number>;

interface IJoystickProps {
  radius?: number;
  lockAxis?: Axis;
  onChange?(position: IJoystickPosition): void;
}

export const Joystick: FC<IJoystickProps> = ({
  radius = 40,
  lockAxis,
  onChange,
}) => {
  const [{ x, y }, setPosition] = useState<IJoystickPosition>(() => ({
    x: 0,
    y: 0,
  }));

  const bind = useDrag(({ down, movement }) => {
    const position: IJoystickPosition = down
      ? limit(movement[0], movement[1], radius)
      : { x: 0, y: 0 };

    if (lockAxis === 'x') {
      position.y = 0;
    }

    if (lockAxis === 'y') {
      position.x = 0;
    }

    setPosition(position);

    if (onChange) {
      onChange(position);
    }
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
