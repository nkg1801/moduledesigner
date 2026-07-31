import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { ShapeModel } from "../types/Shape";
import { shapeRegistry } from "../shapes/shapeRegistry";
import { ConnectionModel } from "../types/Connection";
import { PortModel } from "../types/Port";

interface EditorState {
    shapes: ShapeModel[];
    connections: ConnectionModel[];
    selectedShapeIds: string[];
    selectedPortIds: string[];
    selectedConnectionId: string | null;

    selectConnection: (connectionId: string | null) => void;
    deleteSelectedConnection: () => void;
    clearSelectedPorts: () => void;
    selectPort: (portId: string) => void;
    selectShape: (id: string, append?: boolean) => void;
    clearSelection: () => void;
    updateShapePosition: (id: string, x: number, y: number) => void;
    updateShapeSize: (id: string, width: number, height: number) => void;
    addRectangle: () => void;
    addCircle: () => void;
    deleteSelectedShape: () => void;
    updateShapeProperties: (id: string, properties: Partial<ShapeModel>) => void;
    addShape: (type: ShapeType, x: number, y: number) => void;


    updateMultipleShapePositions: (updates: {
            id: string;
            x: number;
            y: number;
        }[]
    ) => void;

    addConnection: (
        sourceShapeId: string,
        sourcePortId: string,
        targetShapeId: string,
        targetPortId: string
    ) => void;
}

export interface HMIDocument {
    id: string;
    name: string;
}

export type ShapeType =
    | "analogIndicator"
    | "mixer"
    | "binaryIndicator"
    | "arithmeticIndicator"
    | "flowTransmitter"
    | "levelTransmitter"
    | "levelTransmitterBar"
    | "pressureTransmitter"
    | "temperatureTransmitter"
    | "column"
    | "rectangle"
    | "circle"
    | "tank"
    | "controlValve"
    | "checkValve"
    | "blockValve"
    | "threeWayValve"
    | "pump"
    | "controller"
    | "reactor"
    | "heatExchanger"
    | "vessel";

export const useEditorStore = create<EditorState>(
    (set) => ({
        //default shapes when the editor starts
        shapes: [
            /*{
                id: "shape1",
                name: "Rectangle1",
                amlType: "InternalElement",
                refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
                ports: [
                    {
                        id: "shape1_N0",
                        shapeId: "shape1",
                        name: "N0",
                        offsetX: 150,
                        offsetY: 50,
                    },
                ],
                type: "rectangle",
                x: 100,
                y: 100,
                width: 150,
                height: 100,
                fill: "#1976d2"
            },
            {
                id: "shape2",
                name: "Rectangle2",
                amlType: "InternalElement",
                refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
                ports: [
                    {
                        id: "shape2_N0",
                        shapeId: "shape2",
                        name: "N0",
                        offsetX: 180,
                        offsetY: 60,
                    },
                ],
                type: "rectangle",
                x: 350,
                y: 180,
                width: 180,
                height: 120,
                fill: "#2e7d32"
            }*/
        ],

        selectedShapeIds: [],
        selectedPortIds: [],
        selectedConnectionId: null,
        connections: [],

        selectShape: (
            id,
            append = false
        ) =>
            set((state) => {
                if (append) {
                    const exists =
                        state.selectedShapeIds.includes(
                            id
                        );

                    return {
                        selectedShapeIds: exists
                            ? state.selectedShapeIds.filter(
                                (s) => s !== id
                            )
                            : [
                                ...state.selectedShapeIds,
                                id,
                            ],
                    };
                }

                return {
                    selectedShapeIds: [id],
                };
            }),

        clearSelection: () =>
            set({
                selectedShapeIds: [],
            }),

        selectPort: (portId) =>
            set((state) => {

                if (state.selectedPortIds.includes(portId)) {
                    return {
                        selectedPortIds:
                            state.selectedPortIds.filter(
                                (id) => id !== portId
                            ),
                    };
                }

                return {
                    selectedPortIds: [
                        ...state.selectedPortIds,
                        portId,
                    ].slice(-2),
                };
            }),

        updateShapePosition: (id, x, y) => {
            set((state) => ({
                shapes: state.shapes.map((shape) =>
                    shape.id === id
                        ? {
                            ...shape,
                            x,
                            y,
                        }
                        : shape
                ),
            }));
        },

        addRectangle: () =>
            set((state) => {
                const id = uuidv4();

                return {
                    shapes: [
                        ...state.shapes,
                        {
                            id,
                            name: `Rectangle${state.shapes.filter(
                                (s) => s.type === "rectangle"
                            ).length + 1
                                }`,
                            amlType: "InternalElement",
                            refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",

                            ports: [
                                {
                                    id: `${id}_N0`,
                                    shapeId: id,
                                    name: "N0",
                                    offsetX: 150,
                                    offsetY: 50,
                                },
                            ],

                            type: "rectangle",
                            x: 200,
                            y: 200,
                            width: 150,
                            height: 100,
                            fill: "#1976d2",
                        },
                    ],
                };
            }),

        addCircle: () =>
            set((state) => {
                const id = uuidv4();

                return {
                    shapes: [
                        ...state.shapes,
                        {
                            id,
                            name: `Circle${state.shapes.filter(
                                (s) => s.type === "circle"
                            ).length + 1
                                }`,
                            amlType: "InternalElement",
                            refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",

                            ports: [
                                {
                                    id: `${id}_N0`,
                                    shapeId: id,
                                    name: "N0",
                                    offsetX: 100,
                                    offsetY: 50,
                                },
                            ],

                            type: "circle",
                            x: 250,
                            y: 250,
                            width: 100,
                            height: 100,
                            fill: "#ef6c00",
                        },
                    ],
                };
            }),

        addShape: (type, x, y) =>
            set((state) => {
                const definition = shapeRegistry[type];
                console.log("type:", type);
                console.log("definition:", shapeRegistry[type]);

                const count =
                    state.shapes.filter(
                        (s) => s.type === type
                    ).length + 1;

                const id = uuidv4();
                let ports: PortModel[];


                if (type === "column" || type === "pump" || type === "controller" || type === "reactor" || type === "heatExchanger" || type === "analogIndicator" || type === "vessel"
                    || type === "binaryIndicator" || type === "arithmeticIndicator" || type === "mixer" || type === "flowTransmitter" || type === "levelTransmitter"
                    || type === "levelTransmitterBar" || type === "pressureTransmitter" || type === "temperatureTransmitter") {
                    ports = [
                        {
                            id: `${id}_N0`,
                            shapeId: id,
                            name: "N0",
                            offsetX: 0,
                            offsetY: definition.height / 2,
                        },
                        {
                            id: `${id}_N1`,
                            shapeId: id,
                            name: "N1",
                            offsetX: definition.width,
                            offsetY: definition.height / 2,
                        },
                    ];
                }
                else if (type === "controlValve" || type === "checkValve" ||  type === "blockValve" || type === "threeWayValve") {

                    ports = [
                        {
                            id: `${id}_N0`,
                            shapeId: id,
                            name: "N0",

                            offsetX: 0,
                            offsetY: definition.height * 0.6, // tweak
                        },
                        {
                            id: `${id}_N1`,
                            shapeId: id,
                            name: "N1",

                            offsetX: definition.width,
                            offsetY: definition.height * 0.6, // tweak
                        },
                    ];
                }
                else {
                    ports = [
                        {
                            id: `${id}_N0`,
                            shapeId: id,
                            name: "N0",
                            offsetX: definition.width,
                            offsetY: definition.height / 2,
                        },
                    ];
                }

                return {
                    shapes: [
                        ...state.shapes,
                        {
                            id,
                            name: definition.displayName + count,
                            eClassId: definition.eClassId,
                            amlType: definition.amlType,
                            refBaseSystemUnitPath: definition.refBaseSystemUnitPath,
                            imageSrc: definition.imageSrc,
                            type,
                            x,
                            y,
                            width: definition.width,
                            height: definition.height,
                            fill: definition.fill,
                            ports,
                        },
                    ],
                };
            }),

        updateShapeProperties: (
            id,
            properties
        ) =>
            set((state) => ({
                shapes: state.shapes.map((shape) =>
                    shape.id === id
                        ? {
                            ...shape,
                            ...properties,
                        }
                        : shape
                ),
            })),

        deleteSelectedShape: () =>
            set((state) => ({
                shapes: state.shapes.filter(
                    (shape) =>
                        !state.selectedShapeIds.includes(
                            shape.id
                        )
                ),
                selectedShapeIds: [],
            })),


        updateShapeSize: (id, width, height) =>
            set((state) => ({
                shapes: state.shapes.map((shape) => {

                    if (shape.id !== id) {
                        return shape;
                    }

                    const updatedPorts =
                        shape.ports?.map((port) => {

                            if (port.name === "N0") {
                                return {
                                    ...port,
                                    offsetX: 0,
                                    offsetY: height * 0.6,
                                };
                            }

                            if (port.name === "N1") {
                                return {
                                    ...port,
                                    offsetX: width,
                                    offsetY: height * 0.6,
                                };
                            }

                            return port;
                        });

                    return {
                        ...shape,
                        width,
                        height,
                        ports: updatedPorts,
                    };
                }),
            })),

        updateMultipleShapePositions: (
            updates
        ) =>
            set((state) => ({
                shapes: state.shapes.map(
                    (shape) => {
                        const update =
                            updates.find(
                                (u) =>
                                    u.id === shape.id
                            );

                        if (!update) {
                            return shape;
                        }

                        return {
                            ...shape,
                            x: update.x,
                            y: update.y,
                        };

                    }
                ),
            })),

        addConnection: (
            sourceShapeId,
            sourcePortId,
            targetShapeId,
            targetPortId
        ) =>
            set((state) => {
                const exists =
                    state.connections.some(
                        (c) =>
                            (c.sourcePortId === sourcePortId && c.targetPortId === targetPortId) || (c.sourcePortId === targetPortId && c.targetPortId === sourcePortId)
                    );

                if (exists) {
                    return {};
                }

                return {
                    connections: [
                        ...state.connections,
                        {
                            id: crypto.randomUUID(),
                            sourceShapeId,
                            sourcePortId,
                            targetShapeId,
                            targetPortId,
                        },
                    ],
                };
            }),

        selectConnection: (
            connectionId
        ) =>
            set({
                selectedConnectionId: connectionId,
            }),

        deleteSelectedConnection: () =>
            set((state) => {

                if (!state.selectedConnectionId) {
                    return {};
                }

                return {
                    connections:
                        state.connections.filter(
                            (c) =>
                                c.id !==
                                state.selectedConnectionId
                        ),

                    selectedConnectionId:
                        null,
                };
            }),

        clearSelectedPorts: () =>
            set({
                selectedPortIds: [],
            }),
    })
);