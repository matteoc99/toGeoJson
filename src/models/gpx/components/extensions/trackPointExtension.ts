import { XmlElement } from "@models/xml";
import { ExtensionValue } from "@models/gpx/components/extensions/index";

export default class TrackPointExtension {
  children: ExtensionValue[];

  constructor(children: ExtensionValue[]) {
    this.children = children;
  }

  hasChild(name: string): boolean {
    return !!this.getChild(name);
  }

  getChild(name: string): ExtensionValue {
    const child = this.children.find((child) => child.name === name);
    if (!child) {
      throw new Error(`Child with name "${name}" not found`);
    }
    return child;
  }

  public static hydrate(element: XmlElement): TrackPointExtension {
    const children: ExtensionValue[] = [];

    element.children.forEach((child) => {
      if (child instanceof XmlElement) {
        children.push(ExtensionValue.hydrate(child));
      }
    });

    return new TrackPointExtension(children);
  }
}
