import {Injector} from "@angular/core";

/**
 * Allows instantiation of any generic type if the type expects an injector argument.  See the implementation of
 * the EventListener.
 */
export class InjectableFactory<T> {
  constructor(private ic: InjectableConstructor<T>, private injector: Injector) {}

  getInstance(): T {
    return new this.ic(this.injector);
  }
}

export interface InjectableConstructor<T> {
  new(injector: Injector): T;
}
