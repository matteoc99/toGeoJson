import { LatitudeType, LongitudeType } from "@type/gpx";

export default class Point {
  lat!: LongitudeType;
  lon!: LongitudeType;
  ele?: number;
  time?: string;

  constructor(
    lat: LatitudeType,
    lon: LongitudeType,
    ele?: number,
    time?: string,
  ) {
    this.lat = lat;
    this.lon = lon;
    this.ele = ele;
    this.time = time;
  }
}
