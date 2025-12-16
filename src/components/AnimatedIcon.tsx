/* Import section */
import type { FC } from 'react';
import React from 'react';

type WorkingIconType = FC<{ size: number; className: string }>;

interface AnimatedIconProps {
    Icon: WorkingIconType;
    size: number;
    opacity: number;
    position: { top: string; left: string };
    depth: number;
    mousePos: { x: number; y: number };
}

/* utility clamp */
const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/* AnimatedIcon section */
const AnimatedIcon: FC<AnimatedIconProps> = ({
    Icon,
    size,
    opacity,
    position,
    depth,
    mousePos,
}) => {
    const MAX_OFFSET = 50;

    const translateX = clamp(mousePos.x * depth, -MAX_OFFSET, MAX_OFFSET);
    const translateY = clamp(mousePos.y * depth, -MAX_OFFSET, MAX_OFFSET);

    const style: React.CSSProperties = {
        transform: `translate(${translateX}px, ${translateY}px)`,
        position: 'absolute',
        top: position.top,
        left: position.left,
        opacity,
        transition: 'transform 0.3s ease-out',
        pointerEvents: 'none',
        filter: 'blur(0.5px)',
    };

    return (
        <div style={style}>
            <Icon size={size} className="text-white/90" />
        </div>
    );
};

export default AnimatedIcon;

