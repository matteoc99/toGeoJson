import { XmlNodeType } from "@type/xml";
import { XmlNode } from "@models/xml";

export default class XmlCData extends XmlNode {
  public content: string;

  constructor(content: string, parent: XmlNode | null = null) {
    super(XmlNodeType.CData, parent);
    this.content = content;
  }

  public toString(): string {
    return this.content;
  }
}
