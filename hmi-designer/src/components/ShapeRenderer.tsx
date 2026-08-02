import { ShapeModel } from "../types/Shape";
import DesignerImageSymbol from "./DesignerImageSymbol";

interface Props {
  shape: ShapeModel;
}

export default function ShapeRenderer({shape,}: Props) {
    switch (shape.type) {
        case "column":
        case "heatExchanger":
        case "reactor":
        case "vessel": 
        case "checkValve":
        case "controlValve":
        case "blockValve":
        case "threeWayValve":
        case "controller":
        case "mixer":
        case "pump":
        case "analogIndicator": 
        case "binaryIndicator": 
        case "arithmeticIndicator": 
        case "flowTransmitter": 
        case "levelTransmitter": 
        case "levelTransmitterBar": 
        case "pressureTransmitter": 
        case "temperatureTransmitter": 
            return (
                <DesignerImageSymbol
                    shape={shape}
                />
            );

        default:
            return (
                <DesignerImageSymbol
                    shape={shape}
                />
            );
    }
}