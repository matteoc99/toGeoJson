import { Link } from "@models/gpx/components/meta";
import { Extensions, Waypoint } from "@models/gpx/components";

export default class Route {
  name?: string;
  cmt?: string;
  desc?: string;
  src?: string;
  link?: Link[];
  number?: number;
  type?: string;
  extensions?: Extensions;
  rtept?: Waypoint[];

  constructor(
    name?: string,
    cmt?: string,
    desc?: string,
    src?: string,
    link?: Link[],
    number?: number,
    type?: string,
    extensions?: Extensions,
    rtept?: Waypoint[],
  ) {
    this.name = name;
    this.cmt = cmt;
    this.desc = desc;
    this.src = src;
    this.link = link;
    this.number = number;
    this.type = type;
    this.extensions = extensions;
    this.rtept = rtept;
  }

  public static hydrate(element: Element): Route {
    const name = element.querySelector("name")?.textContent || undefined;
    const cmt = element.querySelector("cmt")?.textContent || undefined;
    const desc = element.querySelector("desc")?.textContent || undefined;
    const src = element.querySelector("src")?.textContent || undefined;
    const linkElements = Array.from(element.querySelectorAll("link"));
    const link = linkElements.map((linkElem) => Link.hydrate(linkElem));
    const number = element.querySelector("number")
      ? parseInt(element.querySelector("number")!.textContent!)
      : undefined;
    const type = element.querySelector("type")?.textContent || undefined;
    const extensionsElement = element.querySelector("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;
    const rteptElements = Array.from(element.querySelectorAll("rtept"));
    const rtept = rteptElements.map((rteptElem) => Waypoint.hydrate(rteptElem));

    return new Route(
      name,
      cmt,
      desc,
      src,
      link,
      number,
      type,
      extensions,
      rtept,
    );
  }
}
