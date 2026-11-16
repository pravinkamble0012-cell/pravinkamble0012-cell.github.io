// Reusable tap animation. Each pointer press gets its own effect, so rapid taps
// don't cancel or restart an earlier animation. Effects ignore embedded frames,
// since browsers do not expose pointer events from cross-origin iframe content.
(() => {
  const notes = ["♪", "♫", "✦", "♬"];
  const sparkDirections = [[-34,-25],[-20,32],[22,-30],[35,17],[-4,-42],[4,42]];

  function makeEffect(x, y) {
    const root = document.createElement("span");
    root.className = "tap-effect";
    root.setAttribute("aria-hidden", "true");
    root.style.setProperty("--tap-x", `${x}px`);
    root.style.setProperty("--tap-y", `${y}px`);

    const disc = document.createElement("span");
    disc.className = "tap-disc";
    root.append(disc);

    const note = document.createElement("span");
    note.className = "tap-note";
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    const angle = Math.random() * Math.PI * 2;
    note.style.setProperty("--note-x", `${Math.cos(angle) * 55}px`);
    note.style.setProperty("--note-y", `${Math.sin(angle) * 55 - 20}px`);
    root.append(note);

    sparkDirections.forEach(([baseX, baseY]) => {
      const spark = document.createElement("span");
      spark.className = "tap-spark";
      const spread = 0.75 + Math.random() * 0.7;
      spark.style.setProperty("--spark-x", `${baseX * spread}px`);
      spark.style.setProperty("--spark-y", `${baseY * spread}px`);
      root.append(spark);
    });

    document.body.append(root);
    window.setTimeout(() => root.remove(), 1000);
  }

  document.addEventListener("pointerdown", (event) => {
    if (event.isPrimary === false || event.button > 0) return;
    makeEffect(event.clientX, event.clientY);
  }, { passive: true });

  // Give keyboard activation a visible effect too.
  document.addEventListener("click", (event) => {
    if (event.detail === 0) {
      const rect = event.target.getBoundingClientRect();
      makeEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  });
})();
