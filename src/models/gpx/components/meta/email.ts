import { XmlElement } from "@models/xml";

export default class Email {
  id!: string;
  domain!: string;

  constructor(id: string, domain: string) {
    this.id = id;
    this.domain = domain;
  }

  public static hydrate(element: XmlElement): Email {
    const id = element.getAttribute("id") || "";
    const domain = element.getAttribute("domain") || "";

    return new Email(id, domain);
  }
}
