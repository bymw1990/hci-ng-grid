import { Pipe, PipeTransform } from "@angular/core";

import { Column } from "../column";

@Pipe({
  name: "isGroup"
})
export class IsGroupPipe implements PipeTransform {
  transform(list) {
    return list.filter((o: Column) => o.isGroup || o.isUtility);
  }
}
