export default class Copyright {
  author!: string;
  year?: string;
  license?: string;

  constructor(author: string, year?: string, license?: string) {
    this.author = author;
    this.year = year;
    this.license = license;
  }

  public static hydrate(element: Element): Copyright {
    const author = element.getAttribute("author") || "";
    const year = element.querySelector("year")?.textContent || undefined;
    const license = element.querySelector("license")?.textContent || undefined;

    return new Copyright(author, year, license);
  }
}
