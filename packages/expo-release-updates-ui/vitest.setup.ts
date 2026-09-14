declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

// react-test-renderer's act() warns unless this flag is set — see
// https://react.dev/warnings/react-test-renderer for context.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
