import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEditorStore } from "../store/editorStore";

export default function PropertyInspector() {
    const selectedShapeIds =
        useEditorStore(
            (state) => state.selectedShapeIds
        );

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

    const updateShapeProperties =
        useEditorStore(
            (state) =>
                state.updateShapeProperties
        );

    const selectedShape =
        shapes.find(
            (shape) =>
                selectedShapeIds.includes(
                    shape.id
                )
        );

    const hmis =
        useEditorStore(
            (state) => state.hmis
        );

    const selectedHmiId =
        useEditorStore(
            (state) => state.selectedHmiId
        );

    const selectedHmi =
        hmis.find(
            (h) => h.id === selectedHmiId
        );

    const renameHmi = useEditorStore((state) =>state.renameHmi);

    const services =
        useEditorStore(
            (state) => state.services
        );

    const selectedServiceId =
        useEditorStore(
            (state) => state.selectedServiceId
        );

    const selectedServiceStateId =
        useEditorStore(
            (state) =>
                state.selectedServiceStateId
        );

    const selectedService =
        services.find(
            (service) =>
                service.id ===
                selectedServiceId
        );

    const selectedState =
        selectedService?.states.find(
            (state) =>
                state.id ===
                selectedServiceStateId
        );


    if (selectedShapeIds.length > 1) {
        return (
            <Typography>
                {selectedShapeIds.length}
                {" "}shapes selected
            </Typography>
        );
    }

    if (selectedState) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Typography variant="h6">
                    State Properties
                </Typography>

                <TextField
                    label="Name"
                    value={name}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="State ID"
                    value={selectedState.id}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="Service"
                    value={
                        selectedService?.name ?? ""
                    }
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />
            </Box>
        );
    }

    if (selectedService) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Typography variant="h6">
                    Service Properties
                </Typography>

                <TextField
                    label="Name"
                    value={selectedService.name}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="ID"
                    value={selectedService.id}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="States"
                    value={
                        selectedService.states.length
                    }
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />
            </Box>
        );
    }

    if (!selectedShape) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Typography
                    variant="h6"
                >
                    HMI Properties
                </Typography>

                <TextField
                    label="Name"
                    size="small"
                    value={selectedHmi?.name ?? ""}
                    onChange={(e) => {

                        if (!selectedHmi) {
                            return;
                        }

                        renameHmi(
                            selectedHmi.id,
                            e.target.value
                        );
                    }}
                />

                <TextField
                    label="Id"
                    size="small"
                    value={selectedHmi?.id ?? ""}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="Width"
                    size="small"
                    value={
                        selectedHmi?.connections.length ?? 0
                    }
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="Height"
                    size="small"
                    value={
                        selectedHmi?.connections.length ?? 0
                    }
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="Shapes"
                    size="small"
                    value={
                        selectedHmi?.shapes.length ?? 0
                    }
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <TextField
                    label="Connections"
                    size="small"
                    value={
                        selectedHmi?.connections.length ?? 0
                    }
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mt: 1,
            }}>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                }}>

                <TextField
                    label="Name"
                    size="small"
                    value={selectedShape.name}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                name: e.target.value,
                            }
                        )
                    }
                    sx={{ flex: 2 }}
                />
                </Box>
                <Box>

                <TextField
                    label="Type"
                    size="small"
                    value={selectedShape.type}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                    sx={{ flex: 1 }}
                />

                </Box>
                <Box>
                <TextField
                    label="eClass ID"
                    size="small"
                    type="number"
                    value={selectedShape.eClassId ?? 0}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                eClassId:
                                    Number(
                                        e.target.value
                                    ) || 0,
                            }
                        )
                    }
                    sx={{ flex: 1 }}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                }}
            >
                <TextField
                    label="X"
                    size="small"
                    value={selectedShape.x}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                x:
                                    Number(
                                        e.target.value
                                    ) || 0,
                            }
                        )
                    }
                    sx={{ flex: 1 }}
                />

                <TextField
                    label="Y"
                    size="small"
                    value={selectedShape.y}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                y:
                                    Number(
                                        e.target.value
                                    ) || 0,
                            }
                        )
                    }
                    sx={{ flex: 1 }}
                />

            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                }}
            >

                <TextField
                    label="Width"
                    size="small"
                    value={selectedShape.width}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                width: Math.max(
                                    25,
                                    Number(
                                        e.target.value
                                    ) || 25
                                ),
                            }
                        )
                    }
                    sx={{ flex: 1 }}
                />

                <TextField
                    label="Height"
                    size="small"
                    value={selectedShape.height}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                height: Math.max(
                                    25,
                                    Number(
                                        e.target.value
                                    ) || 25
                                ),
                            }
                        )
                    }
                    sx={{ flex: 1 }}
                />
            </Box>

            <Box>
                <TextField
                    label="Rotation"
                    size="small"
                    type="number"
                    value={selectedShape.eClassId ?? 0}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                eClassId:
                                    Number(
                                        e.target.value
                                    ) || 0,
                            }
                        )
                    }
                    sx={{ flex: 1 }}
                />
            </Box>

            <Box>
                <TextField
                    label="ZIndex"
                    size="small"
                    type="number"
                    value={selectedShape.eClassId ?? 0}
                    onChange={(e) =>
                        updateShapeProperties(
                            selectedShape.id,
                            {
                                eClassId:
                                    Number(
                                        e.target.value
                                    ) || 0,
                            }
                        )
                    }
                    sx={{ flex: 1 }}
                />
            </Box>
        </Box>
    );
}