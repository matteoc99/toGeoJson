import { XmlNodeType } from "@type/xml";
import { XmlNode } from "@models/xml";

export default class XmlProcessingInstruction extends XmlNode {
  public target: string;
  public data: string;

  constructor(target: string, data: string, parent: XmlNode | null = null) {
    super(XmlNodeType.ProcessingInstruction, parent);
    this.target = target;
    this.data = data;
  }

  public toString(): string {
    return "";
  }
}
