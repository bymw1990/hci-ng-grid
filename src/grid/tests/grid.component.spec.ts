/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {inject, TestBed} from "@angular/core/testing";

import {} from "jasmine";

import {GridModule} from "../grid.module";
import {GridComponent} from "../grid.component";

/**
 * @since 1.0.0
 */
describe("DashboardComponent Tests", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GridModule
      ]
    });
  });

  it ("Grid should be empty.", () => {
    let fixture = TestBed.createComponent(GridComponent);
    let grid = fixture.componentInstance;

    expect(grid.getGridService().getOriginalDataSize()).toBe(0);
  });

});
