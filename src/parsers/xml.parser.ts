import { XmlNodeType } from "@type/xml";
import {
  XmlAttribute,
  XmlCData,
  XmlComment,
  XmlDeclaration,
  XmlDocument,
  XmlDocumentType,
  XmlElement,
  XmlNode,
  XmlProcessingInstruction,
  XmlText,
} from "@models/xml";

interface QualifiedName {
  prefix: string | null;
  localName: string;
}

export default class XmlParser {
  private xml: string;
  private position: number = 0;
  private length: number;
  private currentChar: string;
  private document: XmlDocument;
  private namespaceStack: Array<{ [prefix: string]: string }> = [];
  private entities: { [key: string]: string } = {
    lt: "<",
    gt: ">",
    amp: "&",
    apos: "'",
    quot: '"',
  };

  constructor(xml: string) {
    this.xml = xml;
    this.length = xml.length;
    this.currentChar = xml.charAt(0);
    this.document = new XmlDocument();
  }

  public static parse(xml: string): XmlDocument {
    const parser = new XmlParser(xml);
    return parser.parseDocument();
  }

  private parseDocument(): XmlDocument {
    this.skipWhitespace();

    if (this.lookAhead("<?xml")) {
      this.document.declaration = this.parseXmlDeclaration();
    }

    this.skipWhitespace();

    if (this.lookAhead("<!DOCTYPE")) {
      this.document.doctype = this.parseDocType();
    }

    while (this.position < this.length) {
      const node = this.parseNode();
      if (node) {
        node.parent = this.document;
        this.document.children.push(node);
      } else {
        break;
      }
    }

    return this.document;
  }

  private parseXmlDeclaration(): XmlDeclaration {
    this.expect("<?xml");
    const attributes = this.parseAttributes();
    this.skipWhitespace();
    this.expect("?>");

    const version = attributes["version"];
    if (!version) {
      throw new Error("XML declaration must contain version");
    }
    const encoding = attributes["encoding"];
    const standalone = attributes["standalone"];

    return { version, encoding, standalone };
  }

  private parseDocType(): XmlDocumentType {
    this.expect("<!DOCTYPE");
    this.skipWhitespace();

    const name = this.parseName();
    this.skipWhitespace();

    let publicId = "";
    let systemId = "";

    if (this.lookAhead("PUBLIC")) {
      this.expect("PUBLIC");
      this.skipWhitespace();
      publicId = this.parseQuotedString();
      this.skipWhitespace();
      systemId = this.parseQuotedString();
    } else if (this.lookAhead("SYSTEM")) {
      this.expect("SYSTEM");
      this.skipWhitespace();
      systemId = this.parseQuotedString();
    }

    this.skipUntil(">");
    this.nextChar();

    return {
      type: XmlNodeType.DocumentType,
      parent: null,
      name,
      publicId,
      systemId,
    };
  }

  private parseNode(): XmlNode | null {
    this.skipWhitespace();
    if (this.position >= this.length) return null;

    if (this.currentChar === "<") {
      if (this.lookAhead("<!--")) {
        return this.parseComment();
      } else if (this.lookAhead("<![CDATA[")) {
        return this.parseCData();
      } else if (this.lookAhead("<?")) {
        return this.parseProcessingInstruction();
      } else if (this.lookAhead("</")) {
        throw new Error("Unexpected end tag");
      } else if (this.lookAhead("<!")) {
        throw new Error("Unexpected declaration");
      } else {
        return this.parseElement();
      }
    } else {
      return this.parseTextNode();
    }
  }

  private parseElement(): XmlElement {
    this.expect("<");
    const qName = this.parseQualifiedName();
    const attributes = this.parseAttributesArray();

    const namespaceContext = { ...this.getCurrentNamespaceContext() };

    for (const attr of attributes) {
      if (attr.namespace === null && attr.name === "xmlns") {
        namespaceContext[""] = attr.value;
      } else if (attr.namespace === "xmlns") {
        namespaceContext[attr.name] = attr.value;
      }
    }
    this.namespaceStack.push(namespaceContext);

    const namespaceUri = this.resolveNamespaceUri(qName.prefix);

    const element: XmlElement = new XmlElement(
      qName.localName,
      qName.prefix,
      namespaceUri,
      attributes,
    );

    for (const attr of attributes) {
      if (attr.namespace !== "xmlns") {
        attr.namespaceUri = this.resolveNamespaceUri(attr.namespace);
      } else {
        attr.namespaceUri = null;
      }
    }

    this.skipWhitespace();
    if (this.currentChar === "/") {
      this.nextChar();
      this.expect(">");
      this.namespaceStack.pop();
      return element;
    } else if (this.currentChar === ">") {
      this.nextChar();
      while (true) {
        this.skipWhitespace();
        if (this.lookAhead(`</`)) {
          this.expect(`</`);
          const endQName = this.parseQualifiedName();
          this.skipWhitespace();
          this.expect(">");
          if (
            endQName.localName !== qName.localName ||
            endQName.prefix !== qName.prefix
          ) {
            throw new Error(
              `Mismatched end tag: expected </${
                qName.prefix ? qName.prefix + ":" : ""
              }${qName.localName}>, found </${
                endQName.prefix ? endQName.prefix + ":" : ""
              }${endQName.localName}>`,
            );
          }
          this.namespaceStack.pop();
          break;
        } else if (this.position >= this.length) {
          throw new Error(`Unclosed tag: ${qName.localName}`);
        } else {
          const child = this.parseNode();
          if (child) {
            child.parent = element;
            element.children.push(child);
          } else {
            break;
          }
        }
      }
      return element;
    } else {
      throw new Error("Invalid character in element");
    }
  }

  private parseAttributes(): { [key: string]: string } {
    const attributes: { [key: string]: string } = {};
    while (true) {
      this.skipWhitespace();
      if (this.currentChar === "?" || this.currentChar === ">") {
        break;
      }
      const name = this.parseName();
      this.skipWhitespace();
      this.expect("=");
      this.skipWhitespace();
      attributes[name] = this.parseQuotedString();
    }
    return attributes;
  }

  private parseAttributesArray(): XmlAttribute[] {
    const attributes: XmlAttribute[] = [];
    while (true) {
      this.skipWhitespace();
      if (this.currentChar === "/" || this.currentChar === ">") {
        break;
      }
      const qName = this.parseQualifiedName();
      this.skipWhitespace();
      this.expect("=");
      this.skipWhitespace();
      const value = this.parseQuotedString();
      const attr = new XmlAttribute(qName.localName, value, qName.prefix);
      attributes.push(attr);
    }
    return attributes;
  }

  private parseName(): string {
    let name = "";
    if (this.isNameStartChar(this.currentChar)) {
      name += this.currentChar;
      this.nextChar();
      while (this.isNameChar(this.currentChar)) {
        name += this.currentChar;
        this.nextChar();
      }
      return name;
    } else {
      throw new Error(`Invalid name start character: ${this.currentChar}`);
    }
  }

  private parseQualifiedName(): QualifiedName {
    const name = this.parseName();
    const parts = name.split(":");
    if (parts.length === 2) {
      return { prefix: parts[0], localName: parts[1] };
    } else {
      return { prefix: null, localName: name };
    }
  }

  private parseQuotedString(): string {
    const quote = this.currentChar;
    if (quote !== '"' && quote !== "'") {
      throw new Error(`Expected quote character, found: ${this.currentChar}`);
    }
    this.nextChar();
    let value = "";
    while (this.currentChar !== quote) {
      if (this.position >= this.length) {
        throw new Error("Unterminated string literal");
      }
      if (this.currentChar === "&") {
        value += this.parseEntityReference();
      } else {
        value += this.currentChar;
        this.nextChar();
      }
    }
    this.nextChar();
    return value;
  }

  private parseTextNode(): XmlText {
    let content = "";
    while (this.currentChar !== "<" && this.position < this.length) {
      if (this.currentChar === "&") {
        content += this.parseEntityReference();
      } else {
        content += this.currentChar;
        this.nextChar();
      }
    }
    return new XmlText(content);
  }

  private parseComment(): XmlComment {
    this.expect("<!--");
    let content = "";
    while (!this.lookAhead("-->")) {
      if (this.position >= this.length) {
        throw new Error("Unterminated comment");
      }
      content += this.currentChar;
      this.nextChar();
    }
    this.expect("-->");
    return new XmlComment(content);
  }

  private parseCData(): XmlCData {
    this.expect("<![CDATA[");
    let content = "";
    while (!this.lookAhead("]]>")) {
      if (this.position >= this.length) {
        throw new Error("Unterminated CDATA section");
      }
      content += this.currentChar;
      this.nextChar();
    }
    this.expect("]]>");
    return new XmlCData(content);
  }

  private parseProcessingInstruction(): XmlProcessingInstruction {
    this.expect("<?");
    const target = this.parseName();
    this.skipWhitespace();
    let data = "";
    while (!this.lookAhead("?>")) {
      if (this.position >= this.length) {
        throw new Error("Unterminated processing instruction");
      }
      data += this.currentChar;
      this.nextChar();
    }
    this.expect("?>");
    return new XmlProcessingInstruction(target, data.trim());
  }

  private parseEntityReference(): string {
    this.expect("&");
    let entityName = "";
    while (this.currentChar !== ";" && this.position < this.length) {
      entityName += this.currentChar;
      this.nextChar();
    }
    this.expect(";");
    if (this.entities[entityName]) {
      return this.entities[entityName];
    } else if (entityName.startsWith("#")) {
      const charCode = entityName.startsWith("#x")
        ? parseInt(entityName.substr(2), 16)
        : parseInt(entityName.substr(1), 10);
      return String.fromCharCode(charCode);
    } else {
      return `&${entityName};`;
    }
  }

  private lookAhead(s: string): boolean {
    return this.xml.substring(this.position, this.position + s.length) === s;
  }

  private expect(s: string): void {
    if (!this.lookAhead(s)) {
      throw new Error(`Expected '${s}' at position ${this.position}`);
    }
    this.position += s.length;
    this.currentChar = this.xml.charAt(this.position);
  }

  private skipWhitespace(): void {
    while (this.position < this.length && this.isWhitespace(this.currentChar)) {
      this.nextChar();
    }
  }

  private skipUntil(s: string): void {
    while (!this.lookAhead(s) && this.position < this.length) {
      this.nextChar();
    }
  }

  private nextChar(): void {
    this.position++;
    if (this.position < this.length) {
      this.currentChar = this.xml.charAt(this.position);
    } else {
      this.currentChar = "";
    }
  }

  private isWhitespace(c: string): boolean {
    return c === " " || c === "\t" || c === "\n" || c === "\r";
  }

  private isNameStartChar(c: string): boolean {
    return /[A-Za-z_:]/.test(c);
  }

  private isNameChar(c: string): boolean {
    return /[A-Za-z0-9_:.-]/.test(c);
  }

  private getCurrentNamespaceContext(): { [prefix: string]: string } {
    if (this.namespaceStack.length > 0) {
      return this.namespaceStack[this.namespaceStack.length - 1];
    } else {
      return {};
    }
  }

  private resolveNamespaceUri(prefix: string | null): string | null {
    const context = this.getCurrentNamespaceContext();
    if (prefix === null) {
      return context[""] || null;
    } else {
      return context[prefix] || null;
    }
  }
}
