import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { GridComponent } from "./grid.component";
import { GridDataService } from "./services/grid-data.service";
import { GridEventService } from "./services/grid-event.service";
import { GridConfigService } from "./services/grid-config.service";
import { RowComponent } from "./row/row.component";
import { CellModule } from "./cell/cell.module";
import { CellComponent } from "./cell/cell.component";
import { IsVisiblePipe } from "./utils/is-visible.pipe";
import { IsGroupPipe } from "./utils/is-group.pipe";
import { IsRowVisiblePipe } from "./utils/is-row-visible.pipe";

@NgModule({
  imports: [ CommonModule, FormsModule, CellModule ],
  declarations: [ GridComponent, RowComponent, CellComponent, IsVisiblePipe, IsGroupPipe, IsRowVisiblePipe ],
  exports: [ GridComponent, RowComponent, CellComponent ],
  providers: [ GridDataService, GridEventService, GridConfigService ]
})
export class GridModule {}
