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
  const sessions = new Map<string, { id: string; name?: string }>();
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
    // Resumable upload: POST (create) or PATCH (update) opens a session, the
    // PUT to its Location (same URL plus `upload_id`) sends the content.
    if (method === "PUT") {
      const session = sessions.get(url.searchParams.get("upload_id") ?? "");
      if (!session) return Promise.resolve(json({}, 404));
      const existing = files.get(session.id);
      files.set(session.id, {
        id: session.id,
        name: existing?.name ?? session.name ?? "",
        content: body,
      });
      return Promise.resolve(json(describe(session.id)));
    }
    if (
      url.searchParams.get("uploadType") === "resumable" &&
      (method === "POST" || method === "PATCH")
    ) {
      if (method === "PATCH" && (!fileId || !files.has(fileId)))
        return Promise.resolve(json({}, 404));
      const metadata = JSON.parse(body || "{}") as { name?: string };
      const id = fileId ?? `file-${(nextId++).toString()}`;
      const sessionId = `session-${(nextId++).toString()}`;
      sessions.set(sessionId, { id, name: metadata.name });
      const location = new URL(url);
      location.searchParams.set("upload_id", sessionId);
      return Promise.resolve(
        new Response(null, {
          status: 200,
          headers: { Location: location.toString() },
        }),
      );
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
