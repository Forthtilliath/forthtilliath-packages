/**
 * A `fetch` that answers the handful of Drive v3 REST calls googleDrive.ts
 * makes, backed by a Map — enough to run the whole manager end to end.
 */
export interface FakeDrive {
  files: Map<string, { id: string; name: string; content: string }>;
  fetch: typeof fetch;
  /** Makes the next request fail with this status (and optional reason). */
  failNext: (status: number, reason?: string) => void;
  contentOf: (name: string) => string | undefined;
  requests: string[];
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function createFakeDrive(): FakeDrive {
  const files = new Map<
    string,
    { id: string; name: string; content: string }
  >();
  const failures: { status: number; reason?: string }[] = [];
  const requests: string[] = [];
  let nextId = 1;

  function describe(id: string) {
    return { id, modifiedTime: new Date(0).toISOString() };
  }

  const fakeFetch = (input: string | URL | Request, init: RequestInit = {}) => {
    const url = new URL(input instanceof Request ? input.url : input);
    const method = init.method ?? "GET";
    requests.push(`${method} ${url.pathname}`);

    const failure = failures.shift();
    if (failure) {
      const errors = failure.reason ? [{ reason: failure.reason }] : [];
      return Promise.resolve(json({ error: { errors } }, failure.status));
    }

    const auth = new Headers(init.headers).get("Authorization");
    if (!auth?.startsWith("Bearer ")) return Promise.resolve(json({}, 401));

    const body = typeof init.body === "string" ? init.body : "";
    // /drive/v3/files[/<id>] and /upload/drive/v3/files[/<id>]
    const segments = url.pathname.split("/");
    const fileId = segments[segments.indexOf("files") + 1];

    if (method === "GET" && !fileId) {
      const name = /name = '([^']+)'/.exec(
        url.searchParams.get("q") ?? "",
      )?.[1];
      const found = [...files.values()].filter((file) => file.name === name);
      return Promise.resolve(
        json({ files: found.map((file) => describe(file.id)) }),
      );
    }
    if (method === "GET" && fileId) {
      const file = files.get(fileId);
      return Promise.resolve(file ? new Response(file.content) : json({}, 404));
    }
    if (method === "PATCH" && fileId) {
      const file = files.get(fileId);
      if (!file) return Promise.resolve(json({}, 404));
      file.content = body;
      return Promise.resolve(json(describe(file.id)));
    }
    if (method === "POST") {
      const boundary = /boundary=(.+)$/.exec(
        new Headers(init.headers).get("Content-Type") ?? "",
      )?.[1];
      const parts = body
        .split(`--${boundary ?? ""}`)
        .map((part) => part.split("\r\n\r\n")[1]?.replace(/\r\n$/, ""));
      const metadata = JSON.parse(parts[1] ?? "{}") as { name: string };
      const id = `file-${(nextId++).toString()}`;
      files.set(id, { id, name: metadata.name, content: parts[2] ?? "" });
      return Promise.resolve(json(describe(id)));
    }
    return Promise.resolve(json({}, 400));
  };

  return {
    files,
    fetch: fakeFetch,
    failNext: (status, reason) => failures.push({ status, reason }),
    contentOf: (name) =>
      [...files.values()].find((file) => file.name === name)?.content,
    requests,
  };
}
