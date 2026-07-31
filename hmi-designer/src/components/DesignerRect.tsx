import { useEffect, useRef } from "react";
import Konva from "konva";
import { Rect, Transformer, Text } from "react-konva";
import { ShapeModel } from "../types/Shape";
import { useEditorStore } from "../store/editorStore";
import { snapToGrid } from "../utils/snapToGrid";
import { Circle as KonvaCircle } from "react-konva";
import { Group } from "react-konva";

interface Props {
    shape: ShapeModel;
}

export default function DesignerRect({
    shape,
}: Props) {


    const rectRef = useRef<Konva.Rect>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const selectedShapeIds = useEditorStore((state) => state.selectedShapeIds);
    const shapes = useEditorStore((state) => state.shapes);
    const selectShape = useEditorStore((state) => state.selectShape);
    const updateShapePosition = useEditorStore((state) => state.updateShapePosition);
    const updateMultipleShapePositions = useEditorStore((state) => state.updateMultipleShapePositions);
    const updateShapeSize = useEditorStore((state) => state.updateShapeSize);
    const isSelected = selectedShapeIds.includes(shape.id);

    const dragStartRef =
        useRef<Record<
            string,
            { x: number; y: number }
        >>({});

    const selectPort = useEditorStore((state) => state.selectPort);
    const selectedPortIds = useEditorStore((state) => state.selectedPortIds);
    const connections =
        useEditorStore(
            (state) => state.connections
        );



    useEffect(() => {
        if (isSelected && trRef.current && rectRef.current) {
            trRef.current.nodes([rectRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <Text text={shape.name}
                x={shape.x}
                y={shape.y - 20}
                fontSize={14}
                fill="#333" />

            <Rect
                ref={rectRef}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
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

                onDragEnd={(e) => {
                    updateShapePosition(
                        shape.id,
                        e.target.x(),
                        e.target.y()
                    );

                    dragStartRef.current = {};
                }}

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
                    if (selectedShapeIds.length <= 1) {
                        return;
                    }

                    const draggedX = e.target.x();
                    const draggedY = e.target.y();

                    const dx = draggedX - shape.x;
                    const dy = draggedY - shape.y;

                    const updates = selectedShapeIds
                        .filter((id) => id !== shape.id)
                        .map((id) => {
                            const start = dragStartRef.current[id];

                            if (!start) return null;

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

                    updateMultipleShapePositions(updates);
                }}


                onTransformEnd={() => {
                    const node = rectRef.current;

                    if (!node) return;

                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    updateShapeSize(
                        shape.id,
                        snapToGrid(
                            Math.max(
                                25,
                                node.width() * scaleX
                            )
                        ),
                        snapToGrid(
                            Math.max(
                                25,
                                node.height() * scaleY
                            )
                        )
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
                            radius={4}
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
                    borderStroke="red"
                    anchorFill="red"
                    anchorSize={10}
                />
            )}
        </>
    );
}