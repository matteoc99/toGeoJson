import { XmlAttribute, XmlNode } from "@models/xml";
import { XmlNodeType } from "@type/xml";

export default class XmlElement extends XmlNode {
  public name: string;
  public namespace: string | null;
  public namespaceUri: string | null;
  public attributes: XmlAttribute[];
  public children: XmlNode[];

  constructor(
    name: string,
    namespace: string | null = null,
    namespaceUri: string | null = null,
    attributes: XmlAttribute[] = [],
    children: XmlNode[] = [],
    parent: XmlNode | null = null,
  ) {
    super(XmlNodeType.Element, parent);
    this.name = name;
    this.namespace = namespace;
    this.namespaceUri = namespaceUri;
    this.attributes = attributes;
    this.children = children;
  }

  // Convenience methods
  public getAttribute(name: string): string | null {
    const attr = this.attributes.find((a) => a.name === name);
    return attr ? attr.value : null;
  }

  public getChild(name: string): XmlElement | null {
    return (this.children.find(
      (child) =>
        child.type === XmlNodeType.Element &&
        (child as XmlElement).name === name,
    ) || null) as XmlElement | null;
  }

  public getChildren(name?: string): XmlElement[] {
    return this.children
      .filter(
        (child) =>
          child.type === XmlNodeType.Element &&
          (name === undefined || (child as XmlElement).name === name),
      )
      .map((child) => child as XmlElement);
  }

  public hasChild(name: string): boolean {
    return this.getChild(name) !== null;
  }

  public find(predicate: (node: XmlNode) => boolean): XmlNode | null {
    if (predicate(this)) {
      return this;
    }
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
    if (predicate(this)) {
      results.push(this);
    }
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

  public addAttribute(attribute: XmlAttribute): void {
    this.attributes.push(attribute);
  }

  public removeChild(node: XmlNode): void {
    const index = this.children.indexOf(node);
    if (index !== -1) {
      this.children.splice(index, 1);
      node.parent = null;
    }
  }

  public removeAttribute(name: string): void {
    const index = this.attributes.findIndex((attr) => attr.name === name);
    if (index !== -1) {
      this.attributes.splice(index, 1);
    }
  }

  public getTextContent(): string {
    let content = "";
    for (const child of this.children) {
      if (child.type === XmlNodeType.Text || child.type === XmlNodeType.CData) {
        content += child.toString();
      } else if (child instanceof XmlElement) {
        content += child.getTextContent();
      }
    }
    return content;
  }

  public getChildText(childName: string): string | undefined {
    return this.getChild(childName)?.getTextContent();
  }

  public getChildTextAsFloat(childName: string): number | undefined {
    const text = this.getChildText(childName);
    return text !== undefined ? parseFloat(text) : undefined;
  }

  public getChildTextAsInt(childName: string): number | undefined {
    const text = this.getChildText(childName);
    return text !== undefined ? parseInt(text, 10) : undefined;
  }

  public toString(): string {
    const namespacePart = this.namespace ? `${this.namespace}:` : "";
    const attributesPart = this.attributes
      .map((attr) => {
        return attr.toString();
      })
      .join(" ");
    const startTag = `<${namespacePart}${this.name}${attributesPart ? " " + attributesPart : ""}>`;
    const endTag = `</${namespacePart}${this.name}>`;
    const childrenContent = this.children
      .map((child) => child.toString())
      .join("");
    return `${startTag}${childrenContent}${endTag}`;
  }
}
