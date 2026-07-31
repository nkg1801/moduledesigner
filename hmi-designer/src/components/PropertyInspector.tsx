import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEditorStore } from "../store/editorStore";

export default function PropertyInspector() {
    console.log("PropertyInspector rendered");
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

    if (selectedShapeIds.length > 1) {
        return (
            <Typography>
                {selectedShapeIds.length}
                {" "}shapes selected
            </Typography>
        );
    }

    if (!selectedShape) {
        return (
            <Typography>
                No shape selected
            </Typography>
        );
    }

    return (


        <Box
            sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mt: 1,
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                }}
            >
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

                <TextField
                    label="Type"
                    size="small"
                    value={selectedShape.type}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ flex: 1 }}
                />

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

        </Box>
    );
}