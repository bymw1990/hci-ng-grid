/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {DemoComponent} from "./demo.component";
import {DataGeneratorService} from "./services/data-generator.service";

import {SimpleGridComponent} from "./simple/simple-grid.component";
import {SelectGridComponent} from "./select/select-grid.component";
import {EditGridComponent} from "./edit/edit-grid.component";
import {RowGroupGridComponent} from "./row-group/row-group-grid.component";
import {FixedGridComponent} from "./fixed/fixed-grid.component";
import {FilterGridComponent} from "./filter/filter-grid.component";
import {ExternalGridComponent} from "./external/external-grid.component";
import {CopyPasteGridComponent} from "./copypaste/copypaste-grid.component";
import {AlertsGridComponent} from "./alerts/alerts-grid.component";
import {PagingGridComponent} from "./paging/paging-grid.component";
import {ThemingComponent} from "./theming/theming.component";
import {DynamicConfigGridComponent} from "./dynamic-config/dynamic-config.component";
import {EmptyGridComponent} from "./empty/empty-grid.component";
import {EventComponent} from "./event/event.component";
import {PopupComponent} from "./popup/popup.component";

import {SimpleGridModule} from "./simple/simple-grid.module";
import {SelectGridModule} from "./select/select-grid.module";
import {EditGridModule} from "./edit/edit-grid.module";
import {RowGroupGridModule} from "./row-group/row-group-grid.module";
import {FixedGridModule} from "./fixed/fixed-grid.module";
import {FilterGridModule} from "./filter/filter-grid.module";
import {ExternalGridModule} from "./external/external-grid.module";
import {CopyPasteGridModule} from "./copypaste/copypaste-grid.module";
import {AlertsGridModule} from "./alerts/alerts-grid.module";
import {PagingGridModule} from "./paging/paging-grid.module";
import {ThemingModule} from "./theming/theming.module";
import {DynamicConfigGridModule} from "./dynamic-config/dynamic-config.module";
import {EmptyGridModule} from "./empty/empty-grid.module";
import {EventModule} from "./event/event.module";
import {PopupModule} from "./popup/popup.module";

import {GridModule} from "hci-ng-grid/index";
import {LabPopup} from "./components/lab.component";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    SimpleGridModule,
    SelectGridModule,
    EditGridModule,
    RowGroupGridModule,
    FixedGridModule,
    FilterGridModule,
    ExternalGridModule,
    CopyPasteGridModule,
    AlertsGridModule,
    PagingGridModule,
    ThemingModule,
    DynamicConfigGridModule,
    EmptyGridModule,
    EventModule,
    PopupModule,
    GridModule
  ],
  declarations: [
    DemoComponent,
    SimpleGridComponent,
    SelectGridComponent,
    EditGridComponent,
    RowGroupGridComponent,
    FixedGridComponent,
    FilterGridComponent,
    ExternalGridComponent,
    CopyPasteGridComponent,
    AlertsGridComponent,
    PagingGridComponent,
    ThemingComponent,
    DynamicConfigGridComponent,
    EventComponent,
    PopupComponent,
    EmptyGridComponent,
    LabPopup
  ],
  providers: [
    DataGeneratorService
  ],
  bootstrap: [
    DemoComponent
  ],
  entryComponents: [
    LabPopup
  ]
})
export class DemoModule {}
