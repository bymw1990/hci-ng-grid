import { Injectable } from "@angular/core";

/**
 * Automatically generate different types of data to test filtering/paging and the such for various size data sets.
 */
@Injectable()
export class DataGeneratorService {
  filteredData: Array<Object> = new Array<Object>();
  fixedData: Array<Object> = new Array<Object>();
  externalData: Array<Object> = new Array<Object>();

  private _firstNames: string[] = [ "Alred", "Amy", "Betty", "Bob", "Charles", "Charlize", "Doug", "Debbie" ];
  private _lastNames: string[] = [ "Black", "Brown", "Grey", "Khan", "Smith", "White" ];
  private _middleNames: string[] = [ "", "A", "C", "N", "O", "Z" ];
  private _cities: string[] = [ "Salt Lake City", "Odgen", "Provo" ];
  private _streets1: string[] = [ "Pine", "Red", "Green", "Oak", "Aspen" ];
  private _streets2: string[] = [ "acres", "shade", "wood", "dale" ];
  private _stypes: string[] = [ "Ln", "Rd", "St", "Dr" ];

  generateFixedData(size: number) {
    this.fixedData = new Array<Object>();
    for (var i = 0; i < size; i++) {
      let j: number = Math.floor(Math.random() * this._firstNames.length);
      let gender: string = (j % 2 === 0) ? "Male" : "Female";
      let firstName: string = this._firstNames[j];
      let middleName: string = this._middleNames[Math.floor(Math.random() * this._middleNames.length)];
      let lastName: string = this._lastNames[Math.floor(Math.random() * this._lastNames.length)];
      let city: string = this._cities[Math.floor(Math.random() * this._cities.length)];
      let addy: number = Math.floor(Math.random() * 9800 + 100);
      let street: string = this._streets1[Math.floor(Math.random() * this._streets1.length)] + this._streets2[Math.floor(Math.random() * this._streets2.length)] + " " + this._stypes[Math.floor(Math.random() * this._stypes.length)];
      let dob: number = Math.floor(Math.random() * (1000000000000 - 100000000000) + 100000000000);
      let phone: number = Math.floor(Math.random() * 9999999 + 8010000000);

      this.fixedData.push({ idPatient: i, middleName: middleName, firstName: firstName, lastName: lastName, dob: dob, gender: gender, address: addy + " " + street, citystatezip: city + ", UT 84101", phone: phone });
    }
  }

  getFixedData(filters: string[], sort: string, asc: boolean): Array<Object> {
    console.log("getFixedData");
    return this.fixedData;
  }

  generateFilteredData(size: number) {
    this.filteredData = new Array<Object>();
    for (var i = 0; i < size; i++) {
      let j: number = Math.floor(Math.random() * this._firstNames.length);
      let gender: string = (j % 2 === 0) ? "Male" : "Female";
      let firstName: string = this._firstNames[j];
      let middleName: string = this._middleNames[Math.floor(Math.random() * this._middleNames.length)];
      let lastName: string = this._lastNames[Math.floor(Math.random() * this._lastNames.length)];
      let addy: number = Math.floor(Math.random() * 9800 + 100);
      let street: string = this._streets1[Math.floor(Math.random() * this._streets1.length)] + this._streets2[Math.floor(Math.random() * this._streets2.length)] + " " + this._stypes[Math.floor(Math.random() * this._stypes.length)];
      let dob: number = Math.floor(Math.random() * (1000000000000 - 100000000000) + 100000000000);

      this.filteredData.push({ idPatient: i, middleName: middleName, firstName: firstName, lastName: lastName, dob: dob, gender: gender, address: addy + " " + street });
    }
  }

  getFilteredData(filters: string[], sort: string, asc: boolean): Array<Object> {
    console.log("getFilteredData " + this.filteredData.length);
    return this.filteredData;
  }

  generateExternalData(size: number) {
    this.externalData = new Array<Object>();
    for (var i = 0; i < size; i++) {
      let j: number = Math.floor(Math.random() * this._firstNames.length);
      let gender: string = (j % 2 === 0) ? "Male" : "Female";
      let firstName: string = this._firstNames[j];
      let middleName: string = this._middleNames[Math.floor(Math.random() * this._middleNames.length)];
      let lastName: string = this._lastNames[Math.floor(Math.random() * this._lastNames.length)];
      let addy: number = Math.floor(Math.random() * 9800 + 100);
      let street: string = this._streets1[Math.floor(Math.random() * this._streets1.length)] + this._streets2[Math.floor(Math.random() * this._streets2.length)] + " " + this._stypes[Math.floor(Math.random() * this._stypes.length)];
      let dob: number = Math.floor(Math.random() * (1000000000000 - 100000000000) + 100000000000);

      this.externalData.push({ idPatient: i, middleName: middleName, firstName: firstName, lastName: lastName, dob: dob, gender: gender, address: addy + " " + street });
    }
  }

  /**
   * Designed to mimic a backend service.  The grid will send the current filtering/sorting/paging information.  In cases
   * I foresee, if any component is external, they should all be, but build this thing assuming separate cases.
   * To mimic, basically we handle any case where we set the "external flag" for the grid configuration.
   *
   * TODO: The backend (if paging) will need to return the total array length.
   *
   * @param externalInfo
   * @returns {Array<Object>}
   */
  getExternalData(externalInfo: Object): Array<Object> {
    console.log("getExternalData");
    if (externalInfo === null) {
      return this.externalData;
    }
    let filters: any = externalInfo["_filter"];
    let sort: any = externalInfo["_sort"];
    let pageInfo: any = externalInfo["_page"];

    let filtered: Array<Object> = new Array<Object>();
    if (filters === null) {
      filtered = this.externalData;
    } else {
      for (var i = 0; i < this.externalData.length; i++) {
        let add: boolean = true;
        for (var j = 0; j < filters.length; j++) {
          if (this.externalData[i][filters[j]["_field"]].indexOf(filters[j]["_value"]) === -1) {
            add = false;
          }
        }
        if (add) {
          filtered.push(this.externalData[i]);
        }
      }
    }

    if (sort !== null) {
      filtered = filtered.sort((a: Object, b: Object) => {
        if (sort["_asc"]) {
          if (a[sort["_field"]] < b[sort["_field"]]) {
            return -1;
          } else if (a[sort["_field"]] < b[sort["_field"]]) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a[sort["_field"]] > b[sort["_field"]]) {
            return -1;
          } else if (a[sort["_field"]] < b[sort["_field"]]) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    }

    if (pageInfo === null) {
      return filtered;
    }

    let data: Array<Object> = new Array<Object>();

    let page: number = pageInfo["_page"];
    let pageSize: number = pageInfo["_pageSize"];

    let n: number = filtered.length;
    if (page * pageSize > n - 1) {
      return data;
    }

    for (var i = page * pageSize; i < Math.min(n, (page + 1) * pageSize); i++) {
      data.push(filtered[i]);
    }
    return data;
  }
}
