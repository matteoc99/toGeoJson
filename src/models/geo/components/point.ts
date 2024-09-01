import { GeometryObjectInterface } from "@interfaces/geo";
import { PositionType } from "@type/geo";

export default class Point implements GeometryObjectInterface {
  type = "Point";
  coordinates: PositionType;

  constructor(coordinates: PositionType) {
    this.coordinates = coordinates;
  }
}
