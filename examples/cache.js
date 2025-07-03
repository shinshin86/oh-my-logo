import { render, getCacheStats, clearCache } from '../dist/lib.js';

// List of all available color palettes
const palette = [
  "grad-blue",
  "sunset",
  "dawn",
  "nebula",
  "mono",
  "ocean",
  "fire",
  "forest",
  "gold",
  "purple",
  "mint",
  "coral",
  "matrix"
];

// Fisher-Yates shuffle to randomize array without mutating original
function randomize(array) {
 const copy = [...array];
 for (let i = copy.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [copy[i], copy[j]] = [copy[j], copy[i]];
 }
 return copy;
}

// Render "HELLO" with a given palette using internal caching
async function generate(palette) {
 return await render('HELLO', { palette });
}

(async () => {
 // Initial batch render (10 runs)
 for (let i = 0; i < 10; i++) {
  const palGen = randomize(palette);
  const logo = await generate(palGen[0]); // Only use the first random palette
  console.log(logo);
 }

 // Repeated rendering every 500ms with different palette
 // Useful for testing LRU cache behavior under frequent calls
 setInterval(async () => {
  const palGen = randomize(palette);
  const logo = await generate(palGen[0]);
  console.log(logo);
 }, 500); // lower interval = faster render loop, useful for stress-testing cache
})();

// When process is manually stopped (e.g. Ctrl+C), print cache statistics
process.on('SIGINT', () => {
 const stats = getCacheStats();
 console.log(`Cache Stats: ${JSON.stringify(stats, null, 2)}`);
 process.exit();
});