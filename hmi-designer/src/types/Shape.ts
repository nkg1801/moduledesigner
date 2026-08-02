import { PortModel } from "./Port";
export interface ShapeModel {
    id: string;
    name: string;
    imageSrc?: string;

    type:
    | "analogIndicator"
    | "column"
    | "controlValve"
    | "checkValve"
    | "blockValve"
    | "threeWayValve"
    | "pump"
    | "controller"
    | "reactor"
    | "heatExchanger"
    | "vessel"
    | "mixer"
    | "binaryIndicator"
    | "arithmeticIndicator"
    | "flowTransmitter"
    | "levelTransmitter"
    | "levelTransmitterBar"
    | "pressureTransmitter"
    | "temperatureTransmitter";

    amlType: string;
    refBaseSystemUnitPath: string;
    ports?: PortModel[];

    x: number;
    y: number;

    width: number;
    height: number;
    fill?: string;
    eClassId?: number;
}