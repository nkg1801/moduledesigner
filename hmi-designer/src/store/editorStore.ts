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
    deleteSelectedShape: () => void;
    updateShapeProperties: (id: string, properties: Partial<ShapeModel>) => void;
    addShape: (type: ShapeType, x: number, y: number) => void;
    updateMultipleShapePositions: (updates: { id: string; x: number; y: number; }[]) => void;
    addConnection: (sourceShapeId: string, sourcePortId: string, targetShapeId: string, targetPortId: string) => void;
    hmis: HMIDocument[];
    selectedHmiId: string;
    addHmi: (name?: string) => void;
    selectHmi: (id: string) => void;
    renameHmi: (id: string, name: string) => void;
    deleteHmi: (id: string) => void;
    duplicateHmi: (id: string) => void;
    services: ServiceModel[];
    addService: (name: string) => void;
    renameService: (id: string,name: string) => void;
    deleteService: (id: string) => void;
    selectedServiceId: string | null;
    selectService: (id: string | null) => void;
}

export interface HMIDocument {
    id: string;
    name: string;
    shapes: ShapeModel[];
    connections: ConnectionModel[];
}

export interface ServiceModel {
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

function getCurrentHmi(state: EditorState) {
    return state.hmis.find(
        (hmi) =>
            hmi.id === state.selectedHmiId
    );
}

// this is zustland store for the editor state, including shapes, connections, and selection state
export const useEditorStore = create<EditorState>(
    (set) => ({
        shapes: [],
        selectedShapeIds: [],
        selectedPortIds: [],
        selectedConnectionId: null,
        connections: [],
        services: [],
        selectedServiceId: null,

        hmis: [
            {
                id: "hmi-1",
                name: "HMI_1",
                shapes: [],
                connections: [],
            },
        ],

        selectedHmiId: "hmi-1",

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
                hmis: state.hmis.map((hmi) =>
                    hmi.id === state.selectedHmiId
                        ? {
                            ...hmi,

                            shapes: hmi.shapes.map(
                                (shape) =>
                                    shape.id === id
                                        ? {
                                            ...shape,
                                            x,
                                            y,
                                        }
                                        : shape
                            ),
                        }
                        : hmi
                ),
            }));
        },

        addShape: (type, x, y) =>
            set((state) => {
                const definition = shapeRegistry[type];

                const currentHmi = getCurrentHmi(state);

                if (!currentHmi) {
                    return {};
                }

                const count =
                    currentHmi.shapes.filter(
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
                else if (type === "controlValve" || type === "checkValve" || type === "blockValve" || type === "threeWayValve") {

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

                const newShape = {
                    id,
                    name: definition.displayName + count,
                    eClassId: definition.eClassId,
                    amlType: definition.amlType,
                    refBaseSystemUnitPath:
                        definition.refBaseSystemUnitPath,
                    imageSrc: definition.imageSrc,
                    type,
                    x,
                    y,
                    width: definition.width,
                    height: definition.height,
                    fill: definition.fill,
                    ports,
                };

                return {
                    hmis: state.hmis.map((hmi) =>
                        hmi.id === state.selectedHmiId
                            ? {
                                ...hmi,
                                shapes: [
                                    ...hmi.shapes,
                                    newShape,
                                ],
                            }
                            : hmi
                    ),
                };
            }),

        updateShapeProperties: (id, properties) =>
            set((state) => ({

                hmis: state.hmis.map((hmi) =>
                    hmi.id === state.selectedHmiId
                        ? {
                            ...hmi,

                            shapes: hmi.shapes.map((shape) =>
                                shape.id === id
                                    ? {
                                        ...shape,
                                        ...properties,
                                    }
                                    : shape
                            ),
                        }
                        : hmi
                ),
            })),

        deleteSelectedShape: () =>
            set((state) => {

                const deletedIds =
                    state.selectedShapeIds;

                return {
                    hmis: state.hmis.map((hmi) =>
                        hmi.id ===
                            state.selectedHmiId
                            ? {
                                ...hmi,

                                shapes:
                                    hmi.shapes.filter(
                                        (shape) =>
                                            !deletedIds.includes(
                                                shape.id
                                            )
                                    ),

                                connections:
                                    hmi.connections.filter(
                                        (connection) =>
                                            !deletedIds.includes(
                                                connection.sourceShapeId
                                            ) &&
                                            !deletedIds.includes(
                                                connection.targetShapeId
                                            )
                                    ),
                            }
                            : hmi
                    ),

                    selectedShapeIds: [],
                };
            }),

        updateShapeSize: (id, width, height) =>
            set((state) => ({
                hmis: state.hmis.map((hmi) =>
                    hmi.id === state.selectedHmiId
                        ? {
                            ...hmi,

                            shapes: hmi.shapes.map((shape) => {

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
                        }
                        : hmi
                ),
            })),

        updateMultipleShapePositions: (updates) =>
            set((state) => ({
                hmis: state.hmis.map(
                    (hmi) =>
                        hmi.id ===
                            state.selectedHmiId
                            ? {
                                ...hmi,

                                shapes:
                                    hmi.shapes.map(
                                        (
                                            shape
                                        ) => {

                                            const update =
                                                updates.find(
                                                    (
                                                        u
                                                    ) =>
                                                        u.id ===
                                                        shape.id
                                                );

                                            if (
                                                !update
                                            ) {
                                                return shape;
                                            }

                                            return {
                                                ...shape,
                                                x: update.x,
                                                y: update.y,
                                            };
                                        }
                                    ),
                            }
                            : hmi
                ),
            })),

        addConnection: (sourceShapeId, sourcePortId,targetShapeId,targetPortId) =>
            set((state) => {

                const currentHmi =
                    getCurrentHmi(state);

                if (!currentHmi) {
                    return {};
                }

                const exists =
                    currentHmi.connections.some(
                        (c) =>
                            (
                                c.sourcePortId ===
                                sourcePortId &&
                                c.targetPortId ===
                                targetPortId
                            ) ||
                            (
                                c.sourcePortId ===
                                targetPortId &&
                                c.targetPortId ===
                                sourcePortId
                            )
                    );

                if (exists) {
                    return {};
                }

                const newConnection = {
                    id: crypto.randomUUID(),
                    sourceShapeId,
                    sourcePortId,
                    targetShapeId,
                    targetPortId,
                };

                return {

                    hmis: state.hmis.map(
                        (hmi) =>
                            hmi.id ===
                                state.selectedHmiId
                                ? {
                                    ...hmi,

                                    connections: [
                                        ...hmi.connections,
                                        newConnection,
                                    ],
                                }
                                : hmi
                    ),
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

                    hmis: state.hmis.map(
                        (hmi) =>
                            hmi.id ===
                                state.selectedHmiId
                                ? {
                                    ...hmi,

                                    connections:
                                        hmi.connections.filter(
                                            (c) =>
                                                c.id !==
                                                state.selectedConnectionId
                                        ),
                                }
                                : hmi
                    ),

                    selectedConnectionId:
                        null,
                };
            }),

        clearSelectedPorts: () =>
            set({
                selectedPortIds: [],
            }),


        addHmi: (name) =>
            set((state) => {

                const count = state.hmis.length + 1;
                const id = crypto.randomUUID();

                return {
                    hmis: [
                        ...state.hmis,
                        {
                            id,
                            name:
                                name?.trim() ||
                                `HMI_${count}`,

                            shapes: [],
                            connections: [],
                        },
                    ],

                    selectedHmiId: id,
                };
            }),

        selectHmi: (id) =>
            set(() => ({
                selectedHmiId: id,
                selectedServiceId: null,
            })),


        renameHmi: (id, name) =>
            set((state) => ({
                hmis: state.hmis.map((hmi) =>
                    hmi.id === id
                        ? {
                            ...hmi,
                            name,
                        }
                        : hmi
                ),
            })),

        deleteHmi: (id) =>
            set((state) => {

                const remainingHmis =
                    state.hmis.filter(
                        (hmi) => hmi.id !== id
                    );

                return {

                    hmis: remainingHmis,

                    selectedHmiId:
                        state.selectedHmiId === id
                            ? remainingHmis[0]?.id ?? ""
                            : state.selectedHmiId,
                };
            }),

        duplicateHmi: (id) =>
            set((state) => {

                const source =
                    state.hmis.find(
                        (hmi) => hmi.id === id
                    );

                if (!source) {
                    return {};
                }

                const shapeIdMap =
                    new Map<string, string>();

                const duplicatedShapes =
                    source.shapes.map((shape) => {

                        const newShapeId =
                            crypto.randomUUID();

                        shapeIdMap.set(
                            shape.id,
                            newShapeId
                        );

                        return {
                            ...shape,

                            id: newShapeId,

                            ports:
                                shape.ports?.map(
                                    (port) => {

                                        const newPortId =
                                            `${newShapeId}_${port.name}`;

                                        return {
                                            ...port,

                                            id: newPortId,

                                            shapeId: newShapeId,
                                        };
                                    }
                                ) ?? [],
                        };
                    });

                const portMap =
                    new Map<string, string>();

                source.shapes.forEach(
                    (shape, shapeIndex) => {

                        shape.ports?.forEach(
                            (
                                originalPort,
                                portIndex
                            ) => {

                                const newPort =
                                    duplicatedShapes[
                                        shapeIndex
                                    ].ports?.[
                                    portIndex
                                    ];

                                if (
                                    newPort
                                ) {
                                    portMap.set(
                                        originalPort.id,
                                        newPort.id
                                    );
                                }
                            }
                        );
                    }
                );

                const duplicatedConnections =
                    source.connections.map(
                        (connection) => ({
                            ...connection,

                            id:
                                crypto.randomUUID(),

                            sourceShapeId:
                                shapeIdMap.get(
                                    connection.sourceShapeId
                                ) ??
                                connection.sourceShapeId,

                            targetShapeId:
                                shapeIdMap.get(
                                    connection.targetShapeId
                                ) ??
                                connection.targetShapeId,

                            sourcePortId:
                                portMap.get(
                                    connection.sourcePortId
                                ) ??
                                connection.sourcePortId,

                            targetPortId:
                                portMap.get(
                                    connection.targetPortId
                                ) ??
                                connection.targetPortId,
                        })
                    );

                console.log(
                    "Original",
                    source.connections
                );

                console.log(
                    "Duplicated",
                    duplicatedConnections
                );

                const newHmiId =
                    crypto.randomUUID();

                const copiedHmi = {
                    id: newHmiId,

                    name:
                        `${source.name} Copy`,

                    shapes:
                        duplicatedShapes,

                    connections:
                        duplicatedConnections,
                };

                return {

                    hmis: [
                        ...state.hmis,
                        copiedHmi,
                    ],

                    selectedHmiId:
                        newHmiId,
                };
            }),
        addService: (name) =>
            set((state) => ({

                services: [
                    ...state.services,
                    {
                        id: crypto.randomUUID(),
                        name,
                    },
                ],
            })),

        renameService: (id,name) =>
            set((state) => ({

                services:
                    state.services.map(
                        (service) =>
                            service.id === id
                                ? {
                                    ...service,
                                    name,
                                }
                                : service
                    ),
            })),

        deleteService: (id) =>
            set((state) => ({

                services:
                    state.services.filter(
                        (service) =>
                            service.id !== id
                    ),
            })),

        selectService: (id) =>
            set(() => ({
                selectedServiceId: id,
                selectedShapeIds: [],
            })),

    })
);