export default class XmlAttribute {
  prefix?: string;
  name: string;
  value: string;

  constructor(name: string, value: string, prefix?: string) {
    if (!name || !value || !XmlAttribute.isValidName(name)) {
      throw new Error("Attribute name and value must be provided.");
    }

    this.name = name;
    this.value = value;
    this.prefix = prefix;
  }

  static isValidName(name: string): boolean {
    return /^[a-zA-Z_][\w.-]*$/.test(name);
  }

  toString(): string {
    const prefixStr = this.prefix ? `${this.prefix}:` : "";
    return `${prefixStr}${this.name}="${this.value}"`;
  }

  equals(other: XmlAttribute): boolean {
    return (
      this.name === other.name &&
      this.value === other.value &&
      this.prefix === other.prefix
    );
  }
}
