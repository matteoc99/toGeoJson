import { LatitudeType, LongitudeType } from "@type/gpx";
import { XmlElement } from "@models/xml";

export default class Bounds {
  minlat!: LongitudeType;
  minlon!: LongitudeType;
  maxlat!: LongitudeType;
  maxlon!: LongitudeType;

  constructor(
    minlat: LongitudeType,
    minlon: LongitudeType,
    maxlat: LongitudeType,
    maxlon: LongitudeType,
  ) {
    this.minlat = minlat;
    this.minlon = minlon;
    this.maxlat = maxlat;
    this.maxlon = maxlon;
  }

  public static hydrate(element: XmlElement): Bounds {
    const minlatAttr = element.getAttribute("minlat");
    const minlonAttr = element.getAttribute("minlon");
    const maxlatAttr = element.getAttribute("maxlat");
    const maxlonAttr = element.getAttribute("maxlon");

    if (
      minlatAttr === null ||
      minlonAttr === null ||
      maxlatAttr === null ||
      maxlonAttr === null
    ) {
      throw new Error(
        "Bounds element must have minlat, minlon, maxlat, and maxlon attributes.",
      );
    }

    const minlat = parseFloat(minlatAttr) as LatitudeType;
    const minlon = parseFloat(minlonAttr) as LongitudeType;
    const maxlat = parseFloat(maxlatAttr) as LatitudeType;
    const maxlon = parseFloat(maxlonAttr) as LongitudeType;

    return new Bounds(minlat, minlon, maxlat, maxlon);
  }
}
