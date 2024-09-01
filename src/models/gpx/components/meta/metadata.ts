import { Bounds, Copyright, Link, Person } from "@models/gpx/components/meta";
import { Extensions } from "@models/gpx/components";

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

  public static hydrate(element: Element): Metadata {
    const name = element.querySelector("name")?.textContent || undefined;
    const desc = element.querySelector("desc")?.textContent || undefined;
    const authorElement = element.querySelector("author");
    const author = authorElement ? Person.hydrate(authorElement) : undefined;
    const copyrightElement = element.querySelector("copyright");
    const copyright = copyrightElement
      ? Copyright.hydrate(copyrightElement)
      : undefined;
    const linkElements = Array.from(element.querySelectorAll("link"));
    const link = linkElements.map((linkElem) => Link.hydrate(linkElem));
    const time = element.querySelector("time")?.textContent || undefined;
    const keywords =
      element.querySelector("keywords")?.textContent || undefined;
    const boundsElement = element.querySelector("bounds");
    const bounds = boundsElement ? Bounds.hydrate(boundsElement) : undefined;
    const extensionsElement = element.querySelector("extensions");
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
