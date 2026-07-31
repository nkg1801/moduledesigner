import { Circle } from "react-konva";

interface GridLayerProps {
  width: number;
  height: number;
  spacing?: number;
}

export default function GridLayer({
  width,
  height,
  spacing = 25,
}: GridLayerProps) {
  const dots = [];

  for (let x = 0; x <= width; x += spacing) {
    for (let y = 0; y <= height; y += spacing) {
      dots.push(
        <Circle
          key={`${x}-${y}`}
          x={x}
          y={y}
          radius={1}
          fill="#d0d0d0"
        />
      );
    }
  }

  return <>{dots}</>;
}