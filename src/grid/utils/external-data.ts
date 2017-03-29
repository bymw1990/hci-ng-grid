import { ExternalInfo } from "./external-info";

export class ExternalData {

  public data: Array<Object>;
  public externalInfo: ExternalInfo;

  constructor(data: Array<Object>, externalInfo: ExternalInfo) {
    this.data = data;
    this.externalInfo = externalInfo;
  }

  getData(): Array<Object> {
    return this.data;
  }

  setData(data: Array<Object>) {
    this.data = data;
  }

  getExternalInfo(): ExternalInfo {
    return this.externalInfo;
  }

  setExternalInfo(externalInfo: ExternalInfo) {
    this.externalInfo = externalInfo;
  }

}
