import { useEffect, useRef } from "react";
import Konva from "konva";
import {Image, Transformer, Text, Circle as KonvaCircle, Group,} from "react-konva";
import useImage from "use-image";
import { ShapeModel } from "../types/Shape";
import { useEditorStore } from "../store/editorStore";

interface Props {
    shape: ShapeModel;
}

export default function DesignerImageSymbol({
    shape,
}: Props) {

    const [image] = useImage(shape.imageSrc ?? "");

    const imageRef = useRef<Konva.Image>(null);

    const trRef =
        useRef<Konva.Transformer>(null);

    const selectedShapeIds =
        useEditorStore(
            (state) =>
                state.selectedShapeIds
        );

    const selectShape =
        useEditorStore(
            (state) =>
                state.selectShape
        );

    const shapes = useEditorStore((state) => state.shapes);

    const selectPort =
        useEditorStore(
            (state) =>
                state.selectPort
        );

    const selectedPortIds =
        useEditorStore(
            (state) =>
                state.selectedPortIds
        );

    const connections =
        useEditorStore((state) => {
            const currentHmi =
                state.hmis.find(
                    (hmi) =>
                        hmi.id ===
                        state.selectedHmiId
                );

            return (
                currentHmi?.connections ?? []
            );
        });

    const updateShapePosition =
        useEditorStore(
            (state) =>
                state.updateShapePosition
        );

    const dragStartRef =
        useRef<Record<
            string,
            { x: number; y: number }
        >>({});

    const updateMultipleShapePositions =
        useEditorStore(
            (state) =>
                state.updateMultipleShapePositions
        );

    const updateShapeSize =
        useEditorStore(
            (state) =>
                state.updateShapeSize
        );

    const isSelected =
        selectedShapeIds.includes(
            shape.id
        );

    useEffect(() => {
        if (isSelected && trRef.current && imageRef.current) {
            trRef.current.nodes([
                imageRef.current
            ]);

            trRef.current
                .getLayer()
                ?.batchDraw();
        }

    }, [isSelected]);

    return (
        <>
            <Text
                text={shape.name}
                x={shape.x}
                y={shape.y - 20}
                fontSize={14}
            />

            <Image
                ref={imageRef}
                image={image}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                draggable
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

                    const node =
                        imageRef.current;

                    if (!node) {
                        return;
                    }

                    const scaleX =
                        node.scaleX();

                    const scaleY =
                        node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    updateShapeSize(
                        shape.id,
                        Math.max(
                            20,
                            node.width() * scaleX
                        ),
                        Math.max(
                            20,
                            node.height() * scaleY
                        )
                    );
                }}
            />

            {shape.ports?.map(
                (port) => {

                    const isConnected =
                        connections.some(
                            (c) =>
                                c.sourcePortId ===
                                port.id ||
                                c.targetPortId ===
                                port.id
                        );

                    return (
                        <Group
                            key={port.id}
                        >
                            <KonvaCircle
                                x={
                                    shape.x +
                                    port.offsetX
                                }
                                y={
                                    shape.y +
                                    port.offsetY
                                }
                                radius={4}
                                fill={
                                    selectedPortIds.includes(
                                        port.id
                                    )
                                        ? "yellow"
                                        : isConnected
                                            ? "green"
                                            : "red"
                                }
                                onClick={() =>
                                    selectPort(
                                        port.id
                                    )
                                }
                            />

                            <Text
                                text={
                                    port.name
                                }
                                x={
                                    shape.x +
                                    port.offsetX +
                                    8
                                }
                                y={
                                    shape.y +
                                    port.offsetY -
                                    8
                                }
                                fontSize={10}
                            />
                        </Group>
                    );
                }
            )}

            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                    enabledAnchors={[
                        "middle-left",
                        "middle-right",
                    ]}
                />
            )}
        </>
    );
}