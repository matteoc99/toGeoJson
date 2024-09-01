import { Feature } from "@models/geo";

export default class FeatureCollection {
  type = "FeatureCollection";
  features: Array<Feature>;

  constructor(features: Array<Feature>) {
    this.features = features;
  }
}
