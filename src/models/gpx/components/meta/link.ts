import { XmlElement } from "@models/xml";

export default class Link {
  href!: string; // required attribute
  text?: string;
  type?: string;

  constructor(href: string, text?: string, type?: string) {
    this.href = href;
    this.text = text;
    this.type = type;
  }

  public static hydrate(element: XmlElement): Link {
    const href = element.getAttribute("href") || "";

    const text = element.getChildText("text");
    const type = element.getChildText("type");

    return new Link(href, text, type);
  }
}
