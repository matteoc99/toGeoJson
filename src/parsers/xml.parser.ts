import { XmlAttribute, XmlDocument, XmlElement } from "@models/xml";

export default class XmlParser {
  private xml: string;

  constructor(xml: string) {
    this.xml = xml.trim();
  }

  public static parseXml(xml: string): XmlDocument {
    return new XmlParser(xml).parseXml();
  }

  public parseXml(): XmlDocument {
    if (this.xml.startsWith("<?xml")) {
      const declarationEnd = this.xml.indexOf("?>");
      if (declarationEnd !== -1) {
        this.xml = this.xml.slice(declarationEnd + 2).trim();
      }
    }

    const [rootElement] = this.parseElement(this.xml);
    return new XmlDocument(rootElement);
  }

  private parseAttributes(attributeString: string): XmlAttribute[] {
    const attributes: XmlAttribute[] = [];
    const attributePattern = /(\w+:\w+|\w+)="([^"]*)"/g;
    let match: RegExpExecArray | null;

    while ((match = attributePattern.exec(attributeString)) !== null) {
      const [fullMatch, name, value] = match;
      const [prefix, attributeName] = name.includes(":")
        ? name.split(":")
        : [undefined, name];
      const attr = new XmlAttribute(attributeName, value, prefix);
      attributes.push(attr);
    }

    return attributes;
  }

  private parseElement(xml: string): [XmlElement, string] {
    const tagPattern = /^<(\w+:)?([\w-]+)([^>]*)>/;
    const match = xml.match(tagPattern);
    if (!match) throw new Error("Invalid XML element" + xml);

    const [, prefix, tagName, attributeString] = match;
    const attributes = this.parseAttributes(attributeString.trim());

    const element = new XmlElement(tagName, prefix?.slice(0, -1));
    element.addAttributes(attributes);

    let restXml = xml.slice(match[0].length);

    if (restXml.startsWith("/>")) {
      return [element, restXml.slice(2)];
    }

    while (!restXml.startsWith(`</${prefix || ""}${tagName}>`)) {
      if (restXml.startsWith("<")) {
        const [childElement, remainingXml] = this.parseElement(restXml);
        element.addChild(childElement);
        restXml = remainingXml;
      } else {
        const textEnd = restXml.indexOf("<");
        const text = restXml.slice(0, textEnd).trim();
        if (text.length > 0) element.addChild(text);
        restXml = restXml.slice(textEnd);
      }
    }

    restXml = restXml.slice(`</${prefix || ""}${tagName}>`.length);

    return [element, restXml];
  }
}
