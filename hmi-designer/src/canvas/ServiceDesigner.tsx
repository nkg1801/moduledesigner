import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEditorStore } from "../store/editorStore";

export default function ServiceDesigner() {
    const services = useEditorStore(
        (state) => state.services
    );

    const activeEditor = useEditorStore(
        (state) => state.activeEditor
    );

    const service = services.find(
        (s) => s.id === activeEditor.id
    );

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                minHeight: 0,
                boxSizing: "border-box",
                p: 2,
                gap: 2,
            }}
        >

            <Typography variant="h5">
                {service?.name}
            </Typography>

            <Typography>
                Width Test
            </Typography>

            {/* Parameters Area */}

            <Box
                sx={{
                    height: 200,
                    border: "1px solid #cccccc",
                    backgroundColor: "white",
                    p: 1,
                }}
            >
                <Typography variant="subtitle1">
                    Service Parameters
                </Typography>
            </Box>

            {/* State Configuration Area */}

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    gap: 2,
                    minWidth: 0,
                }}
            >
                {/* State Diagram */}

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,

                        border: "1px solid #cccccc",
                        backgroundColor: "white",
                        p: 2,
                    }}
                >
                    <Typography variant="subtitle1">
                        State Diagram
                    </Typography>
                </Box>

                {/* States and Transitions */}

                <Box
                    sx={{
                        flex: 1,
                        border: "1px solid #cccccc",
                        backgroundColor: "white",
                        p: 2,
                    }}
                >
                    <Typography variant="subtitle1">
                        States and Transitions
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}