import {
  DegreesType,
  DGPSStationType,
  FixType,
  LatitudeType,
  LongitudeType,
} from "@type/gpx";
import { Extensions, Point } from "@models/gpx/components";
import { Link } from "@models/gpx/components/meta";

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
    ele?: number,
    time?: string,
    magvar?: DegreesType,
    geoidheight?: number,
    name?: string,
    cmt?: string,
    desc?: string,
    src?: string,
    link?: Link[],
    sym?: string,
    type?: string,
    fix?: FixType,
    sat?: number,
    hdop?: number,
    vdop?: number,
    pdop?: number,
    ageofdgpsdata?: number,
    dgpsid?: DGPSStationType,
    extensions?: Extensions,
  ) {
    super(lat, lon, ele, time);
    this.magvar = magvar;
    this.geoidheight = geoidheight;
    this.name = name;
    this.cmt = cmt;
    this.desc = desc;
    this.src = src;
    this.link = link;
    this.sym = sym;
    this.type = type;
    this.fix = fix;
    this.sat = sat;
    this.hdop = hdop;
    this.vdop = vdop;
    this.pdop = pdop;
    this.ageofdgpsdata = ageofdgpsdata;
    this.dgpsid = dgpsid;
    this.extensions = extensions;
  }

  public static hydrate(element: Element): Waypoint {
    const lat = parseFloat(element.getAttribute("lat")!);
    const lon = parseFloat(element.getAttribute("lon")!);
    const ele = element.querySelector("ele")
      ? parseFloat(element.querySelector("ele")!.textContent!)
      : undefined;
    const time = element.querySelector("time")?.textContent || undefined;
    const magvar = element.querySelector("magvar")
      ? parseFloat(element.querySelector("magvar")!.textContent!)
      : undefined;
    const geoidheight = element.querySelector("geoidheight")
      ? parseFloat(element.querySelector("geoidheight")!.textContent!)
      : undefined;
    const name = element.querySelector("name")?.textContent || undefined;
    const cmt = element.querySelector("cmt")?.textContent || undefined;
    const desc = element.querySelector("desc")?.textContent || undefined;
    const src = element.querySelector("src")?.textContent || undefined;
    const linkElements = Array.from(element.querySelectorAll("link"));
    const link = linkElements.map((linkElem) => Link.hydrate(linkElem));
    const sym = element.querySelector("sym")?.textContent || undefined;
    const type = element.querySelector("type")?.textContent || undefined;
    const fix =
      (element.querySelector("fix")?.textContent as FixType) || undefined;
    const sat = element.querySelector("sat")
      ? parseInt(element.querySelector("sat")!.textContent!)
      : undefined;
    const hdop = element.querySelector("hdop")
      ? parseFloat(element.querySelector("hdop")!.textContent!)
      : undefined;
    const vdop = element.querySelector("vdop")
      ? parseFloat(element.querySelector("vdop")!.textContent!)
      : undefined;
    const pdop = element.querySelector("pdop")
      ? parseFloat(element.querySelector("pdop")!.textContent!)
      : undefined;
    const ageofdgpsdata = element.querySelector("ageofdgpsdata")
      ? parseFloat(element.querySelector("ageofdgpsdata")!.textContent!)
      : undefined;
    const dgpsid = element.querySelector("dgpsid")
      ? parseInt(element.querySelector("dgpsid")!.textContent!)
      : undefined;
    const extensionsElement = element.querySelector("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;

    return new Waypoint(
      lat,
      lon,
      ele,
      time,
      magvar,
      geoidheight,
      name,
      cmt,
      desc,
      src,
      link,
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
    );
  }
}
