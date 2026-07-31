//import DesignerRect from "./DesignerRect";
//import DesignerCircle from "./DesignerCircle";
import { ShapeModel } from "../types/Shape";
//import DesignerTank from "./DesignerTank";
import DesignerImageSymbol from "./DesignerImageSymbol";

interface Props {
  shape: ShapeModel;
}

export default function ShapeRenderer({shape,}: Props) {
    switch (shape.type) {
        /*case "circle":
            return (
                <DesignerCircle
                    shape={shape}
                />
            );

        case "tank":
            return (
                <DesignerTank
                    shape={shape}
                />
            );*/

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