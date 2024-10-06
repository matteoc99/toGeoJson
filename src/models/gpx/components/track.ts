import { Link } from "@models/gpx/components/meta";
import { Extensions, TrackSegment } from "@models/gpx/components";
import { XmlElement } from "@models/xml";

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
  public static hydrate(element: XmlElement): Track {
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

    const trksegElements = element.getChildren("trkseg");
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
