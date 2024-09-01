import { Extensions, Waypoint } from "@models/gpx/components";

export default class TrackSegment {
  trkpt?: Waypoint[];
  extensions?: Extensions;

  constructor(trkpt?: Waypoint[], extensions?: Extensions) {
    this.trkpt = trkpt;
    this.extensions = extensions;
  }

  public static hydrate(element: Element): TrackSegment {
    const trkptElements = Array.from(element.querySelectorAll("trkpt"));
    const trkpt = trkptElements.map((trkptElem) => Waypoint.hydrate(trkptElem));
    const extensionsElement = element.querySelector("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;

    return new TrackSegment(trkpt, extensions);
  }
}
