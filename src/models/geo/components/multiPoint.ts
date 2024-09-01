import { GeometryObjectInterface } from "@interfaces/geo";
import { Point } from "@models/geo";

export default class MultiPoint implements GeometryObjectInterface {
  type = "MultiPoint";
  coordinates: Array<Point["coordinates"]>;

  constructor(coordinates: Array<Point["coordinates"]>) {
    this.coordinates = coordinates;
  }
}
