"use strict";
(() => {
  const input = document.querySelector("#help-search");
  if (!input) return;
  const topics = Array.from(document.querySelectorAll("[data-topic]"));
  const clear = document.querySelector("#clear-search");
  const status = document.querySelector("#search-status");
  const empty = document.querySelector("#no-results");
  const previous = new Map();
  let searching = false;
  const normalize = value => value.normalize("NFKC").toLocaleLowerCase("en-US");
  const index = topics.map(topic => ({topic, text: normalize(topic.textContent)}));
  function update() {
    const query = normalize(input.value.trim()).slice(0, 160);
    if (query && !searching) topics.forEach(topic => previous.set(topic, topic.open));
    const words = query.split(/\s+/u).filter(Boolean);
    let count = 0;
    for (const item of index) {
      const matched = words.every(word => item.text.includes(word));
      item.topic.hidden = !matched;
      if (query) item.topic.open = matched;
      else if (searching) item.topic.open = previous.get(item.topic) || false;
      if (matched) count++;
    }
    searching = Boolean(query);
    clear.hidden = !query;
    status.hidden = !query;
    status.textContent = count === 1 ? "1 help topic found" : `${count} help topics found`;
    empty.hidden = count !== 0;
  }
  function reset() { input.value = ""; update(); input.focus(); }
  input.addEventListener("input", update);
  input.addEventListener("keydown", event => { if (event.key === "Escape") { event.preventDefault(); reset(); } });
  clear.addEventListener("click", reset);
  document.querySelector("#browse-all").addEventListener("click", reset);
  // The query is never persisted, transmitted, or reflected in the URL.
})();
