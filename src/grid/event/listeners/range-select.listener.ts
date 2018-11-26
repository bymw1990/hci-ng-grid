import {isDevMode} from "@angular/core";

import {EventListener} from "../event-listener";
import {HtmlUtil} from "../../utils/html-util";
import {MouseDownListener} from "../mouse-down.interface";
import {MouseDragListener} from "../mouse-drag.interface";
import {MouseUpListener} from "../mouse-up.interface";

/**
 * Click and drag to select a range of cells.  Therefore this listens for mouse down, mouse up and mouse drag events.
 * Upon mouse down and while dragging, this detects the range of cells selected and updates those cells as selected.
 */
export class RangeSelectListener extends EventListener implements MouseDownListener, MouseDragListener, MouseUpListener {

  dragging: boolean = false;
  lastEventId: string = "";

  mouseDown(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("RangeSelectListener.mouseDown");
    }

    this.lastEventId = HtmlUtil.getId(<HTMLElement>event.target);
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
      console.debug("mouseUp " + (<HTMLElement>event.target).id);
    }

    event.stopPropagation();
    event.preventDefault();

    this.dragging = false;
    this.lastEventId = (<HTMLElement>event.target).id;
    this.grid.focuser1.nativeElement.focus();

    return true;
  }

  mouseDrag(event: MouseEvent): boolean {
    if (this.dragging) {
      if (isDevMode()) {
        console.debug("mouseDrag " + (<HTMLElement>event.target).id);
      }
      event.stopPropagation();
      event.preventDefault();
      this.lastEventId = (<HTMLElement>event.target).id;

      this.gridEventService.setMouseDragSelected(HtmlUtil.getLocation(<HTMLElement>event.target));
      return true;
    }
    return false;
  }
}
