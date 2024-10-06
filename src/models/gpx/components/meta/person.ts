import { Email, Link } from "@models/gpx/components/meta";
import { XmlElement } from "@models/xml";

export default class Person {
  name?: string;
  email?: Email;
  link?: Link;

  constructor(name?: string, email?: Email, link?: Link) {
    this.name = name;
    this.email = email;
    this.link = link;
  }

  public static hydrate(element: XmlElement): Person {
    const name = element.getChildText("name");

    const emailElement = element.getChild("email");
    const email = emailElement ? Email.hydrate(emailElement) : undefined;

    const linkElement = element.getChild("link");
    const link = linkElement ? Link.hydrate(linkElement) : undefined;

    return new Person(name, email, link);
  }
}
