import { GeometryObjectInterface } from "@interfaces/geo";
import { LineString } from "@models/geo";

export default class MultiLineString implements GeometryObjectInterface {
  type = "MultiLineString";
  coordinates: Array<LineString["coordinates"]>;

  constructor(coordinates: Array<LineString["coordinates"]>) {
    this.coordinates = coordinates;
  }
}
