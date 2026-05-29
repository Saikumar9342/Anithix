/* ============================================================
   ANITHIX — Realistic 3D hero scene
   PBR metal/glass orb + studio environment reflections.
   Three.js r128 (global THREE).
   ============================================================ */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  /* ---- Procedural studio environment (drives realistic reflections) ---- */
  function makeStudioEnv() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 512;
    const x = c.getContext("2d");
    // base gradient — dark room, brighter ceiling
    const g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#3a3a40");
    g.addColorStop(0.45, "#17171b");
    g.addColorStop(1, "#070708");
    x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    // soft key softbox (top-left), warm-neutral
    function soft(cx, cy, r, col) {
      const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      rg.addColorStop(0, col);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = rg; x.fillRect(0, 0, 1024, 512);
    }
    soft(300, 120, 260, "rgba(255,255,255,0.95)");   // key light
    soft(820, 180, 200, "rgba(200,205,255,0.55)");   // cool fill (subtle accent)
    soft(560, 470, 320, "rgba(120,120,130,0.4)");    // floor bounce
    // thin bright strip — gives the orb a crisp specular streak
    x.fillStyle = "rgba(255,255,255,0.85)";
    x.fillRect(120, 60, 420, 10);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(makeStudioEnv());
  scene.environment = envRT.texture;

  /* ---- Groups for parallax ---- */
  const world = new THREE.Group();
  scene.add(world);

  /* ---- Main orb: polished dark metal ---- */
  const orbGeo = new THREE.SphereGeometry(1.62, 128, 128);
  const orbMat = new THREE.MeshPhysicalMaterial({
    color: 0x121214,
    metalness: 1.0,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.25,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.castShadow = true;
  world.add(orb);

  /* ---- Fine engraved latitude lines (subtle, premium detail) ---- */
  const linesGroup = new THREE.Group();
  for (let i = 1; i <= 7; i++) {
    const t = i / 8;
    const r = Math.sin(Math.PI * t) * 1.628;
    const y = Math.cos(Math.PI * t) * 1.628;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.004, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    linesGroup.add(ring);
  }
  orb.add(linesGroup);

  /* ---- Glass / clearcoat orbital ring ---- */
  const ringGeo = new THREE.TorusGeometry(2.55, 0.045, 24, 220);
  const ringMat = new THREE.MeshPhysicalMaterial({
    color: 0xdadbe6,
    metalness: 0.4,
    roughness: 0.08,
    transmission: 0.55,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 1.4,
    ior: 1.4,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.62;
  ring.rotation.y = Math.PI * 0.1;
  world.add(ring);

  /* ---- A few orbiting satellite spheres (metal) ---- */
  const sats = [];
  const satMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a2a30, metalness: 1, roughness: 0.3, clearcoat: 1, envMapIntensity: 1.1,
  });
  const satMatBright = new THREE.MeshPhysicalMaterial({
    color: 0xe8e8ee, metalness: 1, roughness: 0.15, clearcoat: 1, envMapIntensity: 1.3,
  });
  const satConfigs = [
    { r: 2.55, size: 0.13, speed: 0.32, phase: 0.0, tilt: 0.62, bright: true },
    { r: 2.55, size: 0.09, speed: 0.32, phase: 2.3, tilt: 0.62, bright: false },
    { r: 3.25, size: 0.11, speed: 0.2, phase: 1.2, tilt: -0.35, bright: false },
    { r: 3.6, size: 0.07, speed: 0.16, phase: 4.1, tilt: 0.9, bright: true },
  ];
  satConfigs.forEach((cfg) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(cfg.size, 48, 48), cfg.bright ? satMatBright : satMat);
    const pivot = new THREE.Group();
    pivot.rotation.z = cfg.tilt;
    pivot.add(m);
    world.add(pivot);
    sats.push({ mesh: m, pivot, ...cfg });
  });

  /* ---- Lighting (studio) ---- */
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 5, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xc6caff, 1.6); // faint cool rim = subtle accent
  rim.position.set(5, -2, -4);
  scene.add(rim);

  const fill = new THREE.PointLight(0xffffff, 0.6, 40);
  fill.position.set(3, 1, 5);
  scene.add(fill);

  scene.add(new THREE.AmbientLight(0x404048, 0.6));

  /* ---- Shadow catcher (grounds the orb realistically) ---- */
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), shadowMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.4;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---- Interaction: pointer parallax ---- */
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  /* ---- Scroll: drift + scale the whole world out as you leave hero ---- */
  let scrollFactor = 0;
  function onScroll() {
    const h = window.innerHeight;
    scrollFactor = Math.min(1, Math.max(0, window.scrollY / h));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Resize ---- */
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ---- Composition: push the orb to the right, like an editorial product shot ---- */
  function applyComposition() {
    // shift right on wide screens, center on narrow
    const wide = window.innerWidth > 900;
    world.position.x = wide ? 2.05 : 0;
    world.position.y = wide ? 0.1 : 0.6;
    const s = wide ? 1 : 0.74;
    world.scale.setScalar(s);
  }
  applyComposition();
  window.addEventListener("resize", applyComposition);

  /* ---- Animate ---- */
  const clock = new THREE.Clock();
  let raf;
  function tick() {
    const t = clock.getElapsedTime();
    const dt = Math.min(clock.getDelta ? 0.016 : 0.016, 0.033);

    if (!prefersReduced) {
      cur.x += (target.x - cur.x) * 0.045;
      cur.y += (target.y - cur.y) * 0.045;

      orb.rotation.y = t * 0.12;
      linesGroup.rotation.y = -t * 0.04;
      ring.rotation.z = t * 0.06;

      sats.forEach((s) => {
        const a = t * s.speed + s.phase;
        s.mesh.position.set(Math.cos(a) * s.r, 0, Math.sin(a) * s.r);
      });

      // pointer parallax (gentle)
      world.rotation.y = cur.x * 0.22;
      world.rotation.x = cur.y * 0.14;
    }

    // scroll: float orb up & fade-scale as user scrolls past hero
    const baseY = (window.innerWidth > 900 ? 0.1 : 0.6);
    world.position.y = baseY + Math.sin(t * 0.6) * 0.06 + scrollFactor * 1.6;
    const baseS = (window.innerWidth > 900 ? 1 : 0.74);
    world.scale.setScalar(baseS * (1 - scrollFactor * 0.25));
    canvas.style.opacity = String(1 - scrollFactor * 0.85);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else { tick(); }
  });
})();
