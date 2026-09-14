// Fixture for src/angular.test.js — same as good.component.ts, but with a
// selector that violates the "app-" prefix / kebab-case convention, to
// assert @angular-eslint/component-selector actually fires.
import { Component } from "@angular/core";

@Component({
  selector: "widget",
  templateUrl: "./good.component.html",
})
export class BadWidgetComponent {
  readonly title = "Widget";
}
