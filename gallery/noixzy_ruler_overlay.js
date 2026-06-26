(() => {
  const OVERLAY_ID = "noixzy-ruler";
  const STYLE_ID = "noixzy-ruler-style";
  let raf = 0;

  function targetElements() {
    const galleryTargets = [
      ...document.querySelectorAll(".thumb"),
      ...document.querySelectorAll(".card img")
    ].filter(Boolean);

    if (galleryTargets.length) return galleryTargets;

    const moduleTarget =
      document.querySelector("canvas") ||
      document.querySelector("#stage") ||
      document.querySelector(".stage") ||
      document.querySelector(".canvasWrap") ||
      document.querySelector(".preview") ||
      document.querySelector("main") ||
      document.querySelector(".app");

    return moduleTarget ? [moduleTarget] : [];
  }

  function removeOverlay() {
    cancelAnimationFrame(raf);
    document.getElementById(OVERLAY_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
  }

  function injectStyle() {
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${OVERLAY_ID} {
        position: fixed;
        inset: 0;
        z-index: 999999999;
        pointer-events: none;
      }

      #${OVERLAY_ID} .noixzy-ruler-box {
        position: fixed;
        pointer-events: none;
        opacity: .5;
        overflow: hidden;
        border-radius: inherit;
        background:
          linear-gradient(rgba(255,255,255,.55) 0.7px, transparent 0.7px),
          linear-gradient(90deg, rgba(255,255,255,.55) 0.7px, transparent 0.7px),
          linear-gradient(rgba(255,255,255,.85) 1.4px, transparent 1.4px),
          linear-gradient(90deg, rgba(255,255,255,.85) 1.4px, transparent 1.4px);
        background-size:
          50px 50px,
          50px 50px,
          100px 100px,
          100px 100px;
      }
    `;

    document.head.appendChild(style);
  }

  function syncBoxes() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    const targets = targetElements();
    overlay.innerHTML = "";

    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      const left = Math.max(0, r.left);
      const top = Math.max(0, r.top);
      const right = Math.min(window.innerWidth, r.right);
      const bottom = Math.min(window.innerHeight, r.bottom);
      const width = right - left;
      const height = bottom - top;

      if (width < 20 || height < 20) return;

      const box = document.createElement("div");
      box.className = "noixzy-ruler-box";
      box.style.left = `${left}px`;
      box.style.top = `${top}px`;
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;

      overlay.appendChild(box);
    });
  }

  function scheduleSync() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(syncBoxes);
  }

  function addOverlay() {
    removeOverlay();
    injectStyle();

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    document.body.appendChild(overlay);

    syncBoxes();
    setTimeout(syncBoxes, 150);
    setTimeout(syncBoxes, 500);
  }

  window.NoixzyRuler = {
    show() {
      localStorage.setItem("noixzyRulerOverlay", "1");
      addOverlay();
    },
    hide() {
      localStorage.setItem("noixzyRulerOverlay", "0");
      removeOverlay();
    },
    toggle() {
      if (document.getElementById(OVERLAY_ID)) {
        this.hide();
      } else {
        this.show();
      }
    },
    refresh() {
      syncBoxes();
    }
  };

  window.addEventListener("resize", scheduleSync);
  window.addEventListener("scroll", scheduleSync, true);

  if (localStorage.getItem("noixzyRulerOverlay") === "1") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", addOverlay);
    } else {
      addOverlay();
    }
  }
})();
