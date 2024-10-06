import { XmlElement } from "@models/xml";

export default class Extensions {
  keyValuePairs: { [key: string]: string };

  constructor(keyValuePairs: { [key: string]: string }) {
    this.keyValuePairs = keyValuePairs;
  }

  public static hydrate(element: XmlElement): Extensions {
    const keyValuePairs: { [key: string]: string } = {};

    element.children.forEach((child) => {
      if (child instanceof XmlElement) {
        const key = child.name;
        keyValuePairs[key] = child.getTextContent() || "";
      }
    });

    return new Extensions(keyValuePairs);
  }
}
