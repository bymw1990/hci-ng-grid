import {Type} from "@angular/core";

export interface EventListenerArg {
  type: Type<any>;
  config?: any;
}
