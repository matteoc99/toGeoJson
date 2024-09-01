import { XmlElement } from "@models/xml/index";

export default class XmlDocument {
  root: XmlElement;

  constructor(root: XmlElement) {
    this.root = root;
  }

  setRoot(root: XmlElement): void {
    this.root = root;
  }

  getRoot(): XmlElement {
    return this.root;
  }

  toString(indent: string = ""): string {
    return this.root.toString(indent);
  }

  findElementsByName(
    name: string,
    element: XmlElement = this.root,
  ): XmlElement[] {
    let results: XmlElement[] = [];

    if (element.name === name) {
      results.push(element);
    }

    for (const child of element.children) {
      if (child instanceof XmlElement) {
        results = results.concat(this.findElementsByName(name, child));
      }
    }

    return results;
  }
}
