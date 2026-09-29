// Stand-in "photos" for the GradientFrame stories: inline SVG landscapes,
// so the stories need neither the network nor a licensed image.

interface Palette {
  sky: [string, string];
  sun: string;
  hills: [string, string, string];
}

const DUSK: Palette = {
  sky: ["#fcd9a8", "#f08a5d"],
  sun: "#fff4d6",
  hills: ["#b8574a", "#7a3b4f", "#3d2645"],
};

const MORNING: Palette = {
  sky: ["#bfe3f2", "#e9f5e1"],
  sun: "#fffbe6",
  hills: ["#8cc084", "#4f9a70", "#2c5f4a"],
};

function landscape({ sky, sun, hills }: Palette) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[0]}"/></linearGradient></defs>
<rect width="640" height="400" fill="url(#s)"/>
<circle cx="440" cy="190" r="64" fill="${sun}"/>
<path d="M0 260 C120 200 220 240 320 210 S520 170 640 220 V400 H0Z" fill="${hills[0]}"/>
<path d="M0 300 C140 250 260 300 380 270 S560 250 640 280 V400 H0Z" fill="${hills[1]}"/>
<path d="M0 350 C160 320 300 360 440 330 S600 320 640 340 V400 H0Z" fill="${hills[2]}"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PHOTOS = {
  dusk: { src: landscape(DUSK), alt: "Hills at dusk under an orange sky" },
  morning: { src: landscape(MORNING), alt: "Green hills on a clear morning" },
};

/** A 16:9 image filling the frame, like a real photo would. */
export function Photo({ photo }: { photo: keyof typeof PHOTOS }) {
  const { src, alt } = PHOTOS[photo];
  return (
    <img src={src} alt={alt} className="aspect-video w-full object-cover" />
  );
}
