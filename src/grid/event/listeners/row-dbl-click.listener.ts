import {isDevMode} from "@angular/core";

import {DblClickListener} from "../dbl-click.interface";
import {EventListener} from "../event-listener";
import {HtmlUtil} from "../../utils/html-util";

export class RowDblClickListener extends EventListener implements DblClickListener {

  dblclick(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("RowDblClickListener.dblclick");
    }

    let id: string = HtmlUtil.getId(<HTMLElement>event.target, "row-");
    if (id) {
      event.stopPropagation();

      id = id.substr(id.lastIndexOf("-") + 1);
      this.grid.outputRowDblClick.emit(this.gridService.getRow(+id).key);
      return true;
    } else {
      return false;
    }
  }

}
