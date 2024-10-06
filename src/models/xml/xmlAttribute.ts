export default class XmlAttribute {
  public name: string;
  public value: string;
  public namespace: string | null;
  public namespaceUri: string | null;

  constructor(
    name: string,
    value: string,
    namespace: string | null = null,
    namespaceUri: string | null = null,
  ) {
    this.name = name;
    this.value = value;
    this.namespace = namespace;
    this.namespaceUri = namespaceUri;
  }

  public toString(): string {
    const attrNamespace = this.namespace ? `${this.namespace}:` : "";
    return `${attrNamespace}${this.name}="${this.value}"`;
  }
}
