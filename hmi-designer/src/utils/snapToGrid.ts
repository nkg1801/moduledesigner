export function snapToGrid(
  value: number,
  gridSize = 25
) {
  return (
    Math.round(value / gridSize) *
    gridSize
  );
}