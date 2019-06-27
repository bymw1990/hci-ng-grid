import {HciPagingDto} from "hci-ng-grid-dto";

export class RowGroup {

  groupKey: string;
  count: number;
  expanded: boolean = false;
  rendered: boolean = false;
  paging: HciPagingDto = new HciPagingDto();

  constructor(groupKey: string, count: number = 0) {
    this.groupKey = groupKey;
    this.count = count;
  }

  incrementCount(): void {
    this.count += 1;
  }

  setPaging(paging: HciPagingDto): void {
    this.paging = paging;
  }
}
