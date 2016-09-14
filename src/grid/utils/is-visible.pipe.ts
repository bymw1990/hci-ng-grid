import { Pipe, PipeTransform } from "@angular/core";

import { Column } from "../column";

@Pipe({
  name: "isVisible"
})
export class IsVisiblePipe implements PipeTransform {
  transform(list) {
    return list.filter((o: Column) => o.visible);
  }
}
