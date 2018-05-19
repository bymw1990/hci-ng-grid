import {Component, Directive, EventEmitter, Input, isDevMode} from "@angular/core";

@Directive({
  selector: "[userProfile]"
})
export class UserProfileDirective {

  @Input("userProfile") host: Component;
  @Input("config") config: string = "config";
  @Input("configChanged") configChanged: string = "onConfigChanged";

  ngOnInit() {
    if (this.host && this.host[this.configChanged]) {
      (<EventEmitter<any>>this.host[this.configChanged]).subscribe((config: any) => {
        if (isDevMode()) {
          console.debug("UserProfileDirective.onConfigChange");
          console.debug(config);
        }
        //this.host["inputConfig"] = Object.assign(config, {title: "Test"});
      });
    }
  }

  getUserProfile() {
    /*
    this.http.get("/api/user-profile/lookup).subscribe((configs: any[]) => {
      // this.host[this.config] = config;
    });
    */
  }
}
