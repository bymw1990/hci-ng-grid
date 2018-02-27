import {ClickListener} from "./click.interface";
import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";

export class ClickCellEditListener extends EventListener implements ClickListener {

  click(event: MouseEvent): boolean {
    console.debug("ClickCellEditListener.click");

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.srcElement);
    if (idElement !== null && idElement.id.startsWith("cell-")) {
      this.grid.getGridEventService().setSelectedLocation(HtmlUtil.getLocation(idElement), null);
      return true;
    } else {
      return false;
    }
  }

}
