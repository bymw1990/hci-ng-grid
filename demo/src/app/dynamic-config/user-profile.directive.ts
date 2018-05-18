import {
  Component, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, isDevMode,
  ViewContainerRef
} from "@angular/core";

@Directive({
  selector: "[userProfile]"
})
export class UserProfileDirective {

  @Input("userProfile")
  host: Component;

  ngOnInit() {
    if (isDevMode()) {
      console.debug("ngAfterViewInit");
      console.debug(this.host.template);
    }

    if (this.host && this.host["onConfigChange"]) {
      (<EventEmitter<any>>this.host["onConfigChange"]).subscribe((config: any) => {
        console.debug("UserProfileDirective.onConfigChange");
        console.debug(config);
        this.host["inputConfig"] = Object.assign(config, {title: "Test"});
      });
    }
  }
/*

  @HostListener("onConfigChange")
  onConfigChange(config: any) {
    console.debug("UserProfileDirective.onConfigChange");
    if (!config) {
      console.debug("Config is null");
    } else {
      console.debug("Config: " + JSON.stringify(config));
    }
    console.debug(config);
    console.debug("UserProfileDirective.onConfigChange Done");
  }*/
}
