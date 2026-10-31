import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { DEMOS } from "./demos";
import { Index } from "./Index";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Android's system font, so the screenshots look like the phone — except for
// the icons (see shims/vector-icons.tsx).
const font = document.createElement("style");
font.textContent = `* { font-family: Roboto, sans-serif !important; }
[data-icon] { font-family: Ionicons !important; }`;
document.head.append(font);

const demoId = new URLSearchParams(window.location.search).get("demo");
const Demo = demoId === null ? undefined : DEMOS[demoId];
const root = document.getElementById("root");
if (!root) throw new Error("#root missing from index.html");

createRoot(root).render(<StrictMode>{Demo ? <Demo /> : <Index />}</StrictMode>);
