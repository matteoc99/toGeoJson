import { Bounds, Copyright, Link, Person } from "@models/gpx/components/meta";
import { Extensions } from "@models/gpx/components";
import { XmlElement } from "@models/xml";

export default class Metadata {
  name?: string;
  desc?: string;
  author?: Person;
  copyright?: Copyright;
  link?: Link[];
  time?: string;
  keywords?: string;
  bounds?: Bounds;
  extensions?: Extensions;

  constructor(
    name?: string,
    desc?: string,
    author?: Person,
    copyright?: Copyright,
    link?: Link[],
    time?: string,
    keywords?: string,
    bounds?: Bounds,
    extensions?: Extensions,
  ) {
    this.name = name;
    this.desc = desc;
    this.author = author;
    this.copyright = copyright;
    this.link = link;
    this.time = time;
    this.keywords = keywords;
    this.bounds = bounds;
    this.extensions = extensions;
  }

  public static hydrate(element: XmlElement): Metadata {
    const name = element.getChildText("name");
    const desc = element.getChildText("desc");

    const authorElement = element.getChild("author");
    const author = authorElement ? Person.hydrate(authorElement) : undefined;

    const copyrightElement = element.getChild("copyright");
    const copyright = copyrightElement
      ? Copyright.hydrate(copyrightElement)
      : undefined;

    const linkElements = element.getChildren("link");
    const link = linkElements.map((linkElem) => Link.hydrate(linkElem));

    const time = element.getChildText("time");
    const keywords = element.getChildText("keywords");

    const boundsElement = element.getChild("bounds");
    const bounds = boundsElement ? Bounds.hydrate(boundsElement) : undefined;

    const extensionsElement = element.getChild("extensions");
    const extensions = extensionsElement
      ? Extensions.hydrate(extensionsElement)
      : undefined;

    return new Metadata(
      name,
      desc,
      author,
      copyright,
      link,
      time,
      keywords,
      bounds,
      extensions,
    );
  }
}
