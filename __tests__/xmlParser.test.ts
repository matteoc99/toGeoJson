// XmlParser.test.ts

import {
  XmlAttribute,
  XmlCData,
  XmlComment,
  XmlDocument,
  XmlElement,
  XmlProcessingInstruction,
  XmlText,
} from "../src/models/xml";
import { XmlNodeType } from "../src/types/xml";
import { XmlParser } from "../src/parsers";

describe("XmlParser", () => {
  test("should parse XML declaration", () => {
    const xmlString = '<?xml version="1.0" encoding="UTF-8"?>';
    const xmlDoc = XmlParser.parse(xmlString);
    expect(xmlDoc.declaration).toEqual({
      version: "1.0",
      encoding: "UTF-8",
      standalone: undefined,
    });
  });

  test("should parse DOCTYPE declaration", () => {
    const xmlString = '<!DOCTYPE note SYSTEM "Note.dtd">';
    const xmlDoc = XmlParser.parse(xmlString);
    expect(xmlDoc.doctype).toEqual({
      type: XmlNodeType.DocumentType,
      parent: null,
      name: "note",
      publicId: "",
      systemId: "Note.dtd",
    });
  });

  test("should parse simple XML element", () => {
    const xmlString = "<note><to>Tove</to></note>";
    const xmlDoc = XmlParser.parse(xmlString);
    const root = xmlDoc.children[0] as XmlElement;
    expect(root.name).toBe("note");
    const child = root.children[0] as XmlElement;
    expect(child.name).toBe("to");
    const text = child.children[0] as XmlText;
    expect(text.content).toBe("Tove");
  });

  test("should parse attributes", () => {
    const xmlString = '<note id="123" category="reminder"></note>';
    const xmlDoc = XmlParser.parse(xmlString);
    const root = xmlDoc.children[0] as XmlElement;
    expect(root.attributes).toEqual([
      { name: "id", value: "123", namespace: null, namespaceUri: null },
      {
        name: "category",
        value: "reminder",
        namespace: null,
        namespaceUri: null,
      },
    ]);
  });

  test("should parse namespaces", () => {
    const xmlString = `
      <root xmlns:h="http://www.w3.org/TR/html4/">
        <h:table>
          <h:tr>
            <h:td>Apples</h:td>
          </h:tr>
        </h:table>
      </root>
    `;
    const xmlDoc = XmlParser.parse(xmlString);
    const root = xmlDoc.children[0] as XmlElement;
    const table = root.children[0] as XmlElement;
    expect(table.name).toBe("table");
    expect(table.namespace).toBe("h");
    expect(table.namespaceUri).toBe("http://www.w3.org/TR/html4/");
  });

  test("should parse comments", () => {
    const xmlString = "<!--This is a comment--><root></root>";
    const xmlDoc = XmlParser.parse(xmlString);
    const comment = xmlDoc.children[0] as XmlComment;
    expect(comment.type).toBe(XmlNodeType.Comment);
    expect(comment.content).toBe("This is a comment");
  });

  test("should parse CDATA sections", () => {
    const xmlString = "<data><![CDATA[Some <CDATA> content]]></data>";
    const xmlDoc = XmlParser.parse(xmlString);
    const data = xmlDoc.children[0] as XmlElement;
    const cdata = data.children[0] as XmlCData;
    expect(cdata.type).toBe(XmlNodeType.CData);
    expect(cdata.content).toBe("Some <CDATA> content");
  });

  test("should parse processing instructions", () => {
    const xmlString = "<?target data?><root></root>";
    const xmlDoc = XmlParser.parse(xmlString);
    const pi = xmlDoc.children[0] as XmlProcessingInstruction;
    expect(pi.type).toBe(XmlNodeType.ProcessingInstruction);
    expect(pi.target).toBe("target");
    expect(pi.data).toBe("data");
  });

  test("should parse entity references", () => {
    const xmlString = "<root>Apples &amp; Oranges</root>";
    const xmlDoc = XmlParser.parse(xmlString);
    const root = xmlDoc.children[0] as XmlElement;
    const text = root.children[0] as XmlText;
    expect(text.content).toBe("Apples & Oranges");
  });

  test("should handle nested elements", () => {
    const xmlString =
      "<root><level1><level2><level3>Text</level3></level2></level1></root>";
    const xmlDoc = XmlParser.parse(xmlString);
    const root = xmlDoc.children[0] as XmlElement;
    const level1 = root.children[0] as XmlElement;
    const level2 = level1.children[0] as XmlElement;
    const level3 = level2.children[0] as XmlElement;
    const text = level3.children[0] as XmlText;
    expect(text.content).toBe("Text");
  });

  test("should parse elements with default namespace", () => {
    const xmlString = `
      <root xmlns="http://default.namespace/">
        <child>Content</child>
      </root>
    `;
    const xmlDoc = XmlParser.parse(xmlString);
    const root = xmlDoc.children[0] as XmlElement;
    expect(root.namespaceUri).toBe("http://default.namespace/");
    const child = root.children[0] as XmlElement;
    expect(child.namespaceUri).toBe("http://default.namespace/");
  });

  test("should throw error on mismatched tags", () => {
    const xmlString = "<root><child></root>";
    expect(() => XmlParser.parse(xmlString)).toThrowError(
      "Mismatched end tag: expected </child>, found </root>",
    );
  });

  test("should parse self-closing tags", () => {
    const xmlString = "<root><child /></root>";
    const xmlDoc = XmlParser.parse(xmlString);
    const root = xmlDoc.children[0] as XmlElement;
    const child = root.children[0] as XmlElement;
    expect(child.name).toBe("child");
    expect(child.children.length).toBe(0);
  });
});

describe("XmlElement Class Methods", () => {
  let xmlString: string;
  let xmlDoc: XmlDocument;
  let rootElement: XmlElement | null;

  beforeEach(() => {
    xmlString = `
      <library>
        <book id="b1" genre="fiction">
          <title>1984</title>
          <author>George Orwell</author>
          <metadata>
            <published>1949</published>
            <pages>328</pages>
          </metadata>
        </book>
        <book id="b2" genre="science">
          <title>A Brief History of Time</title>
          <author>Stephen Hawking</author>
          <metadata>
            <published>1988</published>
            <pages>256</pages>
          </metadata>
        </book>
        <magazine id="m1">
          <title>National Geographic</title>
          <issue>June 2020</issue>
        </magazine>
      </library>
    `;
    xmlDoc = XmlParser.parse(xmlString);
    rootElement = xmlDoc.getRootElement();
  });

  test("getAttribute() should retrieve the correct attribute value", () => {
    if (rootElement) {
      const book = rootElement.getChild("book");
      expect(book).not.toBeNull();
      if (book) {
        const id = book.getAttribute("id");
        expect(id).toBe("b1");
        const genre = book.getAttribute("genre");
        expect(genre).toBe("fiction");
        const missingAttr = book.getAttribute("nonexistent");
        expect(missingAttr).toBeNull();
      }
    }
  });

  test("getChild() should retrieve the correct child element", () => {
    if (rootElement) {
      const book = rootElement.getChild("book");
      expect(book).not.toBeNull();
      if (book) {
        const title = book.getChild("title");
        expect(title).not.toBeNull();
        if (title) {
          const textNode = title.children[0] as XmlText;
          expect(textNode.content).toBe("1984");
        }

        const metadata = book.getChild("metadata");
        expect(metadata).not.toBeNull();
        if (metadata) {
          const published = metadata.getChild("published");
          expect(published).not.toBeNull();
          if (published) {
            const textNode = published.children[0] as XmlText;
            expect(textNode.content).toBe("1949");
          }
        }

        const nonexistentChild = book.getChild("nonexistent");
        expect(nonexistentChild).toBeNull();
      }
    }
  });

  test("getChildren() should retrieve all matching child elements", () => {
    if (rootElement) {
      const books = rootElement.getChildren("book");
      expect(books.length).toBe(2);
      expect(books[0].getAttribute("id")).toBe("b1");
      expect(books[1].getAttribute("id")).toBe("b2");

      const allChildren = rootElement.getChildren();
      expect(allChildren.length).toBe(3);
    }
  });

  test("hasChild() should correctly identify if a child exists", () => {
    if (rootElement) {
      expect(rootElement.hasChild("book")).toBe(true);
      expect(rootElement.hasChild("magazine")).toBe(true);
      expect(rootElement.hasChild("newspaper")).toBe(false);
    }
  });

  test("find() should recursively search for a node", () => {
    if (rootElement) {
      const authorNode = rootElement.find(
        (node) =>
          node.type === XmlNodeType.Element &&
          (node as XmlElement).name === "author" &&
          ((node as XmlElement).children[0] as XmlText).content ===
            "Stephen Hawking",
      );
      expect(authorNode).not.toBeNull();
      if (authorNode) {
        const bookElement = authorNode.parent as XmlElement;
        expect(bookElement.getAttribute("id")).toBe("b2");
      }

      const nonexistentNode = rootElement.find(
        (node) =>
          node.type === XmlNodeType.Element &&
          (node as XmlElement).name === "nonexistent",
      );
      expect(nonexistentNode).toBeNull();
    }
  });

  test("findAll() should retrieve all matching nodes", () => {
    if (rootElement) {
      const metadataNodes = rootElement.findAll(
        (node) =>
          node.type === XmlNodeType.Element &&
          (node as XmlElement).name === "metadata",
      );
      expect(metadataNodes.length).toBe(2);
    }
  });

  test("addChild() should correctly add a new child element", () => {
    if (rootElement) {
      const newBook = new XmlElement("book");
      newBook.addAttribute(new XmlAttribute("id", "b3"));
      newBook.addChild(
        new XmlElement("title", null, null, [], [new XmlText("New Book")]),
      );
      rootElement.addChild(newBook);

      expect(rootElement.getChildren("book").length).toBe(3);

      const addedBook = rootElement
        .getChildren("book")
        .find((book) => book.getAttribute("id") === "b3");
      expect(addedBook).not.toBeNull();
      if (addedBook) {
        const titleElement = addedBook.getChild("title");
        expect(titleElement).not.toBeNull();
        if (titleElement) {
          const textNode = titleElement.children[0] as XmlText;
          expect(textNode.content).toBe("New Book");
        }
      }
    }
  });

  test("addAttribute() should correctly add a new attribute", () => {
    if (rootElement) {
      const magazine = rootElement.getChild("magazine");
      expect(magazine).not.toBeNull();
      if (magazine) {
        magazine.addAttribute(new XmlAttribute("publisher", "NatGeo"));
        expect(magazine.getAttribute("publisher")).toBe("NatGeo");
      }
    }
  });

  test("getTextContent() should retrieve concatenated text content", () => {
    // Assuming getTextContent() is implemented
    if (rootElement) {
      const book = rootElement.getChild("book");
      expect(book).not.toBeNull();
      if (book) {
        const textContent = book.getTextContent();
        expect(textContent).toContain("1984");
        expect(textContent).toContain("George Orwell");
      }
    }
  });

  test("removeChild() should correctly remove a child node", () => {
    if (rootElement) {
      const magazine = rootElement.getChild("magazine");
      expect(magazine).not.toBeNull();
      if (magazine) {
        rootElement.removeChild(magazine);
        expect(rootElement.hasChild("magazine")).toBe(false);
        expect(rootElement.getChildren().length).toBe(2);
      }
    }
  });

  test("removeAttribute() should correctly remove an attribute", () => {
    if (rootElement) {
      const book = rootElement.getChild("book");
      expect(book).not.toBeNull();
      if (book) {
        book.removeAttribute("genre");
        expect(book.getAttribute("genre")).toBeNull();
      }
    }
  });

  test("toString() should correctly serialize the element back to XML", () => {
    // Assuming toString() is implemented
    if (rootElement) {
      const xmlOutput = rootElement.toString();
      expect(xmlOutput).toContain("<library>");
      expect(xmlOutput).toContain("<book");
      expect(xmlOutput).toContain("</library>");
    }
  });

  test("XmlDocument toString() should serialize the entire document", () => {
    // Assuming XmlDocument.toString() is implemented
    const xmlOutput = xmlDoc.toString();
    expect(xmlOutput).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xmlOutput).toContain("<library>");
    expect(xmlOutput).toContain("</library>");
  });
});
