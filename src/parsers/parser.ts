import { ParserType } from "@type/geo";
import { ParserInterface } from "@interfaces/parser";
import { GeoJson } from "@models/geo";
import { GpxParser, KmlParser, XmlParser } from "@parsers";

export default class Parser {
  type: ParserType;
  parser: ParserInterface;

  constructor(type: ParserType) {
    this.type = type;
    this.parser = this.getParser(type);
  }

  parse(track: string): GeoJson {
    const parser = new XmlParser(track);

    return this.parser.parse(parser.parseXml());
  }

  private getParser(parser: ParserType): ParserInterface {
    switch (parser) {
      case "gpx":
        return new GpxParser();
      case "kml":
        return new KmlParser();
      default:
        throw new Error("Unknown parser type");
    }
  }
}
