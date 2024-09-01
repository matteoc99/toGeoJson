import { XmlAttribute } from "@models/xml/index";

export default class XmlElement {
  private readonly _name: string;
  private readonly _prefix?: string;
  private _attributes: XmlAttribute[] = [];
  private _children: Array<XmlElement | string> = [];

  constructor(name: string, prefix?: string) {
    this._name = name;
    this._prefix = prefix;
  }

  get name(): string {
    return this._name;
  }

  get prefix(): string | undefined {
    return this._prefix;
  }

  get attributes(): XmlAttribute[] {
    return this._attributes;
  }

  get children(): Array<XmlElement | string> {
    return this._children;
  }

  addAttributes(attributes: XmlAttribute[]): void {
    attributes.forEach((attribute) => {
      this.addAttribute(attribute);
    });
  }

  addAttribute(attribute: XmlAttribute): void {
    const existingAttrIndex = this._attributes.findIndex(
      (attr) => attr.name === attribute.name,
    );
    if (existingAttrIndex !== -1) {
      this._attributes[existingAttrIndex] = attribute;
    } else {
      this._attributes.push(attribute);
    }
  }

  removeAttribute(name: string): void {
    this._attributes = this._attributes.filter((attr) => attr.name !== name);
  }

  getAttribute(name: string): XmlAttribute | undefined {
    return this._attributes.find((attr) => attr.name === name);
  }

  addChild(child: XmlElement | string): void {
    if (typeof child === "string" && child.trim().length === 0) {
      throw new Error("Empty text nodes are not allowed.");
    }
    this._children.push(child);
  }

  removeChild(child: XmlElement | string): void {
    this._children = this._children.filter(
      (c) =>
        (typeof child === "string" && c === child) ||
        (child instanceof XmlElement &&
          c instanceof XmlElement &&
          c._name === child._name &&
          c._prefix === child._prefix),
    );
  }

  getChild(name: string): XmlElement | undefined {
    return this._children.find(
      (child) => child instanceof XmlElement && child._name === name,
    ) as XmlElement | undefined;
  }

  getChildAt(index: number): XmlElement | string | undefined {
    return this._children[index];
  }

  replaceChildAt(index: number, newChild: XmlElement | string): void {
    if (index >= 0 && index < this._children.length) {
      this._children[index] = newChild;
    } else {
      throw new Error("Index out of bounds.");
    }
  }

  hasChild(name: string): boolean {
    return this._children.some(
      (child) => child instanceof XmlElement && child._name === name,
    );
  }

  indexOfChild(child: XmlElement | string): number {
    if (typeof child === "string") {
      return this._children.indexOf(child);
    } else {
      return this._children.findIndex(
        (c) =>
          c instanceof XmlElement &&
          c._name === child._name &&
          c._prefix === child._prefix,
      );
    }
  }

  toString(indent: string = ""): string {
    const indentStep = "  ";
    const childIndent = indent + indentStep;

    const attrString = this._attributes
      .map((attr) => attr.toString())
      .join(" ");

    const startTag = `<${this._name}${attrString ? " " + attrString : ""}>`;
    const endTag = `</${this._name}>`;

    if (this._children.length === 0) {
      // Self-closing tag for empty elements
      return `${indent}${startTag.slice(0, -1)} />`;
    }

    const childrenString = this._children
      .map((child) => {
        if (typeof child === "string") {
          return `${childIndent}${child}`;
        } else {
          return child.toString(childIndent);
        }
      })
      .join("\n");

    return `${indent}${startTag}\n${childrenString}\n${indent}${endTag}`;
  }
}
