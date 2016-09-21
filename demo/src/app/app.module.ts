/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DragulaDirective } from "ng2-dragula/ng2-dragula";
import { DragulaService } from "ng2-dragula/ng2-dragula";

import { DemoAppComponent } from "./demo-app.component";
import { DataGeneratorService } from "./services/data-generator.service";

import { SimpleGridComponent } from "./simple/simple-grid.component";
import { EditGridComponent } from "./edit/edit-grid.component";
import { GroupGridComponent } from "./group/group-grid.component";
import { FixedGridComponent } from "./fixed/fixed-grid.component";
import { FilterGridComponent } from "./filter/filter-grid.component";
import { DragDropGridComponent } from "./dragdrop/dragdrop-grid.component";

import { SimpleGridModule } from "./simple/simple-grid.module";
import { EditGridModule } from "./edit/edit-grid.module";
import { GroupGridModule } from "./group/group-grid.module";
import { FixedGridModule } from "./fixed/fixed-grid.module";
import { FilterGridModule } from "./filter/filter-grid.module";
import { DragDropGridModule } from "./dragdrop/dragdrop-grid.module";

import { GridModule } from "hci-ng2-grid/index";

@NgModule({
  imports: [ BrowserModule, CommonModule, FormsModule, SimpleGridModule, EditGridModule, GroupGridModule, FixedGridModule, FilterGridModule, DragDropGridModule, GridModule ],
  declarations: [ DemoAppComponent, SimpleGridComponent, EditGridComponent, GroupGridComponent, FixedGridComponent, FilterGridComponent, DragDropGridComponent, DragulaDirective ],
  providers: [ DataGeneratorService, DragulaService ],
  bootstrap: [ DemoAppComponent ]
})
export class AppModule {}
