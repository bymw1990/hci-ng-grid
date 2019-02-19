import {isDevMode, Renderer2} from "@angular/core";

import {EventListener} from "../event-listener";
import {HtmlUtil} from "../../utils/html-util";
import {MouseDownListener} from "../mouse-down.interface";
import {MouseDragListener} from "../mouse-drag.interface";
import {MouseUpListener} from "../mouse-up.interface";
import {MouseOutListener} from "../mouse-out.interface";

/**
 * Listener to select a column, drag it to another column and release.
 */
export class ColumnDndListener extends EventListener implements MouseDownListener, MouseDragListener, MouseUpListener, MouseOutListener {

  originalTarget: HTMLElement;
  isRight: boolean;
  renderer: Renderer2;
  clone: HTMLElement;
  dragging: boolean = false;
  lastEventId: string = "";

  mouseDown(event: MouseEvent): boolean {
    this.renderer = this.grid.getRenderer();

    this.originalTarget = HtmlUtil.getIdElement(<HTMLElement>event.target);

    if (this.originalTarget.id.startsWith("header-") && !this.originalTarget.classList.contains("hci-grid-header")) {
      this.originalTarget = <HTMLElement>this.originalTarget.closest(".hci-grid-header");
    }

    this.lastEventId = this.originalTarget.id;

    if (isDevMode()) {
      console.debug("ColumnDndListener.mouseDown: " + this.lastEventId);
    }

    if (this.lastEventId.startsWith("header-")) {
      this.dragging = true;
      event.stopPropagation();
      event.preventDefault();

      let view: HTMLElement = <HTMLElement>this.originalTarget.closest(".header-view");
      this.isRight = view.id.startsWith("right-");

      this.clone = <HTMLElement>this.originalTarget.cloneNode(true);
      this.clone.id = "clone-" + this.lastEventId;
      this.renderer.addClass(this.clone, "header-dnd");
      this.renderer.setStyle(this.clone, "z-index", 9999);
      this.renderer.setStyle(this.clone, "position", "fixed");
      this.renderer.setStyle(this.clone, "background-color", "white");
      this.renderer.setStyle(this.clone, "color", "black");
      this.renderer.setStyle(this.clone, "border", "black 1px solid");
      this.grid.getRenderer().appendChild(document.body, this.clone);

      return true;
    } else {
      return false;
    }
  }

  mouseUp(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("ColumnDndListener.mouseUp: " + (<HTMLElement>event.target).id);
    }

    if (this.dragging) {
      event.stopPropagation();
      event.preventDefault();

      this.dragging = false;
      this.lastEventId = (<HTMLElement>event.target).id;
      this.renderer.removeChild(document.body, this.clone);

      let targetHeader: HTMLElement = <HTMLElement>(<HTMLElement>event.target).closest(".hci-grid-header");
      console.debug("Target Column Dnd: " + targetHeader.id);

      let view: HTMLElement = <HTMLElement>targetHeader.closest(".header-view");
      if ((this.isRight && view.id.startsWith("right-") || !this.isRight && !view.id.startsWith("right-"))) {
        this.gridService.reorderColumn(+this.originalTarget.id.substring(+this.originalTarget.id.lastIndexOf("-") + 1),
            +targetHeader.id.substring(+targetHeader.id.lastIndexOf("-") + 1));
      }

      return true;
    } else {
      return false;
    }
  }

  mouseDrag(event: MouseEvent): boolean {
    if (this.dragging) {
      if (isDevMode()) {
        console.debug("ColumnDndListener.mouseDrag: " + (<HTMLElement>event.target).id);
      }
      event.stopPropagation();
      event.preventDefault();

      this.renderer.setStyle(this.clone, "left", (event.clientX + 5) + "px");
      this.renderer.setStyle(this.clone, "top", (event.clientY + 5) + "px");

      return true;
    }
    return false;
  }

  mouseOut(event: MouseEvent): boolean {
    let id: string = (<HTMLElement>event.target).id;

    if (isDevMode()) {
      console.debug("ColumnDndListener.mouseOut: " + (<HTMLElement>event.target).id);
    }

    if (this.dragging) {
      if (id.startsWith("header-") || id === "") {
        return false;
      }

      event.stopPropagation();
      event.preventDefault();

      this.dragging = false;
      this.renderer.removeChild(document.body, this.clone);

      return true;
    } else {
      return false;
    }
  }
}
