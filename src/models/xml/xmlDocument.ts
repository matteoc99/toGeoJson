import {
  XmlDeclaration,
  XmlDocumentType,
  XmlElement,
  XmlNode,
} from "@models/xml";
import { XmlNodeType } from "@type/xml";

export default class XmlDocument extends XmlNode {
  public declaration: XmlDeclaration | null;
  public doctype: XmlDocumentType | null;
  public children: XmlNode[];

  constructor(
    declaration: XmlDeclaration | null = null,
    doctype: XmlDocumentType | null = null,
    children: XmlNode[] = [],
  ) {
    super(XmlNodeType.Document, null);
    this.declaration = declaration;
    this.doctype = doctype;
    this.children = children;
  }

  public getRootElement(): XmlElement | null {
    return this.children.find(
      (node) => node.type === XmlNodeType.Element,
    ) as XmlElement | null;
  }

  public find(predicate: (node: XmlNode) => boolean): XmlNode | null {
    for (const child of this.children) {
      if (child instanceof XmlElement) {
        const result = child.find(predicate);
        if (result) {
          return result;
        }
      } else if (predicate(child)) {
        return child;
      }
    }
    return null;
  }

  public findAll(predicate: (node: XmlNode) => boolean): XmlNode[] {
    let results: XmlNode[] = [];
    for (const child of this.children) {
      if (child instanceof XmlElement) {
        results = results.concat(child.findAll(predicate));
      } else if (predicate(child)) {
        results.push(child);
      }
    }
    return results;
  }

  public addChild(node: XmlNode): void {
    node.parent = this;
    this.children.push(node);
  }
  public toString(): string {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>';
    if (this.declaration) {
      xmlString += this.declaration.toString();
    }
    if (this.doctype) {
      xmlString += this.doctype.toString();
    }
    xmlString += this.children.map((child) => child.toString()).join("\n");
    return xmlString;
  }
}
