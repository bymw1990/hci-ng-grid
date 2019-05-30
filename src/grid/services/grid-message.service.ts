import {Injectable} from "@angular/core";

import {Observable, Subject} from "rxjs";

@Injectable()
export class GridMessageService {

  private _message: Subject<string> = new Subject<string>();
  private _messageObservable: Observable<string> = this._message.asObservable();
  private _level: number = 2;

  error(message: string) {
    this._message.next("ERROR: " + message);
  }

  warn(message: string) {
    this._message.next("WARN: " + message);
  }

  get messageObservable(): Observable<string> {
    return this._messageObservable;
  }

}
