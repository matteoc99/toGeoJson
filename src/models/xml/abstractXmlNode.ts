import { XmlNodeType } from "@type/xml";

export default abstract class XmlNode {
  public type: XmlNodeType;
  public parent: XmlNode | null;

  protected constructor(type: XmlNodeType, parent: XmlNode | null = null) {
    this.type = type;
    this.parent = parent;
  }

  public abstract toString(): string;
}
