/* Import section */
import type { FC } from 'react';
import React from 'react';

type WorkingIconType = FC<{ size: number, className: string }>;

/* Type of AnimatedIcon */
interface AnimatedIconProps {
    Icon: WorkingIconType;
    size: number;
    opacity: number;
    position: { top: string; left: string };
    depth: number;
    mousePos: { x: number; y: number };
}
/* AnimatedIcon section */
const AnimatedIcon: FC<AnimatedIconProps> = ({ Icon, size, opacity, position, depth, mousePos }) => {
    const style: React.CSSProperties = {
        transform: `translate(
      ${mousePos.x * depth}px, 
      ${mousePos.y * depth}px
    )`,
        position: 'absolute',
        top: position.top,
        left: position.left,
        opacity: opacity,
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
/* Export section */
export default AnimatedIcon;
