import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEditorStore } from "../store/editorStore";

export default function ProjectExplorer() {

    const hmis =
        useEditorStore(
            (state) => state.hmis
        );

    const selectedHmiId =
        useEditorStore(
            (state) => state.selectedHmiId
        );

    const selectHmi =
        useEditorStore(
            (state) => state.selectHmi
        );

    return (
        <Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <FolderIcon fontSize="small" />
                Demo Project
            </Box>

            <Box sx={{ ml: 1 }}>

                <Typography
                    sx={{
                        fontWeight: 500,
                    }}
                >
                    ▼ HMI
                </Typography>

                {hmis.map((hmi) => (

                    <Box
                        key={hmi.id}
                        onClick={() =>
                            selectHmi(hmi.id)
                        }
                        sx={{
                            ml: 2,
                            mt: 0.5,
                            p: 0.5,

                            cursor: "pointer",

                            borderRadius: 1,

                            backgroundColor:
                                selectedHmiId ===
                                hmi.id
                                    ? "#1976d2"
                                    : "transparent",

                            color:
                                selectedHmiId ===
                                hmi.id
                                    ? "white"
                                    : "inherit",

                            "&:hover": {
                                backgroundColor:
                                    selectedHmiId ===
                                    hmi.id
                                        ? "#1976d2"
                                        : "#eeeeee",
                            },
                        }}
                    >
                        📄 {hmi.name}
                    </Box>

                ))}

            </Box>

        </Box>
    );
}