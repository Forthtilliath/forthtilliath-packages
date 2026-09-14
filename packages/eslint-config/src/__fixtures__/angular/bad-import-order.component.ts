// Fixture for src/angular.test.js — same as good.component.ts, but with
// imports in plain alphabetical order ("@angular/core", "eslint", "rxjs")
// instead of Angular-core-and-rxjs-first ("@angular/core", "rxjs", then
// "eslint") — the order baseConfig's single merged "packages" bucket would
// accept, but the Angular-specific override doesn't. Asserts the override
// actually changes behavior instead of coincidentally matching plain
// alphabetical order (which it would for "@angular/core" vs most unscoped
// packages, since "@" already sorts first in ASCII).
import { Component } from "@angular/core";
import type { ESLint } from "eslint";
import { Subject } from "rxjs";

import { WIDGET_LABEL } from "./helper.js";

@Component({
  selector: "app-widget",
  templateUrl: "./good.component.html",
})
export class WidgetComponent {
  readonly title = WIDGET_LABEL;
  private readonly destroy$ = new Subject<void>();
  linter?: ESLint;
}
