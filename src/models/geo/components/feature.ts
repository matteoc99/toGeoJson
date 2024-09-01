import { GeometryObjectInterface } from "@interfaces/geo";

export default class Feature {
  type = "Feature";
  geometry?: GeometryObjectInterface;
  properties?: object;
}
