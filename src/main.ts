import { ParserType } from "@type/geo";
import { Parser } from "@parsers";

export const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

export const parse = (track: string, parserType: ParserType) => {
  const parser = new Parser(parserType);

  return parser.parse(track);
};
