export interface ShapeDefinition {
    displayName: string;
    amlType?: string;
    refBaseSystemUnitPath?: string;
    width: number;
    height: number;
    fill?: string;
    imageSrc?: string;
    ports: number;
    eClassId: number;
}

export const shapeRegistry = {

    // Equipments

    column: {
        displayName: "column",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 80,
        height: 120,
        imageSrc: "/symbols/column.png",
        ports: 2,
        eClassId: 123456, //todo: Example eClassId, replace with actual value
    },

    heatExchanger: {
        displayName: "Heat Exchanger",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 70,
        height: 70,
        imageSrc: "/symbols/heat_exchanger.png",
        ports: 2,
        eClassId: 123457, //todo: Example eClassId, replace with actual value
    },

    reactor: {
        displayName: "Reactor",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 120,
        height: 120,
        imageSrc: "/symbols/reactor.png",
        ports: 2,
        portOffsetY: 60,
        eClassId: 123458, //todo: Example eClassId, replace with actual value
    },

    vessel: {
        displayName: "Vessel",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 80,
        height: 120,
        imageSrc: "/symbols/vessel.png",
        ports: 2,
        eClassId: 123459, //todo: Example eClassId, replace with actual value
    },

    //Valves
    checkValve: {
        displayName: "CheckValve",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 80,
        height: 40,
        imageSrc: "/symbols/check_valve.png",
        ports: 2,
        eClassId: 123460, //todo: Example eClassId, replace with actual value
    },

    blockValve: {
        displayName: "BlockValve",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 80,
        height: 40,
        imageSrc: "/symbols/block_valve.png",
        ports: 2,
        eClassId: 123461, //todo: Example eClassId, replace with actual value
    },

    controlValve: {
        displayName: "ControlValve",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 80,
        height: 40,
        imageSrc: "/symbols/control_valve.png",
        ports: 2,
        eClassId: 123462, //todo: Example eClassId, replace with actual value
    },

    threeWayValve: {
        displayName: "Three Way Valve",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 80,
        height: 40,
        imageSrc: "/symbols/three_way_valve.png",
        ports: 2,
        eClassId: 123463, //todo: Example eClassId, replace with actual value
    },
    /*circle: {
        displayName: "Circle",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 100,
        height: 100,
        fill: "#ef6c00",
        ports: 1,
    },*/

    //Controllers

    controller: {
        displayName: "Controller",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 70,
        height: 70,
        imageSrc: "/symbols/controller.png",
        ports: 2,
        eClassId: 123464, //todo: Example eClassId, replace with actual value
    },

    mixer: {
        displayName: "Mixer",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 70,
        height: 70,
        imageSrc: "/symbols/mixer.png",
        ports: 2,
        eClassId: 123465, //todo: Example eClassId, replace with actual value
    },

    pump: {
        displayName: "Pump",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 70,
        height: 70,
        imageSrc: "/symbols/pump.png",
        ports: 2,
        eClassId: 123466, //todo: Example eClassId, replace with actual value
    },

    //Indicators

    analogIndicator: {
        displayName: "AnalogIndicator",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/analog_indicator.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123467, //todo: Example eClassId, replace with actual value
    },

    binaryIndicator: {
        displayName: "BinaryIndicator",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/binary_indicator.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123468, //todo: Example eClassId, replace with actual value
    },

    arithmeticIndicator: {
        displayName: "ArithmeticIndicator",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/arithmetic_indicator.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123469, //todo: Example eClassId, replace with actual value
    },

    //Instruments

    flowTransmitter: {
        displayName: "FlowTransmitter",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/flow_transmitter.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123470, //todo: Example eClassId, replace with actual value
    },

    levelTransmitter: {
        displayName: "LevelTransmitter",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/level_transmitter.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123471, //todo: Example eClassId, replace with actual value
    },

    levelTransmitterBar: {
        displayName: "LevelTransmitterBar",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/level_transmitter_bar.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123472, //todo: Example eClassId, replace with actual value
    },

    pressureTransmitter: {
        displayName: "PressureTransmitter",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/pressure_transmitter.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123473, //todo: Example eClassId, replace with actual value
    },

    temperatureTransmitter: {
        displayName: "TemperatureTransmitter",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        imageSrc: "/symbols/temperature_transmitter.png",
        width: 70,
        height: 70,
        fill: "#ef6c00",
        ports: 2,
        eClassId: 123474, //todo: Example eClassId, replace with actual value
    },

    //parameters

    //operators

    //Interlocks

    //Contant

    /*rectangle: {
        displayName: "Rectangle",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 150,
        height: 100,
        fill: "#1976d2",
        ports: 1,
    },*/

    /*tank: {
        displayName: "Tank",
        amlType: "InternalElement",
        refBaseSystemUnitPath: "MTPHMISUCLib/VisualObject",
        width: 120,
        height: 160,
        fill: "#4caf50",
        ports: 2,
    },*/
};