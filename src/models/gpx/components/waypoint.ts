// Waypoint.ts

import {
  DegreesType,
  DGPSStationType,
  FixType,
  LatitudeType,
  LongitudeType,
} from "@type/gpx";
import { Extensions, Point } from "@models/gpx/components";
import { Link } from "@models/gpx/components/meta";
import { XmlElement } from "@models/xml";

export default class Waypoint extends Point {
  ele?: number;
  time?: string;
  magvar?: DegreesType;
  geoidheight?: number;
  name?: string;
  cmt?: string;
  desc?: string;
  src?: string;
  link?: Link[];
  sym?: string;
  type?: string;
  fix?: FixType;
  sat?: number;
  hdop?: number;
  vdop?: number;
  pdop?: number;
  ageofdgpsdata?: number;
  dgpsid?: DGPSStationType;
  extensions?: Extensions;

  constructor(
    lat: LatitudeType,
    lon: LongitudeType,
    options?: {
      ele?: number;
      time?: string;
      magvar?: DegreesType;
      geoidheight?: number;
      name?: string;
      cmt?: string;
      desc?: string;
      src?: string;
      link?: Link[];
      sym?: string;
      type?: string;
      fix?: FixType;
      sat?: number;
      hdop?: number;
      vdop?: number;
      pdop?: number;
      ageofdgpsdata?: number;
      dgpsid?: DGPSStationType;
      extensions?: Extensions;
    },
  ) {
    super(lat, lon, options?.ele, options?.time);
    this.magvar = options?.magvar;
    this.geoidheight = options?.geoidheight;
    this.name = options?.name;
    this.cmt = options?.cmt;
    this.desc = options?.desc;
    this.src = options?.src;
    this.link = options?.link;
    this.sym = options?.sym;
    this.type = options?.type;
    this.fix = options?.fix;
    this.sat = options?.sat;
    this.hdop = options?.hdop;
    this.vdop = options?.vdop;
    this.pdop = options?.pdop;
    this.ageofdgpsdata = options?.ageofdgpsdata;
    this.dgpsid = options?.dgpsid;
    this.extensions = options?.extensions;
  }

  public static hydrate(element: XmlElement): Waypoint {
    const latAttr = element.getAttribute("lat");
    const lonAttr = element.getAttribute("lon");

    if (latAttr === null || lonAttr === null) {
      throw new Error("Waypoint element must have lat and lon attributes.");
    }

    const lat = parseFloat(latAttr);
    const lon = parseFloat(lonAttr);

    const ele = element.getChildTextAsFloat("ele");
    const time = element.getChildText("time");
    const magvar = element.getChildTextAsFloat("magvar") as
      | DegreesType
      | undefined;
    const geoidheight = element.getChildTextAsFloat("geoidheight");
    const name = element.getChildText("name");
    const cmt = element.getChildText("cmt");
    const desc = element.getChildText("desc");
    const src = element.getChildText("src");

    const linkElements = element.getChildren("link");
    const links = linkElements.map((linkElem) => Link.hydrate(linkElem));

    const sym = element.getChildText("sym");
    const type = element.getChildText("type");
    const fix = element.getChildText("fix") as FixType | undefined;
    const sat = element.getChildTextAsInt("sat");
    const hdop = element.getChildTextAsFloat("hdop");
    const vdop = element.getChildTextAsFloat("vdop");
    const pdop = element.getChildTextAsFloat("pdop");
    const ageofdgpsdata = element.getChildTextAsFloat("ageofdgpsdata");
    const dgpsid = element.getChildTextAsInt("dgpsid") as
      | DGPSStationType
      | undefined;

    const extensionsElement = element.getChild("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;

    return new Waypoint(lat, lon, {
      ele,
      time,
      magvar,
      geoidheight,
      name,
      cmt,
      desc,
      src,
      link: links,
      sym,
      type,
      fix,
      sat,
      hdop,
      vdop,
      pdop,
      ageofdgpsdata,
      dgpsid,
      extensions,
    });
  }
}
