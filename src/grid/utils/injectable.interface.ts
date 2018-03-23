import {Injector} from "@angular/core";

/**
 * Defines the constructor to be used by the injectable factory.
 */
export interface InjectableConstructor<T> {
  new(injector: Injector): T;
}
