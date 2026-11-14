/* Builds cases off the main thread (illustrated edition) */
importScripts('../engine.js');
self.onmessage = (e) => {
  const { id, seed, diff } = e.data;
  try {
    self.postMessage({ id, puzzle: self.MysteryEngine.generate(seed, diff) });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};
