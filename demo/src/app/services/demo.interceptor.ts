import {Injectable, isDevMode} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";

import {Observable} from "rxjs";

@Injectable()
export class DemoInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isDevMode()) {
      console.debug("DemoInterceptor.intercept: " + request.url);
    }

    return Observable.of(null).mergeMap(() => {
      if (request.url.match(".*/dictionary/gender")) {
        if (isDevMode()) {
          console.info("GET .*/dictionary/gender");
        }
        return Observable.of(new HttpResponse<any>({ status: 200, body: [
            {value: 1, display: "Female"},
            {value: 2, display: "Male"},
            {value: 3, display: "Unknown"}
          ] }));
      }

      return next.handle(request)
        .do((ev: HttpEvent<any>) => {
          // Do Default
        })
        .catch(response => {
          if (response instanceof HttpErrorResponse) {
            console.warn("Http error", response);
          }

          return Observable.throw(response);
        });
    })
      .materialize()
      .delay(Math.floor(Math.random() * 500 + 250))
      .dematerialize();
  }

}
