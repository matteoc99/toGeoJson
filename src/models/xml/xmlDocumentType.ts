import { XmlNode } from "@models/xml";
import { XmlNodeType } from "@type/xml";

export default class XmlDocumentType extends XmlNode {
  public name: string;
  public publicId: string;
  public systemId: string;

  constructor(
    name: string,
    publicId: string,
    systemId: string,
    parent: XmlNode | null = null,
  ) {
    super(XmlNodeType.DocumentType, parent);
    this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }

  public toString(): string {
    let ret = `<!DOCTYPE ${this.name}`;
    if (this.publicId) {
      ret += ` PUBLIC "${this.publicId}"`;
    } else if (this.systemId) {
      ret += ` SYSTEM "${this.systemId}"`;
    }
    ret += ">\n";
    return ret;
  }
}
