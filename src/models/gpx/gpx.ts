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

  private constructor(
    version: string,
    creator: string,
    metadata?: Metadata,
    wpt?: Waypoint[],
    rte?: Route[],
    trk?: Track[],
    extensions?: Extensions,
  ) {
    this.version = version;
    this.creator = creator;
    this.metadata = metadata;
    this.wpt = wpt;
    this.rte = rte;
    this.trk = trk;
    this.extensions = extensions;
  }

  public static hydrate(xmlDoc: XmlElement): Gpx {
    const version = xmlDoc.getAttribute("version");
    const creator = xmlDoc.getAttribute("creator");

    const metadataElement = xmlDoc.getChild("metadata");
    // const metadata = metadataElement
    //   ? Metadata.hydrate(metadataElement)
    //   : undefined;

    // const waypointElements = Array.from(xmlDoc.getElementsByTagName("wpt"));
    // const wpt = waypointElements.map((wptElem) => Waypoint.hydrate(wptElem));
    //
    // const routeElements = Array.from(xmlDoc.getElementsByTagName("rte"));
    // const rte = routeElements.map((rteElem) => Route.hydrate(rteElem));
    //
    // const trackElements = Array.from(xmlDoc.getElementsByTagName("trk"));
    // const trk = trackElements.map((trkElem) => Track.hydrate(trkElem));
    //
    // const extensionsElement = xmlDoc.querySelector("extensions");
    // const extensions = extensionsElement
    //   ? Extensions.hydrate(extensionsElement)
    //   : undefined;

    return new Gpx(version!.toString(), creator!.toString());
  }
}
