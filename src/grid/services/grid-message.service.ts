import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs/Rx";

export const NONE: number = -1;
export const ERROR: number = 0;
export const WARN: number = 1;
export const INFO: number = 2;
export const DEBUG: number = 3;

@Injectable()
export class GridMessageService {
  private _message: Subject<string> = new Subject<string>();
  private _messageObservable: Observable<string> = this._message.asObservable();
  private _level: number = 2;

  error(message: string) {
    if (this._level >= ERROR) {
      this._message.next("ERROR: " + message);
    }
  }

  warn(message: string) {
    if (this._level >= WARN) {
      this._message.next("WARN: " + message);
    }
  }

  info(message: string) {
    if (this._level >= INFO) {
      this._message.next("INFO: " + message);
    }
  }

  debug(message: string) {
    if (this._level >= DEBUG) {
      this._message.next("DEBUG: " + message);
    }
  }

  get messageObservable(): Observable<string> {
    return this._messageObservable;
  }

  setLevel(level: string): void {
    if (level === "NONE") {
      this._level = NONE;
    } else if (level === "ERROR") {
      this._level = ERROR;
    } else if (level === "WARN") {
      this._level = WARN;
    } else if (level === "INFO") {
      this._level = INFO;
    } else if (level === "DEBUG") {
      this._level = DEBUG;
    }
  }

}
