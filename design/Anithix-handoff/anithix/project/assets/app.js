/* ============================================================
   ANITHIX — interactions
   ============================================================ */
(function () {
  /* ---- Nav scroll state ---- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const burger = document.querySelector(".nav-burger");
  const menu = document.querySelector(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.toggle("open"));
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open"))
    );
  }

  /* ---- Reveal on scroll (synchronous getBoundingClientRect — reliable everywhere) ---- */
  const reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function revealCheck() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    for (let i = reveals.length - 1; i >= 0; i--) {
      const el = reveals[i];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add("in");
        el.style.opacity = "1";
        el.style.transform = "none";
        reveals.splice(i, 1);
      }
    }
  }
  window.addEventListener("scroll", revealCheck, { passive: true });
  window.addEventListener("resize", revealCheck);
  revealCheck();
  requestAnimationFrame(revealCheck);
  setTimeout(revealCheck, 150);
  window.addEventListener("load", revealCheck);

  /* ---- Animated counters in hero stats ---- */
  // (kept static text; no fake animation needed)

  /* ---- Ecosystem interactivity ---- */
  const ecoData = {
    graviton: { ct: "AI Workspace Platform", nm: "Graviton", desc: "A powerful personal AI workspace supporting local and cloud AI models with advanced customization and productivity tools." },
    atom: { ct: "Portfolio Platform", nm: "Atom", desc: "A mobile-first portfolio builder that lets you create and manage professional portfolio websites entirely from your smartphone." },
    orbis: { ct: "AI Content Automation", nm: "Orbis", desc: "An AI-powered social automation platform that discovers trends, creates content, generates images, and manages publishing." },
    "future-labs": { ct: "Research & Innovation", nm: "Future Labs", desc: "A dedicated area showcasing future Anithix products, experiments, prototypes, and emerging technologies." },
  };
  const readout = document.querySelector(".eco-readout");
  const nodes = document.querySelectorAll(".eco-node");
  function setReadout(key) {
    if (!readout || !ecoData[key]) return;
    const d = ecoData[key];
    readout.innerHTML = `<div class="ct">${d.ct}</div><h4>${d.nm}</h4><p>${d.desc}</p>`;
    nodes.forEach((n) => n.classList.toggle("active", n.dataset.eco === key));
  }
  nodes.forEach((n) => {
    n.addEventListener("mouseenter", () => setReadout(n.dataset.eco));
    n.addEventListener("click", () => setReadout(n.dataset.eco));
  });
  setReadout("graviton");

  /* ---- Position ecosystem nodes + draw connectors ---- */
  function layoutEcosystem() {
    const stage = document.querySelector(".eco-stage");
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const R = Math.min(rect.width, rect.height) * 0.36;
    const svg = stage.querySelector(".eco-svg");
    let lines = "";
    nodes.forEach((n, i) => {
      const ang = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(ang) * R;
      const y = cy + Math.sin(ang) * R;
      n.style.left = x + "px";
      n.style.top = y + "px";
      lines += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.10)" stroke-width="1" stroke-dasharray="3 5"/>`;
    });
    if (svg) svg.innerHTML = lines;
  }
  layoutEcosystem();
  window.addEventListener("resize", layoutEcosystem);
  // relayout after fonts/layout settle
  setTimeout(layoutEcosystem, 300);

  /* ---- Position orbit chips in Graviton visual ---- */
  function layoutOrbit() {
    document.querySelectorAll(".orbit-card").forEach((card) => {
      const chips = card.querySelectorAll(".orbit-chip");
      const w = card.clientWidth, h = card.clientHeight;
      chips.forEach((chip, i) => {
        const ang = (i / chips.length) * Math.PI * 2;
        chip.style.left = (w / 2 + Math.cos(ang) * (w * 0.3)) + "px";
        chip.style.top = (h / 2 + Math.sin(ang) * (h * 0.3)) + "px";
      });
    });
  }
  layoutOrbit();
  window.addEventListener("resize", layoutOrbit);
  setTimeout(layoutOrbit, 300);

  /* ---- Contact form ---- */
  const seg = document.querySelectorAll(".seg button");
  seg.forEach((b) =>
    b.addEventListener("click", () => {
      seg.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
    })
  );
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector(".form-submit");
      btn.textContent = "Sending…";
      setTimeout(() => {
        const wrap = form.parentElement;
        const done = document.createElement("div");
        done.className = "form-done reveal in";
        done.innerHTML =
          '<div class="ok"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6L9 17l-5-5"/></svg></div>' +
          '<h3>Message sent</h3><p class="muted">Thanks for reaching out — we&rsquo;ll get back to you soon.</p>';
        form.replaceWith(done);
      }, 1100);
    });
  }

  /* ---- Year in footer ---- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
