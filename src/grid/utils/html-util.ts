import {Point} from "./point";

export class HtmlUtil {

  static getId(e: HTMLElement, id?: string): string {
    if (!e || e === null) {
      return "";
    }
    while ((!id && e.id === "") || (id && !e.id.startsWith(id))) {
      if (e.parentElement) {
        e = e.parentElement;
      }
    }

    return e.id;
  }

  static getIdElement(e: HTMLElement): HTMLElement {
    if (!e || e === null) {
      return null;
    }
    while (e.id === "") {
      if (e.parentElement) {
        e = e.parentElement;
      }
    }

    return e;
  }

  static getLocation(e: HTMLElement): Point {
    return Point.getPoint(this.getId(e));
  }

}
