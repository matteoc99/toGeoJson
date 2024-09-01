export default class Link {
  href!: string; // required attribute
  text?: string;
  type?: string;

  constructor(href: string, text?: string, type?: string) {
    this.href = href;
    this.text = text;
    this.type = type;
  }

  public static hydrate(element: Element): Link {
    const href = element.getAttribute("href") || "";
    const text = element.querySelector("text")?.textContent || undefined;
    const type = element.querySelector("type")?.textContent || undefined;

    return new Link(href, text, type);
  }
}
