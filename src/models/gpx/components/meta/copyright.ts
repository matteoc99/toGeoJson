import { XmlElement } from "@models/xml";

export default class Copyright {
  author!: string;
  year?: string;
  license?: string;

  constructor(author: string, year?: string, license?: string) {
    this.author = author;
    this.year = year;
    this.license = license;
  }

  public static hydrate(element: XmlElement): Copyright {
    const author = element.getAttribute("author") || "";

    const year = element.getChildText("year");
    const license = element.getChildText("license");

    return new Copyright(author, year, license);
  }
}
