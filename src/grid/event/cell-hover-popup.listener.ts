import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";
import {MouseOverListener} from "./mouse-over.interface";
import {Point} from "../utils/point";

export class CellHoverPopupListener extends EventListener implements MouseOverListener {

  mouseOver(event: MouseEvent): boolean {
    console.debug("CellHoverPopupListener.mouseOver " + event.srcElement.id);

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.srcElement);
    if (idElement.id.startsWith("popup-")) {
      return false;
    }
    if (idElement !== null && idElement.id.startsWith("cell-")) {
      let location: Point = HtmlUtil.getLocation(idElement);
      if (!location || !this.grid.getGridService().getColumn(location.j).popupRenderer) {
        this.grid.popupContainer.clear();
        return false;
      }
      this.grid.createPopup(location);
      return true;
    } else {
      return false;
    }
  }

}
