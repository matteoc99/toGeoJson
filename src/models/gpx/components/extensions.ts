import { XmlElement } from "@models/xml";
import {
  ExtensionValue,
  TrackPointExtension,
} from "@models/gpx/components/extensions/index"; //todo why cant i remove /index

export default class Extensions {
  extensions: Array<TrackPointExtension | ExtensionValue>;

  constructor(extensions: Array<TrackPointExtension | ExtensionValue>) {
    this.extensions = extensions;
  }

  public static hydrate(element: XmlElement): Extensions {
    const extensions: Array<TrackPointExtension | ExtensionValue> = [];

    element.children.forEach((child) => {
      if (child instanceof XmlElement) {
        const name = child.name;
        switch (name) {
          case "TrackPointExtension":
            extensions.push(TrackPointExtension.hydrate(child));
            break;
          default:
            extensions.push(ExtensionValue.hydrate(child));
        }
      }
    });

    return new Extensions(extensions);
  }
}
