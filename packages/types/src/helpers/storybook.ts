import React from "react";
import { UnknownRecord } from "../object/unknown-record.js";

/**
 * A type representing a decorator function for Storybook components.
 *
 * @template T - The type of the arguments passed to the story component.
 * @param {StoryComponent<T>} Story - The story component to be decorated.
 */
export type StoryDecorator<T extends UnknownRecord> = (
  Story: StoryComponent<T>
) => React.JSX.Element;

/**
 * A type representing a Storybook story component.
 *
 * @template T - The type of the arguments passed to the story component.
 */
export type StoryComponent<T = UnknownRecord> = (
  args: StoryArgumentsWithKey<T>
) => React.JSX.Element;

/**
 * An interface representing the arguments passed to a Storybook story component.
 *
 * @template T - The type of the arguments passed to the story component.
 */
export interface StoryArgumentsWithKey<T> {
  /**
   * A value which uniquely identifies a node among items in an array.
   */
  key: React.Key;
  /**
   * Dynamic data that are provided (and possibly updated by) Storybook and its addons.
   */
  args: Partial<T>;
}
