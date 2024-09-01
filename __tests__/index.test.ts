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
  const gpxData = Gpx.hydrate(XmlParser.parseXml(gpxFileContent).getRoot());

  expect(gpxData.creator).toBe("Health");
  expect(gpxData.version).toBe("1.0");
});

test("parse xml", () => {
  const gpxFilePath = join(__dirname, "files", "test.gpx");
  const gpxFileContent = readFileSync(gpxFilePath, "utf8");

  const ret = XmlParser.parseXml(gpxFileContent);

  console.log(ret);
  expect(ret.root).not.toBeNull();
});
