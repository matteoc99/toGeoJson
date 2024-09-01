import { Link } from "@models/gpx/components/meta";
import { Extensions, TrackSegment } from "@models/gpx/components";

export default class Track {
  name?: string;
  cmt?: string;
  desc?: string;
  src?: string;
  link?: Link[];
  number?: number;
  type?: string;
  extensions?: Extensions;
  trkseg?: TrackSegment[];

  constructor(
    name?: string,
    cmt?: string,
    desc?: string,
    src?: string,
    link?: Link[],
    number?: number,
    type?: string,
    extensions?: Extensions,
    trkseg?: TrackSegment[],
  ) {
    this.name = name;
    this.cmt = cmt;
    this.desc = desc;
    this.src = src;
    this.link = link;
    this.number = number;
    this.type = type;
    this.extensions = extensions;
    this.trkseg = trkseg;
  }

  public static hydrate(element: Element): Track {
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
    const trksegElements = Array.from(element.querySelectorAll("trkseg"));
    const trkseg = trksegElements.map((trksegElem) =>
      TrackSegment.hydrate(trksegElem),
    );

    return new Track(
      name,
      cmt,
      desc,
      src,
      link,
      number,
      type,
      extensions,
      trkseg,
    );
  }
}
