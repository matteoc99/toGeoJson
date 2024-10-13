import { readFileSync } from "fs";
import { join } from "path";
import { XmlParser } from "../src/parsers";
import { greet } from "../src/main";
import { Gpx } from "../src/models/gpx";

test("greet function", () => {
  expect(greet("World")).toBe("Hello, World!");
});

test("gpx hydrate", () => {
  const gpxFilePath = join(__dirname, "files", "fells_loop.gpx");
  const gpxFileContent = readFileSync(gpxFilePath, "utf8");
  const root = XmlParser.parse(gpxFileContent).getRootElement();
  if (!root) {
    fail("no root element");
  }
  const gpxData = Gpx.hydrate(root);

  expect(gpxData.creator).toBe("ExpertGPS 1.1 - https://www.topografix.com");
  expect(gpxData.version).toBe("1.0");
});

test("gpx meltina", () => {
  const gpxFilePath = join(__dirname, "files", "Meltina_Avelengo_Merano.gpx");
  const gpxFileContent = readFileSync(gpxFilePath, "utf8");
  const root = XmlParser.parse(gpxFileContent).getRootElement();
  if (!root) {
    fail("no root element");
  }
  const gpxData = Gpx.hydrate(root);

  expect(gpxData.trk?.[0]?.trkseg?.[0]?.trkpt?.length).toBe(5132);
  expect(gpxData.version).toBe("1.1");
});

test("parse xml", () => {
  const gpxFilePath = join(__dirname, "files", "test.gpx");
  const gpxFileContent = readFileSync(gpxFilePath, "utf8");

  const ret = XmlParser.parse(gpxFileContent);

  console.log(ret);
  expect(ret.toString()).not.toBeNull();
});
