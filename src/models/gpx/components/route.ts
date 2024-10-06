import { Link } from "@models/gpx/components/meta";
import { Extensions, Waypoint } from "@models/gpx/components";
import { XmlElement } from "@models/xml";

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

  public static hydrate(element: XmlElement): Route {
    const name = element.getChildText("name");
    const cmt = element.getChildText("cmt");
    const desc = element.getChildText("desc");
    const src = element.getChildText("src");

    const linkElements = element.getChildren("link");
    const link = linkElements.map((linkElem) => Link.hydrate(linkElem));

    const number = element.getChildTextAsInt("number");
    const type = element.getChildText("type");

    const extensionsElement = element.getChild("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;

    const rteptElements = element.getChildren("rtept");
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
