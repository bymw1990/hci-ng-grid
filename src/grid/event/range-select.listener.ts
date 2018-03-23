import {isDevMode} from "@angular/core";

import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";
import {MouseDownListener} from "./mouse-down.interface";
import {MouseDragListener} from "./mouse-drag.interface";
import {MouseUpListener} from "./mouse-up.interface";

export class RangeSelectListener extends EventListener implements MouseDownListener, MouseDragListener, MouseUpListener {

  dragging: boolean = false;
  lastEventId: string = "";

  mouseDown(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("RangeSelectListener.mouseDown");
    }

    this.lastEventId = HtmlUtil.getId(<HTMLElement>event.srcElement);
    if (this.lastEventId.startsWith("cell-")) {
      this.dragging = true;
      event.stopPropagation();
      event.preventDefault();

      this.gridEventService.clearSelectedLocation();
      return true;
    } else {
      return false;
    }
  }

  mouseUp(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("mouseUp " + event.srcElement.id);
    }

    event.stopPropagation();
    event.preventDefault();

    this.dragging = false;
    this.lastEventId = event.srcElement.id;
    this.grid.focuser1.nativeElement.focus();

    return true;
  }

  mouseDrag(event: MouseEvent): boolean {
    if (this.dragging) {
      if (isDevMode()) {
        console.debug("mouseDrag " + event.srcElement.id);
      }
      event.stopPropagation();
      event.preventDefault();
      this.lastEventId = event.srcElement.id;

      this.gridEventService.setMouseDragSelected(HtmlUtil.getLocation(<HTMLElement>event.srcElement));
      return true;
    }
    return false;
  }
}
