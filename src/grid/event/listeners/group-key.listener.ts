import {isDevMode} from "@angular/core";

import {ClickListener} from "../click.interface";
import {EventListener} from "../event-listener";
import {HtmlUtil} from "../../utils/html-util";

export class GroupKeyListener extends EventListener implements ClickListener {

  multiSelect: boolean = false;

  click(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.grid.id + ": GroupKeyListener.click");
    }

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.target);
    if (idElement !== null && idElement.classList.contains("group-key")) {
      event.stopPropagation();

      let groupKey: string;
      for (let className of idElement.classList.values()) {
        if (className.startsWith("group-key-")) {
          groupKey = className.replace("group-key-", "");
          break;
        }
      }
      this.gridService.expandCollapseRowGroup(groupKey);

      return true;
    } else {
      return false;
    }
  }

  setConfig(config: any) {
    super.setConfig(config);

    if (config.multiSelect !== undefined && config.multiSelect) {
      this.multiSelect = config.multiSelect;
    }
  }
}
