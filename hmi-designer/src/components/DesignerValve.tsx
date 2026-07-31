import { useEffect, useRef } from "react";
import Konva from "konva";
import { Circle as KonvaCircle } from "react-konva";

import {
    Group,
    Rect,
    Line,
    Transformer,
    Text,
} from "react-konva";

import { ShapeModel } from "../types/Shape";
import { useEditorStore } from "../store/editorStore";

interface Props {
    shape: ShapeModel;
}

export default function DesignerTank({
    shape,
}: Props) {

    const selectPort = useEditorStore((state) => state.selectPort);
    const selectedPortIds = useEditorStore((state) => state.selectedPortIds);
    const connections = useEditorStore((state) => state.connections);

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

    const selectShape = useEditorStore(
        (state) => state.selectShape
    );

    const updateShapePosition =
        useEditorStore(
            (state) => state.updateShapePosition
        );

    const isSelected =
        selectedShapeIds.includes(
            shape.id
        );

    const tankRef =
        useRef<Konva.Group>(null);

    const trRef =
        useRef<Konva.Transformer>(null);

    const rectRef =
        useRef<Konva.Rect>(null);

    const updateShapeSize =
        useEditorStore(
            (state) => state.updateShapeSize
        );

    const dragStartRef =
        useRef<
            Record<
                string,
                { x: number; y: number }
            >
        >({});

    useEffect(() => {
        if (isSelected && trRef.current && rectRef.current) {
            console.log("Transformer attached");
            trRef.current.nodes([
                tankRef.current,
            ]);

            trRef.current
                .getLayer()
                ?.batchDraw();
        }
    }, [
        isSelected,
        shape.width,
        shape.height,
    ]);

    console.log(
        "Tank width:",
        shape.width
    );

    console.log(
        "Tank render:",
        {
            width: shape.width,
            height: shape.height,
        }
    );

    return (
        <>
            <Group
                ref={tankRef}
                x={shape.x}
                y={shape.y}
                draggable

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

                    const draggedY =
                        e.target.y();

                    const dx =
                        draggedX - shape.x;

                    const dy =
                        draggedY - shape.y;

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
                    const node = tankRef.current;

                    if (!node) return;

                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    updateShapeSize(
                        shape.id,
                        Math.max(
                            50,
                            shape.width * scaleX
                        ),
                        Math.max(
                            50,
                            shape.height * scaleY
                        )
                    );
                }}

            >
                <Text
                    text={shape.name}
                    y={-20}
                    fontSize={14}
                    fill="#333" />
                <Rect
                    ref={rectRef}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fill}
                    stroke={
                        isSelected
                            ? "#ff9800"
                            : "#333"
                    }
                    strokeWidth={2}
                    cornerRadius={10}

                />


                <Line
                    points={[
                        0,
                        20,
                        shape.width,
                        20,
                    ]}
                    stroke="#444"
                />
            </Group>

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