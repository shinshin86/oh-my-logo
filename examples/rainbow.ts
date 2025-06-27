import { renderFilled, PALETTES, type PaletteName } from "../dist/lib.js";

const text   = Deno.args[0] ?? "OH\nMY\nLOGO";
const fonts  = ["Standard", "Big", "Slant", "3D"];
const pals   = Object.keys(PALETTES) as PaletteName[];
let   colorFrame = 0;
let   fontFrame  = 0;
let   textFrame  = 0;

// Split text character by character (considering line breaks)
function getDisplayText(fullText: string, charIndex: number): string {
  const chars = fullText.split('');
  return chars.slice(0, charIndex + 1).join('');
}

// Calculate total character count
const totalChars = text.length;
// ────────────────────────────────────────
async function draw(): Promise<void> {
  const palette = pals[colorFrame % pals.length];
  const font    = fonts[fontFrame % fonts.length];
  
  // Calculate display character count (add 1 character every 5 frames)
  const displayCharCount = Math.floor(textFrame / 5) % (totalChars + 3);
  const displayText = displayCharCount >= totalChars 
    ? text  // Display full text after all characters are shown
    : getDisplayText(text, displayCharCount);

  // Show at least 1 character if empty
  const finalText = displayText || text[0] || "OH\nMY\nLOGO";

  try {
    const art = await renderFilled(finalText, { palette, font, direction: "horizontal" });
    console.clear();
    console.log(art);
  } catch (error) {
    console.error("Rendering error:", error);
    clearInterval(intervalId);
    process.exit(1);
  }

  colorFrame++;
  textFrame++;
  // Font changes slower (3x cycle of color)
  if (colorFrame % 3 === 0) {
    fontFrame++;
  }
}

draw();
// 50 ms = 20 fps for smoother animation
const intervalId = setInterval(draw, 50);

// Handle Ctrl+C to stop the animation gracefully
process.on('SIGINT', () => {
  clearInterval(intervalId);
  process.exit(0);
});
