import {DblClickListener} from "./dbl-click.interface";
import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";

export class RowDblClickListener extends EventListener implements DblClickListener {

  dblclick(event: MouseEvent): boolean {
    console.debug("RowDblClickListener.dblclick");

    let id: string = HtmlUtil.getId(<HTMLElement>event.srcElement, "row-");
    if (id) {
      event.stopPropagation();

      id = id.substr(id.lastIndexOf("-") + 1);
      this.grid.outputRowDblClick.emit(this.grid.getGridService().getRow(+id).key);
      return true;
    } else {
      return false;
    }
  }

}