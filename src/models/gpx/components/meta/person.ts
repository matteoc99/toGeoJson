import { Email, Link } from "@models/gpx/components/meta";

export default class Person {
  name?: string;
  email?: Email;
  link?: Link;

  constructor(name?: string, email?: Email, link?: Link) {
    this.name = name;
    this.email = email;
    this.link = link;
  }

  public static hydrate(element: Element): Person {
    const name = element.querySelector("name")?.textContent || undefined;
    const emailElement = element.querySelector("email");
    const email = emailElement ? Email.hydrate(emailElement) : undefined;
    const linkElement = element.querySelector("link");
    const link = linkElement ? Link.hydrate(linkElement) : undefined;

    return new Person(name, email, link);
  }
}
