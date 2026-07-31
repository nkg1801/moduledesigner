import { ShapeModel } from "../types/Shape";
import { useEditorStore } from "../store/editorStore";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { Circle, Transformer, Text } from "react-konva";
import { Circle as KonvaCircle } from "react-konva";
import { Group } from "react-konva";

interface Props {
  shape: ShapeModel;
}

export default function DesignerCircle({
  shape,
}: Props) {

	const selectPort =
		useEditorStore(
			(state) => state.selectPort
		);

	const selectedPortIds =
		useEditorStore(
			(state) => state.selectedPortIds
		);

	const selectedShapeIds =
	  useEditorStore(
		(state) => state.selectedShapeIds
	  );

	const shapes =
	  useEditorStore(
		(state) => state.shapes
	  );

	const updateMultipleShapePositions =
	  useEditorStore(
		(state) =>
		  state.updateMultipleShapePositions
	  );
  
  const selectShape = useEditorStore((state) => state.selectShape);
  const updateShapePosition = useEditorStore((state) => state.updateShapePosition);
	const connections =
		useEditorStore(
			(state) => state.connections
		);
  
  const isSelected =
  selectedShapeIds.includes(
    shape.id
  );
  
  const circleRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateShapeSize = useEditorStore((state) => state.updateShapeSize);
  const dragStartRef =
  useRef<
    Record<
      string,
      { x: number; y: number }
    >
  >({});
  
  useEffect(() => {
  if (
    isSelected &&
    trRef.current &&
    circleRef.current
  ) {
    trRef.current.nodes([
      circleRef.current,
    ]);
  }
}, [isSelected]);

return (
	<>
		<Text
			text={shape.name}
			x={shape.x - 30}
			y={shape.y - shape.width / 2 - 20}
			fontSize={14}
			fill="#333"
		/>

    <Circle
      ref={circleRef}
      x={shape.x}
      y={shape.y}
      radius={shape.width / 2}
      fill={shape.fill}
      draggable
      stroke={
        isSelected
          ? "#ff9800"
          : "transparent"
      }
      strokeWidth={3}
	  
      onClick={(e) =>
		  selectShape(
			shape.id,
			e.evt.ctrlKey
		  )
		}
		
	onDragStart={() => {
		  dragStartRef.current =
			Object.fromEntries(
			  shapes
				.filter((s) =>
				  selectedShapeIds.includes(
					s.id
				  )
				)
				.map((s) => [
				  s.id,
				  {
					x: s.x,
					y: s.y,
				  },
				])
			);
		}}
		
		
		onDragMove={(e) => {
		  if (
			selectedShapeIds.length <= 1 ||
			!selectedShapeIds.includes(
			  shape.id
			)
		  ) {
			return;
		  }

		  const draggedX =
			e.target.x();

		  const draggedY = e.target.y();
		  const dx = draggedX - shape.x;
		  const dy = draggedY - shape.y;

			const updates =
				selectedShapeIds
					.filter(
						(id) =>
							id !== shape.id
					)
					.map((id) => {
						const start =
							dragStartRef.current[id];

						if (!start)
							return null;

						return {
							id,
							x: start.x + dx,
							y: start.y + dy,
						};
					})
					.filter(
						(
							update
						): update is {
							id: string;
							x: number;
							y: number;
						} => update !== null
					);

		  updateMultipleShapePositions(
			updates
		  );
		}}
		
		onDragEnd={(e) => {
		  updateShapePosition(
			shape.id,
			e.target.x(),
			e.target.y()
		  );

		  dragStartRef.current = {};
		}}
	  
      onTransformEnd={() => {
        const node =
          circleRef.current;

        if (!node) return;

        const scaleX =
          node.scaleX();

        node.scaleX(1);
        node.scaleY(1);

        const size =
          shape.width * scaleX;

        updateShapeSize(
          shape.id,
          size,
          size
        );
      }}
		/>

		{shape.ports?.map((port) => {

			const isConnected =
				connections.some(
					(c) =>
						c.sourcePortId === port.id ||
						c.targetPortId === port.id
				);

			return (
				<Group key={port.id}>
					<KonvaCircle
						x={shape.x + port.offsetX}
						y={shape.y + port.offsetY}
						radius={5}
						fill={
							selectedPortIds.includes(port.id)
								? "yellow"
								: isConnected
									? "green"
									: "red"
						}
						onClick={() =>
							selectPort(port.id)
						}
					/>

					<Text
						text={port.name}
						x={shape.x + port.offsetX + 8}
						y={shape.y + port.offsetY - 8}
						fontSize={10}
						fill="red"
					/>
				</Group>
			);
		})}


    {isSelected && (
      <Transformer
        ref={trRef}
        rotateEnabled={false}
      />
    )}
  </>
);
}