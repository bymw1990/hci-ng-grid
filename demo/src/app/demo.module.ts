/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {GridModule} from "hci-ng-grid/index";

import {DemoComponent} from "./demo.component";
import {DataGeneratorService} from "./services/data-generator.service";

import {HomeComponent} from "./home.component";
import {SimpleGridComponent} from "./simple/simple-grid.component";
import {SelectGridComponent} from "./select/select-grid.component";
import {EditGridComponent} from "./edit/edit-grid.component";
import {RowGroupGridComponent} from "./row-group/row-group-grid.component";
import {FixedGridComponent} from "./fixed/fixed-grid.component";
import {FilterGridComponent} from "./filter/filter-grid.component";
import {ExternalControlComponent} from "./external-ctrl/external-ctrl.component";
import {ExternalDataComponent} from "./external-data/external-data.component";
import {CopyPasteGridComponent} from "./copypaste/copypaste-grid.component";
import {AlertsGridComponent} from "./alerts/alerts-grid.component";
import {PagingGridComponent} from "./paging/paging-grid.component";
import {ThemingComponent} from "./theming/theming.component";
import {DynamicConfigGridComponent} from "./dynamic-config/dynamic-config.component";
import {EmptyGridComponent} from "./empty/empty-grid.component";
import {EventComponent} from "./event/event.component";
import {PopupComponent} from "./popup/popup.component";
import {ResizeDemoComponent} from "./resize/resize.component";
import {LinkedDemoComponent} from "./linked/linked.component";

import {LabPopup} from "./components/lab.component";
import {UserProfileDirective} from "./dynamic-config/user-profile.directive";
import {DictionaryFilterRenderer} from "./filter/dictionary-filter.component";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: "", redirectTo: "/home", pathMatch: "full" },
      { path: "alerts", component: AlertsGridComponent },
      { path: "popup", component: PopupComponent },
      { path: "copypaste", component: CopyPasteGridComponent },
      { path: "dynamic-config", component: DynamicConfigGridComponent },
      { path: "empty", component: EmptyGridComponent },
      { path: "event", component: EventComponent },
      { path: "external-ctrl", component: ExternalControlComponent },
      { path: "external-data", component: ExternalDataComponent },
      { path: "edit", component: EditGridComponent },
      { path: "filter", component: FilterGridComponent },
      { path: "fixed", component: FixedGridComponent },
      { path: "home", component: HomeComponent },
      { path: "linked", component: LinkedDemoComponent },
      { path: "paging", component: PagingGridComponent },
      { path: "resize", component: ResizeDemoComponent },
      { path: "row-group", component: RowGroupGridComponent },
      { path: "row-select", component: SelectGridComponent },
      { path: "simple", component: SimpleGridComponent },
      { path: "theming", component: ThemingComponent },
    ]),
    NgbModule.forRoot(),
    GridModule.forRoot()
  ],
  declarations: [
    DemoComponent,
    HomeComponent,
    SimpleGridComponent,
    SelectGridComponent,
    EditGridComponent,
    RowGroupGridComponent,
    FixedGridComponent,
    FilterGridComponent,
    ExternalControlComponent,
    ExternalDataComponent,
    CopyPasteGridComponent,
    AlertsGridComponent,
    PagingGridComponent,
    ThemingComponent,
    DynamicConfigGridComponent,
    EventComponent,
    PopupComponent,
    EmptyGridComponent,
    ResizeDemoComponent,
    LinkedDemoComponent,
    LabPopup,
    UserProfileDirective,
    DictionaryFilterRenderer
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
