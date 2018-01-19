import { Pipe, PipeTransform } from "@angular/core";

import { Column } from "../column/column";

@Pipe({
  name: "isGroup"
})
export class IsGroupPipe implements PipeTransform {
  transform(list) {
    if (list === undefined) {
      return list;
    } else {
      return list.filter((o: Column) => o.isGroup || o.isUtility);
    }
  }
}
