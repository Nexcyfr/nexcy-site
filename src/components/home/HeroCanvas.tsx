"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/**
 * Scène Hero — monolithe cinématique (Three.js + bloom).
 *
 * Un seul objet : une plaque monumentale en métal brossé sombre qui réfléchit un
 * environnement doré maîtrisé (reflets premium), arête lumineuse captée par le
 * bloom, dans un fond profond avec une fine poussière de particules. La
 * progression du scroll (`progressRef` 0→1) fait « naître » l'objet dans le noir
 * puis le révèle : caméra (dolly), rotation lente, montée de l'environnement et
 * des lumières, intensité des reflets et du bloom.
 *
 * Monté uniquement desktop + WebGL hors reduced-motion. Démontage propre.
 */

/** Environnement équirectangulaire doré (le métal le réfléchit → aspect « éclairé »). */
function makeGoldEnv(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0.0, "#0c0c10");
  g.addColorStop(0.40, "#241a10");
  g.addColorStop(0.56, "#6b4a22");
  g.addColorStop(0.64, "#c98f43");
  g.addColorStop(0.72, "#efc178");
  g.addColorStop(0.80, "#5a3f20");
  g.addColorStop(1.0, "#070709");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  // Lueur douce (studio) — highlight large sur le métal brossé.
  const rg = ctx.createRadialGradient(360, 300, 8, 360, 300, 300);
  rg.addColorStop(0, "rgba(255,220,150,0.95)");
  rg.addColorStop(1, "rgba(255,220,150,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, 1024, 512);
  // Bandes verticales (softbox) — réfléchies comme des sheens sur la face.
  const strip = (x: number, wd: number, a: number) => {
    const sg = ctx.createLinearGradient(x - wd, 0, x + wd, 0);
    sg.addColorStop(0, "rgba(255,236,196,0)");
    sg.addColorStop(0.5, `rgba(255,236,196,${a})`);
    sg.addColorStop(1, "rgba(255,236,196,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(x - wd, 90, wd * 2, 340);
  };
  strip(512, 74, 0.55);
  strip(176, 44, 0.32);
  strip(830, 40, 0.28);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function HeroCanvas({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let w = mount.clientWidth;
    let h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(w, h);
    renderer.setClearColor(0x050506, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050506, 0.085);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const equi = makeGoldEnv();
    const envRT = pmrem.fromEquirectangular(equi);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
    camera.position.set(0, 0.3, 9);

    // Roughness map « brossé » (stries verticales fines)
    const brushed = (() => {
      const cc = document.createElement("canvas");
      cc.width = 8; cc.height = 256;
      const cx = cc.getContext("2d")!;
      for (let y = 0; y < 256; y++) {
        const v = 60 + Math.round(Math.sin(y * 1.9) * 10 + (y % 4) * 6);
        cx.fillStyle = `rgb(${v},${v},${v})`;
        cx.fillRect(0, y, 8, 1);
      }
      const t = new THREE.CanvasTexture(cc);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2, 6);
      return t;
    })();

    // Monolithe / plaque
    const group = new THREE.Group();
    const geo = new RoundedBoxGeometry(1.4, 3.7, 0.5, 8, 0.06);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x6a5a46, // métal doré-sombre : reflète l'env sans le tuer
      metalness: 1.0,
      roughness: 0.42,
      roughnessMap: brushed,
      envMapIntensity: 0.25,
    });
    const monolith = new THREE.Mesh(geo, mat);
    group.add(monolith);

    // Arête dorée lumineuse (captée par le bloom)
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xf3c67a, transparent: true, opacity: 0.1 });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edgeMat);
    group.add(edges);
    group.rotation.set(0.12, -0.6, 0.03);
    scene.add(group);

    // Lumières
    const keyGold = new THREE.DirectionalLight(0xffcf8a, 0.2);
    keyGold.position.set(5, 4, 6);
    scene.add(keyGold);
    const rim = new THREE.DirectionalLight(0xffffff, 0.1);
    rim.position.set(-6, 2, -3);
    scene.add(rim);
    const amb = new THREE.AmbientLight(0x2a2a30, 0.4);
    scene.add(amb);
    const glow = new THREE.PointLight(0xc8883a, 4, 24, 2);
    glow.position.set(0, -0.2, -2.5);
    scene.add(glow);

    // Poussière de particules (matière visible dès le début, profondeur)
    const COUNT = 560;
    const pos = new Float32Array(COUNT * 3);
    const rnd = (n: number) => ((Math.sin(n) * 43758.5453) % 1 + 1) % 1;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = rnd(i * 12.9898) * 18 - 9;
      pos[i * 3 + 1] = rnd(i * 78.233) * 13 - 6.5;
      pos[i * 3 + 2] = rnd(i * 37.719) * 9 - 5.5;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pmat = new THREE.PointsMaterial({
      color: 0xe4a85b, size: 0.03, transparent: true, opacity: 0.55,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pgeo, pmat);
    scene.add(particles);

    // Postprocessing : bloom (arête + reflets dorés)
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.6, 0.8, 0.55);
    composer.addPass(bloom);

    let raf = 0;
    let e = 0;
    let idle = 0;

    const render = () => {
      const p = Math.max(0, Math.min(1, progressRef.current || 0));
      e += (p - e) * 0.07;
      idle += 0.0015;

      // Caméra : dolly de loin/sombre vers cadrage
      camera.position.z = 12 - e * 6.2;
      camera.position.y = 0.5 - e * 0.5;
      camera.position.x = Math.sin(e * 0.6) * 0.25;
      camera.lookAt(0, 0.1, 0);

      // Objet : rotation lente + dérive au repos
      group.rotation.y = -0.6 + e * 0.9 + Math.sin(idle) * 0.05;
      group.rotation.x = 0.12 + Math.cos(idle * 0.7) * 0.015;

      // Révélation : l'environnement réfléchi + les lumières montent
      mat.envMapIntensity = 0.08 + e * 1.9;
      keyGold.intensity = 0.1 + e * 4.3;
      rim.intensity = 0.05 + e * 1.9;
      glow.intensity = 2 + e * 6;
      edgeMat.opacity = 0.03 + e * 0.95;
      bloom.strength = 0.4 + e * 0.9;

      particles.rotation.y = idle * 0.4;
      particles.rotation.x = Math.sin(idle * 0.5) * 0.05;

      composer.render();
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const io = new IntersectionObserver((entries) => {
      const en = entries[0];
      if (!en) return;
      if (en.isIntersecting && !raf) raf = requestAnimationFrame(render);
      if (!en.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0 });
    io.observe(mount);

    const onResize = () => {
      w = mount.clientWidth; h = mount.clientHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.resolution.set(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      geo.dispose(); mat.dispose(); brushed.dispose();
      edges.geometry.dispose(); edgeMat.dispose();
      pgeo.dispose(); pmat.dispose();
      equi.dispose(); envRT.texture.dispose(); pmrem.dispose();
      bloom.dispose(); composer.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
