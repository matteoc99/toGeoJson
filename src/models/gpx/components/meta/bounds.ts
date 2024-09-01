import { LongitudeType } from "@type/gpx";

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

  public static hydrate(element: Element): Bounds {
    const minLat = parseFloat(element.getAttribute("minlat") || "0");
    const minLon = parseFloat(element.getAttribute("minlon") || "0");
    const maxLat = parseFloat(element.getAttribute("maxlat") || "0");
    const maxLon = parseFloat(element.getAttribute("maxlon") || "0");

    return new Bounds(minLat, minLon, maxLat, maxLon);
  }
}
