import { Pipe, PipeTransform } from "@angular/core";

import { Row } from "../row/row";

@Pipe({
  name: "isRowVisible"
})
export class IsRowVisiblePipe implements PipeTransform {
  transform(list) {
    return list.filter((o: Row) => o.visible);
  }
}
