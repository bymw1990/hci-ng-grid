import {Point} from "./point";

export class HtmlUtil {

  static getId(e: HTMLElement): string {
    if (!e || e === null) {
      return "";
    }
    while (e.id === "") {
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
