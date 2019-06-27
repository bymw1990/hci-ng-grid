import {HciPagingDto} from "hci-ng-grid-dto";

export class RowGroup {

  groupKey: string;
  expanded: boolean = false;
  rendered: boolean = false;
  paging: HciPagingDto = new HciPagingDto();

  constructor(groupKey: string) {
    this.groupKey = groupKey;
  }

  setPaging(paging: HciPagingDto): void {
    this.paging = paging;
  }
}
