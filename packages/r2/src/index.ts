// Root entry: types only, so importing it never pulls in the AWS SDK.
// Runtime code lives in the `./client` (browser) and `./server` subpaths.
export type {
  PresignRequest,
  PresignResponse,
  PublicPresignResponse,
} from "./protocol.js";
