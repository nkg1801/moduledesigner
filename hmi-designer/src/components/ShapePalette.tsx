import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import { toolboxCategories } from "../config/toolboxCategories";

export default function ShapePalette() {
    const handleDragStart = (
        e: React.DragEvent,
        type: string
    ) => {
        e.dataTransfer.setData(
            "shapeType",
            type
        );
    };

    return (
        <Box>
            <Typography
                variant="subtitle1"
                gutterBottom
            >
                Shape Library
            </Typography>

            {toolboxCategories.map(
                (category, index) => (
                    <Accordion
                        key={category.title}
                        defaultExpanded={index === 0}
                        disableGutters
                    >
                        <AccordionSummary
                            expandIcon={
                                <ExpandMoreIcon />
                            }
                            sx={{
                                backgroundColor:
                                    "#dfe3e8",
                                minHeight: 36,
                            }}
                        >
                            <Typography
                                fontWeight="bold"
                            >
                                {category.title}
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails
                            sx={{ p: 1 }}
                        >
                            {category.items.map(
                                (item) => (
                                    <Box
                                        key={item.type}
                                        draggable
                                        onDragStart={(e) =>
                                            handleDragStart(
                                                e,
                                                item.type
                                            )
                                        }
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            p: 1,
                                            mb: 0.5,
                                            cursor: "grab",
                                            borderRadius: 1,

                                            "&:hover": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    >
                                        <img
                                            src={item.icon}
                                        alt={item.label}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            objectFit: "contain",
                                        }}
    />

                                        <Typography variant="body2">
                                            {item.label}
                                        </Typography>
                                    </Box>
                                )
                            )}
                        </AccordionDetails>
                    </Accordion>
                )
            )}
        </Box>
    );
}