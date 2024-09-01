import { GeometryObjectInterface } from "@interfaces/geo";
import { PositionType } from "@type/geo";

export default class Polygon implements GeometryObjectInterface {
  type = "Polygon";
  coordinates: Array<PositionType>; // todo

  constructor(coordinates: Array<PositionType>) {
    this.coordinates = coordinates;
  }
}
