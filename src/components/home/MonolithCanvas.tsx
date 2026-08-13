"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Monolithe de précision — WebGL (Three.js).
 *
 * Objet unique, métal brossé sombre, arête cuivrée obtenue par rim-light (accent
 * #E4A85B). Incarne « Precision in Motion » : le scroll pilote la rotation Y de
 * l'objet (scrub, via ScrollTrigger synchronisé à Lenis) ; une dérive lente
 * l'anime au repos. Aucune donnée, aucun diagramme — une seule forme contrôlée.
 *
 * Ce composant est monté UNIQUEMENT côté client, en desktop, hors reduced-motion
 * et si WebGL est disponible (garde assurée par HomeMonolith). Il se démonte
 * proprement : rAF annulé, ressources GPU disposées, ScrollTrigger tué.
 */
export function MonolithCanvas({
  triggerRef,
}: {
  triggerRef: RefObject<HTMLElement>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const trigger = triggerRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // ── Scene + environnement (reflets studio pour le métal)
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // ── Brushed roughness map (stries verticales subtiles)
    const brushed = (() => {
      const c = document.createElement("canvas");
      c.width = 8;
      c.height = 256;
      const ctx = c.getContext("2d");
      if (ctx) {
        for (let y = 0; y < 256; y++) {
          const v = 118 + Math.round(Math.sin(y * 1.7) * 6 + (y % 3) * 5);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(0, y, 8, 1);
        }
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2, 5);
      return t;
    })();

    // ── Monolithe
    const group = new THREE.Group();
    const geometry = new RoundedBoxGeometry(1.25, 3.05, 1.25, 6, 0.085);
    const material = new THREE.MeshStandardMaterial({
      color: 0x181818,
      metalness: 1.0,
      roughness: 0.32,
      roughnessMap: brushed,
      envMapIntensity: 1.0,
    });
    const monolith = new THREE.Mesh(geometry, material);
    group.add(monolith);
    group.rotation.set(0.16, -0.5, 0.04);
    scene.add(group);

    // ── Lumières : clé blanche froide + rim cuivré (l'arête)
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-4, 6, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xe4a85b, 3.4); // accent-light
    rim.position.set(5, -1, -3);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xc8883a, 0.6); // accent
    fill.position.set(3, 2, 4);
    scene.add(fill);

    scene.add(new THREE.AmbientLight(0x404040, 0.4));

    // ── État de rotation piloté par le scroll
    let scrollTarget = 0; // -1 → 1 mappé sur la progression de section
    let current = 0;
    let idle = 0;
    let visible = true;
    let raf = 0;

    const st = trigger
      ? ScrollTrigger.create({
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            scrollTarget = (self.progress - 0.5) * 2; // -1..1
          },
        })
      : null;

    const render = () => {
      idle += 0.0016;
      current += (scrollTarget - current) * 0.06;
      group.rotation.y = -0.5 + current * 0.9 + Math.sin(idle) * 0.12;
      group.rotation.x = 0.16 + Math.cos(idle * 0.7) * 0.03;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // Reveal d'entrée
    gsap.fromTo(
      mount,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.1, ease: "power2.out", delay: 0.1 },
    );
    gsap.fromTo(
      group.scale,
      { x: 0.86, y: 0.86, z: 0.86 },
      { x: 1, y: 1, z: 1, duration: 1.4, ease: "power3.out" },
    );

    // ── Pause hors viewport (économie GPU)
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(render);
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(mount);

    // ── Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      st?.kill();
      geometry.dispose();
      material.dispose();
      brushed.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [triggerRef]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
