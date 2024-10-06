import { XmlNode } from "@models/xml";
import { XmlNodeType } from "@type/xml";

export default class XmlComment extends XmlNode {
  public content: string;

  constructor(content: string, parent: XmlNode | null = null) {
    super(XmlNodeType.Comment, parent);
    this.content = content;
  }

  public toString(): string {
    return this.content;
  }
}
