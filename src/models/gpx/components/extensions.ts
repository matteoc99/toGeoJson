export default class Extensions {
  keyValuePairs: { [key: string]: string };

  constructor(keyValuePairs: { [key: string]: string }) {
    this.keyValuePairs = keyValuePairs;
  }

  public static hydrate(element: Element): Extensions {
    const keyValuePairs: { [key: string]: string } = {};

    // Iterate over each child element in the extensions element
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Ensure it's an element node
        const key = node.nodeName;
        const value = node.textContent || "";
        keyValuePairs[key] = value;
      }
    });

    return new Extensions(keyValuePairs);
  }
}
