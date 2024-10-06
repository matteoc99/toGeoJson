import { Extensions, Waypoint } from "@models/gpx/components";
import { XmlElement } from "@models/xml";

export default class TrackSegment {
  trkpt?: Waypoint[];
  extensions?: Extensions;

  constructor(trkpt?: Waypoint[], extensions?: Extensions) {
    this.trkpt = trkpt;
    this.extensions = extensions;
  }

  public static hydrate(element: XmlElement): TrackSegment {
    const trkptElements = element.getChildren("trkpt");
    const trkpt = trkptElements.map((trkptElem) => Waypoint.hydrate(trkptElem));

    const extensionsElement = element.getChild("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;

    return new TrackSegment(trkpt, extensions);
  }
}
