/**
 * Allows instantiation of any generic type if the type has no constructor arguments.
 */
export class EmptyFactory<T> {
  constructor(private emptyConstructor: EmptyConstructor<T>) {}

  getInstance(): T {
    return new this.emptyConstructor();
  }
}

export interface EmptyConstructor<T> {
  new(): T;
}
