// Fixture for src/angular.test.js — a well-formed component (selector
// respects the "app-" prefix / kebab-case convention angular.js enforces)
// that should lint clean under `angularConfig`.
//
// Import order specifically exercises the Angular-only
// simple-import-sort/imports override: "@angular/core" and "rxjs" are
// grouped together ahead of every other third-party package (here,
// "eslint", standing in for an arbitrary unrelated dependency) — under
// baseConfig's plain alphabetical single bucket, "eslint" (e) would instead
// sort between "@angular/core" (@) and "rxjs" (r).
import { Component } from "@angular/core";
import { Subject } from "rxjs";

import type { ESLint } from "eslint";

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
