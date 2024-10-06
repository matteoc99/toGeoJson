export default class XmlDeclaration {
  public version: string;
  public encoding?: string;
  public standalone?: string;

  constructor(version: string, encoding?: string, standalone?: string) {
    this.version = version;
    this.encoding = encoding;
    this.standalone = standalone;
  }

  public toString(): string {
    let ret = `<?xml version="${this.version}"`;
    if (this.encoding) {
      ret += ` encoding="${this.encoding}"`;
    }
    if (this.standalone) {
      ret += ` standalone="${this.standalone}"`;
    }
    ret += "?>\n";
    return ret;
  }
}
