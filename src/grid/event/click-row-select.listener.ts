import {ClickListener} from "./click.interface";
import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";
import {Point} from "../utils/point";
import {Range} from "../utils/range";

export class ClickRowSelectListener extends EventListener implements ClickListener {

  click(event: MouseEvent): boolean {
    console.debug("ClickRowSelectListener.click");

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.srcElement);
    if (idElement !== null && idElement.id.startsWith("row-select-")) {
      event.stopPropagation();

      let location: Point = HtmlUtil.getLocation(idElement);
      let value: boolean = this.grid.getGridService().negateSelectedRow(location.i, location.j);
      if (value) {
        this.grid.updateSelectedRows(new Range(location, location));
      } else {
        this.grid.clearSelectedRows();
      }
      return true;
    } else {
      return false;
    }
  }

}
