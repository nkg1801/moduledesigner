import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DesignerCanvas from "./canvas/DesignerCanvas";
import { useEditorStore } from "./store/editorStore";
import Button from "@mui/material/Button";
import useDeleteKey from "./hooks/useDeleteKey";
import PropertyInspector from "./components/PropertyInspector";
import ShapePalette from "./components/ShapePalette";
import { useEffect } from "react";
import ProjectExplorer from "./components/ProjectExplorer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function App() {

    const selectedShapeIds = useEditorStore((state) => state.selectedShapeIds);
    const addConnection = useEditorStore((state) => state.addConnection);
    const selectedPortIds = useEditorStore((state) => state.selectedPortIds);
    const deleteSelectedConnection = useEditorStore((state) => state.deleteSelectedConnection);
    useDeleteKey();
    const shapes = useEditorStore((state) => state.shapes);
    const connections = useEditorStore((state) => state.connections);
    const selectedShape = shapes.find((shape) => selectedShapeIds.includes(shape.id));
    const clearSelectedPorts = useEditorStore((state) => state.clearSelectedPorts);
    const hmis = useEditorStore((state) => state.hmis);
    const selectedHmiId = useEditorStore((state) => state.selectedHmiId);
    const selectHmi = useEditorStore((state) => state.selectHmi);
    const addHmi = useEditorStore((state) => state.addHmi);

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
            <InstanceHierarchy Name="HMI">

            ${shapes
                .map(
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

            ${connections.map((c, index) => `
    <InternalLink
        Name="Link_${index + 1}"
       RefPartnerSideA="${c.sourcePortId}_IF"
        RefPartnerSideB="${c.targetPortId}_IF"
        />`
                )
                .join("\n")}

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
                    Module Designer for Freelance Engineering 2027
                </Typography>

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
                }}
            >
                {/* Project Explorer */}

                <Box
                    sx={{
                        width: 250,
                        borderRight: "1px solid #ddd",
                        p: 1,
                    }}
                >

                    <Typography
                        variant="subtitle1"
                        sx={{ mb: 1 }}
                    >
                        Project Explorer
                    </Typography>

                    <ProjectExplorer />

                </Box>


                {/* Shape Library */}
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
                            onClick={
                                deleteSelectedConnection
                            }
                        >
                            Delete Connection
                        </Button>
                    </Box>

                </Box>

                {/* Canvas Area */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >

                    {/* HMI Tabs */}
                    <Tabs
                        value={selectedHmiId}
                        onChange={(_, value) =>
                            selectHmi(value)
                        }
                        sx={{
                            borderBottom: "1px solid #ddd",
                            backgroundColor: "white",
                        }}
                    >
                        {hmis.map((hmi) => (
                            <Tab
                                key={hmi.id}
                                value={hmi.id}
                                label={hmi.name}
                            />
                        ))}

                        <Tab
                            label="+"
                            onClick={(e) => {
                                e.preventDefault();
                                addHmi();
                            }}
                        />
                    </Tabs>

                    {/* Canvas + Properties Split */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            minHeight: 0,
                        }}
                    >
                        {/* Canvas */}
                        <Box
                            sx={{
                                flex: 1,
                                bgcolor: "#fafafa",
                            }}
                        >
                            <DesignerCanvas />
                        </Box>

                        {/* Property Panel */}
                        <Box
                            sx={{
                                width: 400,

                                borderLeft:
                                    "2px solid #bdbdbd",

                                backgroundColor:
                                    "#fafadf",

                                boxShadow:
                                    "-2px 0 4px rgba(0,0,0,0.08)",

                                p: 1,

                                overflowY: "auto",
                            }}
                        >
                            <PropertyInspector />
                        </Box>

                    </Box>

                </Box>
            </Box>
        </Box>
    );
}

export default App;