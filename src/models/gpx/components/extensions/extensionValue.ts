import { XmlElement } from "@models/xml";

export default class ExtensionValue {
  name!: string;
  value!: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

  public static hydrate(element: XmlElement): ExtensionValue {
    const name = element.name;
    const value = element.getTextContent();

    return new ExtensionValue(name, value);
  }
}
