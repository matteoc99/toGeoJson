import { GeoJson } from "@models/geo";
import { XmlDocument } from "@interfaces/xml";

export default interface ParserInterface {
  parse(track: XmlDocument): GeoJson;
}
