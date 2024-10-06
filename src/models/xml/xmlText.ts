import { XmlNode } from "@models/xml";
import { XmlNodeType } from "@type/xml";

export default class XmlText extends XmlNode {
  public content: string;

  constructor(content: string, parent: XmlNode | null = null) {
    super(XmlNodeType.Text, parent);
    this.content = content;
  }
  public toString(): string {
    return this.content;
  }
}
