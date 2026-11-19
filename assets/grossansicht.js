// Großansicht für die Übersicht: Klick auf ein Bild öffnet es groß auf ruhigem Grund,
// ohne die Seite zu verlassen oder zu scrollen. Pfeile/Wischen blättern, Esc schließt.
// Ohne JavaScript führt jeder Link einfach zur großen Bilddatei.
(() => {
  const dialog = document.querySelector("dialog.gross");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const links = [...document.querySelectorAll(".raster a[data-gross]")];
  const bild = dialog.querySelector("img");
  const text = dialog.querySelector("figcaption");
  let aktuell = 0;

  function zeige(i) {
    aktuell = (i + links.length) % links.length;
    const a = links[aktuell];
    bild.classList.remove("geladen");
    bild.onload = () => bild.classList.add("geladen");
    bild.srcset = a.dataset.srcset;
    bild.src = a.dataset.gross;
    bild.alt = a.querySelector("img")?.alt || "";
    text.textContent = a.dataset.unterschrift;
    if (bild.complete) bild.classList.add("geladen");
  }

  links.forEach((a, i) => a.addEventListener("click", (ev) => {
    ev.preventDefault();
    zeige(i);
    document.documentElement.classList.add("gross-offen"); // Seite dahinter bleibt stehen
    dialog.showModal();
  }));

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("gross-offen");
    links[aktuell].focus({ preventScroll: true }); // Fokus zurück, ohne zu springen
  });
  dialog.querySelector(".gross-zu").addEventListener("click", () => dialog.close());
  dialog.querySelector(".gross-zurueck").addEventListener("click", () => zeige(aktuell - 1));
  dialog.querySelector(".gross-weiter").addEventListener("click", () => zeige(aktuell + 1));
  // Klick auf die freie Fläche neben dem Bild schließt
  dialog.addEventListener("click", (ev) => { if (ev.target === dialog || ev.target.tagName === "FIGURE") dialog.close(); });
  dialog.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft") zeige(aktuell - 1);
    if (ev.key === "ArrowRight") zeige(aktuell + 1);
  });
  // Wischen auf dem Handy
  let startX = null;
  dialog.addEventListener("touchstart", (ev) => { startX = ev.touches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", (ev) => {
    if (startX === null) return;
    const dx = ev.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) zeige(aktuell + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
