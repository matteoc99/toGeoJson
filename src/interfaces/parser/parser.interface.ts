import { GeoJson } from "@models/geo";
import { XmlDocumentInterface } from "@interfaces/xml";

export default interface ParserInterface {
  parse(track: XmlDocumentInterface): GeoJson;
}
