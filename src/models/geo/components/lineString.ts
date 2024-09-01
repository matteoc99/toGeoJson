import { GeometryObjectInterface } from "@interfaces/geo";
import { PositionType } from "@type/geo";

export default class LineString implements GeometryObjectInterface {
  type = "LineString";
  coordinates: Array<PositionType>;

  constructor(coordinates: Array<PositionType>) {
    this.coordinates = coordinates;
  }
}
