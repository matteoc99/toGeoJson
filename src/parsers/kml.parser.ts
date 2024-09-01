import { ParserInterface } from "@interfaces/parser";
import { GeoJson } from "@models/geo";
import { XmlDocument } from "@models/xml";

export default class KmlParser implements ParserInterface {
  parse(track: XmlDocument): GeoJson {
    return new GeoJson(); //todo
  }
}
