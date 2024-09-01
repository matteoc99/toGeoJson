import { GeometryObjectInterface } from "@interfaces/geo";
import { Polygon } from "@models/geo";

export default class MultiPolygon implements GeometryObjectInterface {
  type = "MultiPolygon";
  coordinates: Array<Polygon["coordinates"]>;

  constructor(coordinates: Array<Polygon["coordinates"]>) {
    this.coordinates = coordinates;
  }
}
