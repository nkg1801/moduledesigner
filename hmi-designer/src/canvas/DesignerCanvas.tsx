import { Stage, Layer } from "react-konva";

import { useEditorStore } from "../store/editorStore";
import GridLayer from "./GridLayer";
import ShapeRenderer from "../components/ShapeRenderer";
import { Group } from "react-konva";
import { useViewportStore } from "../store/viewportStore";
import { useEffect, useState } from "react";
import ConnectionLayer from "../components/ConnectionLayer";


export default function DesignerCanvas() {

    //const shapes = useEditorStore((state) => state.shapes);

    const shapes =
        useEditorStore((state) => {

            const currentHmi =
                state.hmis.find(
                    (hmi) =>
                        hmi.id ===
                        state.selectedHmiId
                );

            return currentHmi?.shapes ?? [];
        });

    const clearSelection =
        useEditorStore(
            (state) => state.clearSelection
        );
    const addShape = useEditorStore((state) => state.addShape);
    const scale = useViewportStore((s) => s.scale);
    const x = useViewportStore((s) => s.x);
    const y = useViewportStore((s) => s.y);
    const setScale = useViewportStore((s) => s.setScale);
    const setPosition = useViewportStore((s) => s.setPosition);
    //const [isPanning, setIsPanning] = useState(false);
    //const [lastPointer, setLastPointer] = useState<{x: number; y: number; } | null>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    //const [spacePressed, setSpacePressed] = useState(false);

    const handleWheel = (e: any) => {
        e.evt.preventDefault();

        const stage = e.target.getStage();

        if (!stage) return;

        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const scaleBy = 1.1;

        const newScale =
            e.evt.deltaY > 0
                ? scale / scaleBy
                : scale * scaleBy;

        const mousePointTo = {
            x: (pointer.x - x) / scale,
            y: (pointer.y - y) / scale,
        };

        const newPos = {
            x:
                pointer.x -
                mousePointTo.x * newScale,

            y:
                pointer.y -
                mousePointTo.y * newScale,
        };

        setScale(newScale);

        setPosition(
            newPos.x,
            newPos.y
        );
    };

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setSpacePressed(true);
            }
        };

        const up = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setSpacePressed(false);
            }
        };

        window.addEventListener(
            "keydown",
            down
        );

        window.addEventListener(
            "keyup",
            up
        );

        return () => {
            window.removeEventListener(
                "keydown",
                down
            );

            window.removeEventListener(
                "keyup",
                up
            );
        };
    }, []);


    return (
        <div
            onDragOver={(e) =>
                e.preventDefault()
            }
            onDrop={(e) => {
                e.preventDefault();

                const type = e.dataTransfer.getData("shapeType");
                const rect = e.currentTarget.getBoundingClientRect();
                const worldX = (e.clientX - rect.left - x) / scale;
                const worldY = (e.clientY - rect.top - y) / scale;

                addShape(
                    type as
                    | "analogIndicator"
                    | "column"
                    //| "rectangle"
                    //| "circle"
                    //| "tank"
                    | "controlValve"
                    | "checkValve"
                    | "blockValve"
                    | "threeWayValve"
                    | "pump"
                    | "controller"
                    | "reactor"
                    | "heatExchanger"
                    | "mixer"
                    | "binaryIndicator"
                    | "arithmeticIndicator"
                    | "flowTransmitter"
                    | "levelTransmitter"
                    | "levelTransmitterBar"
                    | "pressureTransmitter"
                    | "temperatureTransmitter"
                    | "vessel",
                    worldX,
                    worldY
                );

            }}
        >

            <Stage
                // canvas width and height are set to the window size minus some offset for UI elements
                width={window.innerWidth - 950}
                height={window.innerHeight - 120}
                onWheel={handleWheel}

                onMouseDown={(e) => {
                    setIsMouseDown(true);

                    if (
                        e.target === e.target.getStage()
                    ) {
                        clearSelection();
                    }
                }}
            >

                <Layer>

                    <Group
                        x={x}
                        y={y}
                        scaleX={scale}
                        scaleY={scale}
                    >

                        <GridLayer
                            width={3000}
                            height={3000}
                        />

                        <ConnectionLayer />

                        {shapes.map((shape) => (
                            <ShapeRenderer
                                key={shape.id}
                                shape={shape}
                            />
                        ))}
                    </Group>
                </Layer>
            </Stage>
        </div>
    );
}