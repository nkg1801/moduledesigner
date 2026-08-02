import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DesignerCanvas from "./canvas/DesignerCanvas";
import { useEditorStore } from "./store/editorStore";
import Button from "@mui/material/Button";
import useDeleteKey from "./hooks/useDeleteKey";
import PropertyInspector from "./components/PropertyInspector";
import ShapePalette from "./components/ShapePalette";
import { useEffect } from "react";
import { useState } from "react";
import ProjectExplorer from "./components/ProjectExplorer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ServiceDesigner from "./canvas/ServiceDesigner";
import Drawer from "@mui/material/Drawer";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";

function App() {

    const selectedShapeIds = useEditorStore((state) => state.selectedShapeIds);
    const addConnection = useEditorStore((state) => state.addConnection);
    const selectedPortIds = useEditorStore((state) => state.selectedPortIds);
    const deleteSelectedConnection = useEditorStore((state) => state.deleteSelectedConnection);
    useDeleteKey();
    const shapes =
        useEditorStore((state) => {

            const currentHmi =
                state.hmis.find(
                    (hmi) =>
                        hmi.id ===
                        state.selectedHmiId
                );

            return (
                currentHmi?.shapes ?? []
            );
        });

    const connections =
        useEditorStore((state) => {

            const currentHmi =
                state.hmis.find(
                    (hmi) =>
                        hmi.id ===
                        state.selectedHmiId
                );

            return (
                currentHmi?.connections ?? []
            );
        });

    const selectedShape = shapes.find((shape) => selectedShapeIds.includes(shape.id));
    const clearSelectedPorts = useEditorStore((state) => state.clearSelectedPorts);
    const hmis = useEditorStore((state) => state.hmis);
    const selectedHmiId = useEditorStore((state) => state.selectedHmiId);
    const selectHmi = useEditorStore((state) => state.selectHmi);
    const addHmi = useEditorStore((state) => state.addHmi);
    const openEditors = useEditorStore((state) => state.openEditors);
    const activeEditor = useEditorStore((state) => state.activeEditor);
    const setActiveEditor = useEditorStore((state) => state.setActiveEditor);
    const activeTabValue = `${activeEditor.type}-${activeEditor.id}`;
    const services = useEditorStore((state) => state.services);
    const isServiceEditor = activeEditor?.type === "service";
    const [showProperties, setShowProperties] = useState(false);
    const [showProjectExplorer, setShowProjectExplorer] = useState(true);


    useEffect(() => {

        if (selectedPortIds.length !== 2) {
            return;
        }

        const sourcePortId = selectedPortIds[0];
        const targetPortId = selectedPortIds[1];

        let sourceShape;
        let targetShape;

        for (const shape of shapes) {

            if (shape.ports?.some((p) => p.id === sourcePortId)) {
                sourceShape = shape;
            }

            if (shape.ports?.some((p) => p.id === targetPortId)) {
                targetShape = shape;
            }
        }

        if (sourcePortId === targetPortId) {
            clearSelectedPorts();
            return;
        }

        if (!sourceShape || !targetShape) {
            clearSelectedPorts();
            return;
        }

        if (sourceShape.id === targetShape.id) {
            clearSelectedPorts();
            return;
        }

        addConnection(sourceShape.id, sourcePortId, targetShape.id, targetPortId);

        clearSelectedPorts();

    }, [
        selectedPortIds,
        shapes,
        addConnection,
        clearSelectedPorts,
    ]);

    const exportXml = () => {
        const xml = `<Project>
            <InstanceHierarchy Name="Project">

            ${hmis.map(
                (hmi) => `

        <InternalElement
            Name="${hmi.name}"
            ID="${hmi.id}">

        ${hmi.shapes.map(
                    (s) => `
  <InternalElement
    Name="${s.name}"
    ID="${s.id}"
    RefBaseSystemUnitPath="${s.refBaseSystemUnitPath}">

    <Attribute
        Name="eClassVersion"
        AttributeDataType="xs:string">
        <Value>9.1</Value>
    </Attribute>

    <Attribute
        Name="eClassClassificationClass"
        AttributeDataType="xs:string">
        <Value>37010203</Value>
    </Attribute>

    <Attribute
        Name="eClassIRDI"
        AttributeDataType="xs:string" />

    <Attribute
        Name="RefID"
        RefAttributeType="MTPATLib/IDReferenceType/RefIDAttributeType"
        AttributeDataType="xs:string">
        <Value>${s.id}</Value>
    </Attribute>

    <Attribute Name="ZIndex">
        <Value>0</Value>
    </Attribute>

    <Attribute
        Name="Width"
        AttributeDataType="xs:integer">
        <Value>${Math.round(s.width)}</Value>
    </Attribute>

    <Attribute
        Name="Height"
        AttributeDataType="xs:integer">
      <Value>${Math.round(s.height)}</Value>
    </Attribute>

    <Attribute
        Name="X"
        AttributeDataType="xs:integer">
      <Value>${Math.round(s.x)}</Value>
    </Attribute>

    <Attribute
        Name="Y"
        AttributeDataType="xs:integer">
      <Value>${Math.round(s.y)}</Value>
    </Attribute>

    <Attribute
        Name="Rotation"
        AttributeDataType="xs:integer">
        <Value>0</Value>
    </Attribute>

${s.ports?.map(
                        (p) => `
    <InternalElement
        Name="${s.name}_${p.name}"
        ID="${p.id}"
        RefBaseSystemUnitPath="MTPHMISUCLib/PortObject/Nozzle">

      <Attribute
          Name="X"
          AttributeDataType="xs:integer">
        <Value>${Math.round(s.x + p.offsetX)}</Value>
      </Attribute>

      <Attribute
          Name="Y"
          AttributeDataType="xs:integer">
        <Value>${Math.round(s.y + p.offsetY)}</Value>
      </Attribute>

      <ExternalInterface
          Name="Connector"
          ID="${p.id}_IF"
          RefBaseClassPath="MTPHMIInterfaceLib/ConnectorInterface/MassFlowConnector" />

      <RoleRequirements
          RefBaseRoleClassPath="AutomationMLBaseRoleClassLib/AutomationMLBaseRole" />

    </InternalElement>
  `
                    ).join("\n")}

    <RoleRequirements
        RefBaseRoleClassPath=
        "AutomationMLBaseRoleClassLib/AutomationMLBaseRole" />

  </InternalElement>`
                ).join("\n")}

            ${hmi.connections.map(
                (c, index) => `
    <InternalLink
        Name="Link_${index + 1}"
        RefPartnerSideA="${c.sourcePortId}_IF"
        RefPartnerSideB="${c.targetPortId}_IF"
    />`
                ).join("\n")}
            </InternalElement>
            `).join("\n")}

</InstanceHierarchy>
</Project>
`;

        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.xml";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            {/* Toolbar */}

           


            <Box
                sx={{
                    height: 48,
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    bgcolor: "#f5f5f5",
                }}
            >
                <Typography variant="h6">
                    Module Designer for Freelance Engineering 2047
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => setShowProperties(true)}
                >
                    Properties
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={exportXml}
                >
                    Export MTP
                </Button>
            </Box>

            {/* Main Area */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    minWidth: 0,
                }}
            >
                {/* Project Explorer */}

                <Box
                    sx={{
                        width: showProjectExplorer ? 250 : 40,
                        borderRight: "1px solid #ddd",
                        transition: "width 0.2s ease",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    {showProjectExplorer ? (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    p: 0.5,
                                }}
                            >
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        setShowProjectExplorer(false)
                                    }
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                            </Box>

                            <ProjectExplorer />
                        </>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                pt: 1,
                            }}
                        >
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        setShowProjectExplorer(true)
                                    }
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                        </Box>
                    )}
                </Box>


                {/* Shape Library */}
                {!isServiceEditor && (
                    <Box
                        sx={{
                            width: 250,
                            borderRight: "1px solid #ddd",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                p: 1,
                            }}
                        >
                            <ShapePalette />
                        </Box>

                        <Box
                            sx={{
                                p: 1,
                                borderTop: "1px solid #ddd",
                            }}
                        >
                            <Button
                                fullWidth
                                sx={{ mt: 1 }}
                                onClick={deleteSelectedConnection}
                            >
                                Delete Connection
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Canvas Area */}
                <Box
                    sx={{
                        flexGrow: 1,
                        flexShrink: 1,
                        flexBasis: 0,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",

                    }}
                >

                    {/* HMI Tabs */}
                    <Tabs
                        value={activeTabValue}
                        onChange={(_, value) => {

                            const editor =
                                openEditors.find(
                                    (e) =>
                                        `${e.type}-${e.id}` === value
                                );

                            if (!editor) {
                                return;
                            }

                            setActiveEditor(editor);

                            if (editor.type === "hmi") {
                                selectHmi(editor.id);
                            }
                        }}
                        sx={{
                            borderBottom: "1px solid #ddd",
                            backgroundColor: "white",
                        }}
                    >
                        {openEditors.map((editor) => {

                            const label =
                                editor.type === "hmi"
                                    ? hmis.find(
                                        (h) => h.id === editor.id
                                    )?.name
                                    : services.find(
                                        (s) => s.id === editor.id
                                    )?.name;

                            return (
                                <Tab
                                    key={`${editor.type}-${editor.id}`}
                                    value={`${editor.type}-${editor.id}`}
                                    label={label}
                                />
                            );
                        })}

                        <Tab
                            label="+"
                            onClick={(e) => {

                                e.preventDefault();

                                const name =
                                    prompt(
                                        "New HMI Name",
                                        `HMI_${hmis.length + 1}`
                                    );

                                if (!name) {
                                    return;
                                }

                                addHmi(name);
                            }}
                        />
                    </Tabs>

                    {/* Canvas + Properties Split */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            minHeight: 0,
                            border: "4px solid orange",
                        }}
                    >
                        {/* Canvas */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                minWidth: 0,
                                minHeight: 0,
                                bgcolor: "#fafafa",
                            }}
                        >
                            {activeEditor.type === "service"
                                ? <ServiceDesigner />
                                : <DesignerCanvas />
                            }
                        </Box>


                        {/* Property Panel */}

                        {activeEditor.type !== "service" && (
                            <Drawer
                                anchor="right"
                                open={showProperties}
                                onClose={() => setShowProperties(false)}
                            >
                                <Box
                                    sx={{
                                        width: 250,
                                        p: 2,
                                    }}
                                >
                                    <PropertyInspector />
                                </Box>
                            </Drawer>
                        )}

                    </Box>

                </Box>
            </Box>
        </Box>
    );
}

export default App;