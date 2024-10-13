import { GeoJson } from "@models/geo";
import { XmlDocument } from "@models/xml";

export default interface ParserInterface {
  parse(track: XmlDocument): GeoJson;
}
