import {Renderer2} from "@angular/core";

import {Column} from "../../column/column";
import {RowGroup} from "../../row/row-group";

export interface CellViewRenderer {

  /**
   * Used if the addition of a renderer should change the default behavior of a column.  For example, a
   * CheckRowSelectView should make sure the column is not editable.
   *
   * @param {Column} column The column to update properties on.
   */
  updateColumn(column: Column);

  /**
   * In a column, a viewConfig property can be set.  When implementing classes are instantiated, that config is passed
   * here.
   *
   * @param config JSON config object.
   */
  setConfig(config: any);

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number, rowGroup?: RowGroup): HTMLElement;
}
