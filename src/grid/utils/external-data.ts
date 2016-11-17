import { ExternalInfo } from "./external-info";

export class ExternalData {

  private _data: Array<Object>;
  private _externalInfo: ExternalInfo;

  constructor(data: Array<Object>, externalInfo: ExternalInfo) {
    this._data = data;
    this._externalInfo = externalInfo;
  }

  get data(): Array<Object> {
    return this._data;
  }

  set data(data: Array<Object>) {
    this._data = data;
  }

  get externalInfo(): ExternalInfo {
    return this._externalInfo;
  }

  set externalInfo(externalInfo: ExternalInfo) {
    this._externalInfo = externalInfo;
  }

}
