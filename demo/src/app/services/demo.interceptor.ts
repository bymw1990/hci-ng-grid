import {Injectable, isDevMode} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";

import {Observable, of} from "rxjs";
import {catchError, delay, mergeMap, tap} from "rxjs/operators";

@Injectable()
export class DemoInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isDevMode()) {
      console.debug("DemoInterceptor.intercept: " + request.url);
    }

    return of(null).pipe(mergeMap(() => {
      if (request.url.match(".*/dictionary/gender")) {
        if (isDevMode()) {
          console.info("GET .*/dictionary/gender");
        }
        return of(new HttpResponse<any>({ status: 200, body: [
          {value: 1, display: "Female"},
          {value: 2, display: "Male"},
          {value: 3, display: "Unknown"}
        ] }));
      } else if (request.url.match(".*/dictionary/race")) {
        if (isDevMode()) {
          console.info("GET .*/dictionary/race");
        }
        return of(new HttpResponse<any>({ status: 200, body: [
          {value: 1, display: "Asian"},
          {value: 2, display: "Black"},
          {value: 3, display: "Hispanic"},
          {value: 4, display: "Native American"},
          {value: 5, display: "Unknown"},
          {value: 6, display: "White"}
        ] }));
      } else if (request.url.match(".*/dictionary/states")) {
        if (isDevMode()) {
          console.info("GET .*/dictionary/states");
        }
        return of(new HttpResponse<any>({ status: 200, body: [
          {value: 1, display: "AL"},
          {value: 2, display: "AK"},
          {value: 3, display: "AZ"},
          {value: 4, display: "AR"},
          {value: 5, display: "CA"},
          {value: 6, display: "CO"},
          {value: 7, display: "CT"},
          {value: 8, display: "DE"},
          {value: 9, display: "FL"},
          {value: 10, display: "GA"},
          {value: 11, display: "HI"},
          {value: 12, display: "ID"},
          {value: 13, display: "IL"},
          {value: 14, display: "IN"},
          {value: 15, display: "IA"},
          {value: 16, display: "KS"},
          {value: 17, display: "KY"},
          {value: 18, display: "LA"},
          {value: 19, display: "ME"},
          {value: 20, display: "MD"},
          {value: 21, display: "MA"},
          {value: 22, display: "MI"},
          {value: 23, display: "MN"},
          {value: 24, display: "MS"},
          {value: 25, display: "MO"},
          {value: 26, display: "MT"},
          {value: 27, display: "NE"},
          {value: 28, display: "NV"},
          {value: 29, display: "NH"},
          {value: 30, display: "NJ"},
          {value: 31, display: "NM"},
          {value: 32, display: "NY"},
          {value: 33, display: "NC"},
          {value: 34, display: "ND"},
          {value: 35, display: "OH"},
          {value: 36, display: "OK"},
          {value: 37, display: "OR"},
          {value: 38, display: "PA"},
          {value: 39, display: "RI"},
          {value: 40, display: "SC"},
          {value: 41, display: "SD"},
          {value: 42, display: "TN"},
          {value: 43, display: "TX"},
          {value: 44, display: "UT"},
          {value: 45, display: "VT"},
          {value: 46, display: "VA"},
          {value: 47, display: "WA"},
          {value: 48, display: "WV"},
          {value: 49, display: "WI"},
          {value: 50, display: "WY"}
        ] }));
      }

      return next.handle(request)
        .pipe(tap(event => (ev: HttpEvent<any>) => {
          // Do Default
        }),
            catchError(
                response => {
                  if (response instanceof HttpErrorResponse) {
                    console.warn("Http error", response);
                  }

                  return Observable.throw(response);
                }
            )
        )
    }), delay(Math.floor(Math.random() * 500 + 250)));

  }

}
