import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Paper from "@mui/material/Paper";
import { useEditorStore } from "../store/editorStore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import StopIcon from "@mui/icons-material/Stop";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FastForwardIcon from "@mui/icons-material/FastForward";
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

const level2States = [
    "starting",
    "execute",
    "completing",
    "resuming",
    "paused",
    "pausing",
    "unholding",
];

const labels = [
    { text: "START", x: 190, y: 135 },
    { text: "COMPLETE", x: 630, y: 135 },
    { text: "HOLD", x: 470, y: 210 },
    { text: "STOP", x: 320, y: 380 },
    { text: "ABORT", x: 320, y: 480 },
];

const holdTransitions = level2States.map(
    state => ({
        from: state,
        to: "holding",
    })
);

const getState = (id: string) =>
    states.find((s) => s.id === id);

const stateCapabilities = {
    hold: [
        "starting",
        "execute",
        "completing",
        "resuming",
        "paused",
        "pausing",
        "unholding",
    ],

    stop: [
        "starting",
        "execute",
        "completing",
        "resuming",
        "paused",
        "pausing",
        "unholding",
        "holding",
        "held",
    ],

    abort: [
        "starting",
        "execute",
        "completing",
        "resuming",
        "paused",
        "pausing",
        "unholding",
        "holding",
        "held",
        "stopping",
        "stopped",
    ],
};

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

const horizontalTransitions = [
    ["idle", "starting"],
    ["starting", "execute"],
    ["execute", "completing"],
    ["completing", "completed"],

    ["resuming", "paused"],
    ["paused", "pausing"],

    ["unholding", "held"],
    ["held", "holding"],

    ["stopped", "stopping"],
    ["aborted", "aborting"],
];

const routedTransitions = [
    ["resuming", "execute"],
    ["pausing", "execute"],

    ["execute", "unholding"],

    ["holding", "stopping"],

    ["stopping", "aborting"],

    ["resetting", "idle"],
    ["resetting", "stopped"],
    ["resetting", "aborted"],

    ["completed", "aborted"],
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
}: {
    points: string;
}) {
    return (
        <polyline
            points={points}
            fill="none"
            stroke="#607080"
            strokeWidth="2"
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

    const service = services.find(
        (s) => s.id === activeEditor.id
    );

    const stateGroups = [
        {
            level: 1,
            color: "#fff3cd",
            states: [
                "Execute",
                "Pausing",
                "Paused",
                "Resuming",
            ],
        },
        {
            level: 2,
            color: "#d1ecf1",
            states: [
                "Starting",
                "Completing",
                "Unholding",
            ],
        },
        {
            level: 3,
            color: "#d4edda",
            states: [
                "Holding",
                "Held",
            ],
        },
        {
            level: 4,
            color: "#ffe5d0",
            states: [
                "Stopping",
                "Stopped",
            ],
        },
        {
            level: 5,
            color: "#f8d7da",
            states: [
                "Idle",
                "Completed",
                "Resetting",
                "Aborting",
                "Aborted",
            ],
        },
    ];

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

                            {transitions.map(([from, to]) => {
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

                            <RoutedTransition
                                points="
        450,174
        450,220
        450,258
    "
                            />
                            <RoutedTransition
                                points="
        85,258
        85,170
    "
                            />

                            <RoutedTransition
                                points="
        220,388
        85,388
        85,258
    "
                            />

                            <RoutedTransition
                                points="
        220,488
        85,488
        85,258
    "
                            />

                            <line
                                x1="85"
                                y1="388"
                                x2="220"
                                y2="388"
                                stroke="#607080"
                                strokeWidth="2"
                            />

                            <line
                                x1="85"
                                y1="488"
                                x2="220"
                                y2="488"
                                stroke="#607080"
                                strokeWidth="2"
                            />

                            <line
                                x1="85"
                                y1="488"
                                x2="85"
                                y2="170"
                                stroke="#607080"
                                strokeWidth="2"
                            />

                            {/* Stopped -> Resetting */}
                            <line
                                x1="110"
                                y1="388"
                                x2="85"
                                y2="388"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />

                            {/* Aborted -> Resetting */}
                            <line
                                x1="110"
                                y1="488"
                                x2="85"
                                y2="488"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />

                            <line
                                x1="85"
                                y1="340"
                                x2="85"
                                y2="286"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />

                            {/* Unholding -> Execute */}

                            <line
                                x1="290"
                                y1="245"
                                x2="445"
                                y2="164"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />

                            {/* Execute -> Pausing */}

                            <line
                                x1="445"
                                y1="120"
                                x2="560"
                                y2="85"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />

                            {/* Resuming -> Execute */}

                            <line
                                x1="325"
                                y1="85"
                                x2="445"
                                y2="120"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />

                            {/* to Holding */}

                            <line
                                x1="650"
                                y1="210"
                                x2="650"
                                y2="260"
                                stroke="#607080"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />

                        </svg>

                        {states.map((state) => (
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

                <Box
                    sx={{
                        width: 280,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    {stateGroups.map((group) => (
                        <Box
                            key={group.level}
                            sx={{
                                backgroundColor: group.color,
                                border: "1px solid #ccc",
                                p: 1,
                                borderRadius: 1,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                Level {group.level}
                            </Typography>

                            {group.states.map((state) => (
                                <Typography
                                    key={state}
                                    variant="body2"
                                >
                                    • {state}
                                </Typography>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}