import { Metadata } from "@models/gpx/components/meta";
import { Extensions, Route, Track, Waypoint } from "@models/gpx/components";
import { XmlElement } from "@models/xml";

export default class Gpx {
  version!: string;
  creator!: string;
  metadata?: Metadata;
  wpt?: Waypoint[];
  rte?: Route[];
  trk?: Track[];
  extensions?: Extensions;

  constructor(
    version: string,
    creator: string,
    options: {
      metadata?: Metadata;
      wpt?: Waypoint[];
      rte?: Route[];
      trk?: Track[];
      extensions?: Extensions;
    } = {},
  ) {
    this.version = version;
    this.creator = creator;
    this.metadata = options.metadata;
    this.wpt = options.wpt;
    this.rte = options.rte;
    this.trk = options.trk;
    this.extensions = options.extensions;
  }

  public static hydrate(xmlDoc: XmlElement): Gpx {
    // Ensure that required attributes exist
    const version = xmlDoc.getAttribute("version");
    const creator = xmlDoc.getAttribute("creator");

    if (!version) {
      throw new Error("GPX element is missing required 'version' attribute.");
    }
    if (!creator) {
      throw new Error("GPX element is missing required 'creator' attribute.");
    }

    // Hydrate metadata
    const metadataElement = xmlDoc.getChild("metadata");
    const metadata = metadataElement
      ? Metadata.hydrate(metadataElement)
      : undefined;

    // Hydrate waypoints
    const waypointElements = xmlDoc.getChildren("wpt");
    const wpt = waypointElements.map((wptElem) => Waypoint.hydrate(wptElem));

    // Hydrate routes
    const routeElements = xmlDoc.getChildren("rte");
    const rte = routeElements.map((rteElem) => Route.hydrate(rteElem));

    // Hydrate tracks
    const trackElements = xmlDoc.getChildren("trk");
    const trk = trackElements.map((trkElem) => Track.hydrate(trkElem));

    // Hydrate extensions
    const extensionsElement = xmlDoc.getChild("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;

    return new Gpx(version, creator, {
      metadata,
      wpt,
      rte,
      trk,
      extensions,
    });
  }
}
