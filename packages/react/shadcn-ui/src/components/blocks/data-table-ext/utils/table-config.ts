/**
 * Table configuration options
 * This file provides centralized configuration for the data table features
 */
export interface TableConfig {
  enablePagination: boolean;
}

const defaultConfig: TableConfig = {
  enablePagination: true,
};

/**
 * Provides table configuration, merging in any overrides.
 *
 * Not a hook (calls no hooks internally) despite the data it computes being
 * hook-shaped — renamed off the `use` prefix so tooling doesn't treat it as
 * one.
 */
export function getTableConfig(
  overrideConfig?: Partial<TableConfig>,
): TableConfig {
  return { ...defaultConfig, ...overrideConfig };
}
