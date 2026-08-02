import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import { useEditorStore } from "../store/editorStore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import StopIcon from "@mui/icons-material/Stop";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const states = [
    {
        id: "idle",
        label: "Idle",
        x: 40,
        y: 120,
        active: true,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "starting",
        label: "Starting",
        x: 200,
        y: 120,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "execute",
        label: "Execute",
        x: 380,
        y: 120,
        icon: <PlayArrowIcon fontSize="small" />,
    },

    {
        id: "completing",
        label: "Completing",
        x: 560,
        y: 120,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "completed",
        label: "Completed",
        x: 760,
        y: 120,
        active: true,
        icon: <CheckIcon fontSize="small" />,
    },

    {
        id: "paused",
        label: "Paused",
        x: 380,
        y: 40,
        active: true,
        icon: <PauseIcon fontSize="small" />,
    },

    {
        id: "resuming",
        label: "Resuming",
        x: 200,
        y: 40,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "pausing",
        label: "Pausing",
        x: 560,
        y: 40,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "held",
        label: "Held",
        x: 420,
        y: 240,
        active: true,
        icon: <KeyboardDoubleArrowLeftIcon fontSize="small" />,
    },

    {
        id: "holding",
        label: "Holding",
        x: 640,
        y: 240,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "unholding",
        label: "Unholding",
        x: 200,
        y: 240,
        icon: <AutorenewIcon fontSize="small" />,
    },

    {
        id: "stopped",
        label: "Stopped",
        x: 220,
        y: 360,
        active: true,
        icon: <StopIcon fontSize="small" />,
    },

    {
        id: "stopping",
        label: "Stopping",
        x: 420,
        y: 360,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "aborted",
        label: "Aborted",
        x: 220,
        y: 460,
        active: true,
        icon: <CloseIcon fontSize="small" />,
    },

    {
        id: "aborting",
        label: "Aborting",
        x: 420,
        y: 460,
        icon: <SettingsIcon fontSize="small" />,
    },

    {
        id: "resetting",
        label: "Resetting",
        x: 40,
        y: 240,
        icon: <AutorenewIcon fontSize="small" />,
    },
];

const labels = [
    { text: "", x: 190, y: 135 }, //START
    { text: "", x: 630, y: 135 }, //COMPLETE
    { text: "", x: 470, y: 210 }, //HOLD
    { text: "", x: 320, y: 380 }, //STOP
    { text: "", x: 320, y: 480 }, //ABORT
];

const getState = (id: string) =>
    states.find((s) => s.id === id);

const transitions = [
    // Main flow
    ["idle", "starting"],
    ["starting", "execute"],
    ["execute", "completing"],
    ["completing", "completed"],

    // Pause flow
    ["resuming", "paused"],
    ["paused", "pausing"],

    // Hold flow
    ["holding", "held"],
    ["held", "unholding"],

    // Stop flow
    ["stopping", "stopped"],

    // Abort flow
    ["aborting", "aborted"],
];

const capabilityGroups = [
    {
        title: "Level 2",
        items: [
            {
                key: "starting",
                label: "Start / Complete",
            },
        ],
    },
    {
        title: "Level 1",
        items: [
            {
                key: "pausing",
                label: "Pause / Resume",
            },
        ],
    },
    {
        title: "Level 3",
        items: [
            {
                key: "holding",
                label: "Hold",
            },
        ],
    },
    {
        title: "Level 4",
        items: [
            {
                key: "stopping",
                label: "Stop",
            },
        ],
    },
    {
        title: "Level 5",
        items: [
            {
                key: "aborting",
                label: "Abort",
            },
            {
                key: "resetting",
                label: "Reset",
            },
        ],
    },
];

function StateNode(
    {
        label,
        x,
        y,
        icon,
        active = false,
    }: {
        label: string;
        x: number;
        y: number;
        icon?: React.ReactNode;
        active?: boolean;
    }
) {
    return (
        <Paper
            sx={{
                position: "absolute",
                left: x,
                top: y,

                width: 120,
                height: 44,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: active
                    ? "#9e9e9e"
                    : "#f5f5f5",

                border: active
                    ? "2px solid white"
                    : "1px solid #888",

                zIndex: 20,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                {icon}
                <Typography variant="body2">
                    {label}
                </Typography>
            </Box>
        </Paper>
    );
}
function TransitionLine({
    x1,
    y1,
    x2,
    y2,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}) {
    return (
        <>
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#607080"
                strokeWidth="2"
                markerEnd="url(#arrow)"
            />
        </>
    );
}

function RoutedTransition({
    points,
    strokeWidth = 2,
}: {
    points: string;
    strokeWidth?: number;
}) {
    return (
        <polyline
            points={points}
            fill="none"
            stroke="#607080"
            strokeWidth={strokeWidth}
            markerEnd="url(#arrow)"
        />
    );
}


export default function ServiceDesigner() {
    const services = useEditorStore(
        (state) => state.services
    );

    const activeEditor = useEditorStore(
        (state) => state.activeEditor   
    );

    const updateServiceTransition =
        useEditorStore(
            (state) => state.updateServiceTransition
        );

    const service = services.find(
        (s) => s.id === activeEditor.id
    );

    if (!service) {
        return null;
    }

    const visibleStates = states.filter((state) => {
        switch (state.id) {
            case "starting":
            case "completing":
                return service.transitions.starting;

            case "pausing":
            case "paused":
            case "resuming":
                return service.transitions.pausing;

            case "holding":
            case "held":
            case "unholding":
                return service.transitions.holding;

            case "stopping":
            case "stopped":
                return service.transitions.stopping;

            case "aborting":
            case "aborted":
                return service.transitions.aborting;

            case "resetting":
                return service.transitions.resetting;

            default:
                return true;
        }
    });

    const visibleTransitions = transitions.filter(
        ([from, to]) =>
            visibleStates.some((s) => s.id === from) &&
            visibleStates.some((s) => s.id === to)
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
                    <Box
                        sx={{
                            position: "relative",
                            height: 520,
                        }}
                    >
                        {/* Background */}

                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                bgcolor: "#cfcfcf",
                            }}
                        />

                        <Box
                            sx={{
                                position: "absolute",
                                top: 20,
                                left: 160,
                                right: 140,
                                height: 185,
                                bgcolor: "#ececec",
                            }}
                        />

                        <Box
                            sx={{
                                position: "absolute",
                                top: 205,
                                left: 330,
                                width: 300,
                                height: 90,
                                bgcolor: "#ececec",
                            }}
                        />

                        <svg
                            width="100%"
                            height="100%"
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 5,
                                pointerEvents: "none",
                            }}
                        >
                            <defs>
                                <marker
                                    id="arrow"
                                    viewBox="0 0 10 10"
                                    refX="9"
                                    refY="5"
                                    markerWidth="6"
                                    markerHeight="6"
                                    orient="auto-start-reverse"
                                >
                                    <path
                                        d="M0 0 L10 5 L0 10 Z"
                                        fill="#607080"
                                    />
                                </marker>
                            </defs>

                            {/* Existing horizontal transitions */}

                            {visibleTransitions.map(([from, to]) => {
                                const source = getState(from);
                                const target = getState(to);

                                if (!source || !target) {
                                    return null;
                                }

                                const NODE_WIDTH = 120;
                                const NODE_HEIGHT = 44;

                                const isRightToLeft = source.x > target.x;

                                return (
                                    <TransitionLine
                                        key={`${from}-${to}`}
                                        x1={
                                            isRightToLeft
                                                ? source.x
                                                : source.x + NODE_WIDTH
                                        }
                                        y1={source.y + NODE_HEIGHT / 2}
                                        x2={
                                            isRightToLeft
                                                ? target.x + NODE_WIDTH + 8
                                                : target.x - 8
                                        }
                                        y2={source.y + NODE_HEIGHT / 2}
                                    />
                                );
                            })}

                            {labels.map((label) => (
                                <text
                                    key={label.text}
                                    x={label.x}
                                    y={label.y}
                                    fontSize="10"
                                    fill="#607080"
                                >
                                    {label.text}
                                </text>
                            ))}

                            {/* Routed transitions */}

                            {/* Execute -> Hold */}
                            {service.transitions.holding && (
                                <RoutedTransition
                                    points="450,174 450,220 450,238"
                                    strokeWidth={2}
                                />
                            )}

                            {/*   Resetting -> Idle */}
                            
                                <RoutedTransition
                                    points="85,290 85,170"
                                    strokeWidth={2}
                                />
                            

                            {/* Stopped -> Resetting (Horizontal and Vertical both */}
                            {service.transitions.stopping && (
                                <RoutedTransition
                                    points="220,388 85,388 85,288"
                                    strokeWidth={2}
                                />)}

                            {/* Stopped -> Resetting only Arrow */}
                            {service.transitions.stopping && (
                                <line
                                    x1="110"
                                    y1="388"
                                    x2="85"
                                    y2="388"
                                    stroke="#607080"
                                    strokeWidth="2"
                                    markerEnd="url(#arrow)"
                                />)}

                            {/* Aborted -> Resetting (horizontal line) */}
                            {service.transitions.aborting && (
                                <line
                                    x1="220"
                                    y1="488"
                                    x2="85"
                                    y2="488"
                                    stroke="#607080"
                                    strokeWidth="2"
                                    markerEnd="url(#arrow)"
                                />)}

                            {/* Aborted -> Resetting  (vertical line) */}
                            {service.transitions.aborting && (
                                <line
                                    x1="85"
                                    y1="488"
                                    x2="85"
                                    y2="290"
                                    stroke="#607080"
                                    strokeWidth="2"
                                    markerEnd="url(#arrow)"
                                />)}

                            {/* Unholding -> Execute */}
                            {service.transitions.holding && (
                                <line
                                    x1="290"
                                    y1="245"
                                    x2="445"
                                    y2="164"
                                    stroke="#607080"
                                    strokeWidth="2"
                                    markerEnd="url(#arrow)"
                                />
                            )}

                            {/* Execute -> Pausing */}

                            {service.transitions.pausing && (
                                <line
                                    x1="445"
                                    y1="120"
                                    x2="560"
                                    y2="85"
                                    stroke="#607080"
                                    strokeWidth="2"
                                    markerEnd="url(#arrow)"
                                />
                            )}

                            {/* Resuming -> Execute */}

                            {service.transitions.pausing && (
                            <line
                                x1="325"
                                y1="85"
                                x2="445"
                                y2="120"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                                />)}

                            {/* to Holding */}

                            {service.transitions.holding && (
                                <line
                                    x1="650"
                                    y1="210"
                                    x2="650"
                                    y2="240"
                                    stroke="#607080"
                                    strokeWidth="2"
                                    markerEnd="url(#arrow)"
                                />)}

                        </svg>

                        {visibleStates.map((state) => (
                            <StateNode
                                key={state.id}
                                label={state.label}
                                x={state.x}
                                y={state.y}
                                active={state.active}


                            />
                        ))}
                    </Box>
                </Box>

                {/* States and Transitions */}

                {/* Capability Configuration */}

                <Box
                    sx={{
                        width: 280,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        overflowY: "auto",
                    }}
                >
                    {capabilityGroups.map((group) => (
                        <Paper
                            key={group.title}
                            sx={{
                                p: 2,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                {group.title}
                            </Typography>

                            {group.items.map((item) => (
                                <FormControlLabel
                                    key={item.key}
                                    control={
                                        <Checkbox
                                            checked={
                                                service.transitions[
                                                item.key as keyof typeof service.transitions
                                                ]
                                            }
                                            onChange={(e) => {
                                                console.log(
                                                    item.key,
                                                    e.target.checked
                                                );

                                                updateServiceTransition(
                                                    service.id,
                                                    item.key as keyof typeof service.transitions,
                                                    e.target.checked
                                                );
                                            }}
                                        />
                                    }
                                    label={item.label}
                                />
                            ))}
                        </Paper>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}