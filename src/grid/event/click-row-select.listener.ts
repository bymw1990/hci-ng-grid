import {ClickListener} from "./click.interface";
import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";
import {Point} from "../utils/point";

export class ClickRowSelectListener extends EventListener implements ClickListener {

  click(event: MouseEvent): boolean {
    console.debug("ClickCellEditListener.click");

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.srcElement);
    if (idElement.id.startsWith("row-select-")) {
      event.stopPropagation();

      let location: Point = HtmlUtil.getLocation(idElement);
      this.grid.getGridService().negateSelectedRow(location.i, location.j);
      return true;
    } else {
      return false;
    }
  }

}
