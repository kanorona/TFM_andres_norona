"use strict";

(function () {
  // === VARIABLES GLOBALES ===
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  var panoElement = document.getElementById("pano");
  var sceneNameElement = document.querySelector("#titleBar .sceneName");
  var thumbContainer = document.getElementById("thumbContainer");

  var autorotateToggleElement = document.getElementById("autorotateToggle");
  var fullscreenToggleElement = document.getElementById("fullscreenToggle");

  // ====== VIEWER ======
  var viewerOpts = {
    controls: { mouseViewMode: data.settings.mouseViewMode }
  };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // ====== CREAR ESCENAS ======
  var scenes = data.scenes.map(function (dataScene) {
    var urlPrefix = "tiles";

    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + dataScene.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + dataScene.id + "/preview.jpg" }
    );

    var geometry = new Marzipano.CubeGeometry(dataScene.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(
      dataScene.faceSize,
      120 * Math.PI / 180,
      120 * Math.PI / 180
    );

    var view = new Marzipano.RectilinearView(
      dataScene.initialViewParameters,
      limiter
    );

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    return { data: dataScene, scene: scene, view: view };
  });

 // ================================
  // AUTOROTATE POR INACTIVIDAD
  // ================================
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2
  });

  var idleTimer = null;
  var autorotatePausado = false;

  // Iniciar autorotate
  function startAutorotate() {
    viewer.startMovement(autorotate);
  }

  // Detener autorotate
  function stopAutorotate() {
    viewer.stopMovement();
  }

  // Resetear temporizador
  function resetIdleTimer() {
    if (autorotatePausado) return;

    stopAutorotate();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAutorotate, 5000);
  }

  viewer.controls().addEventListener("active", resetIdleTimer);
  resetIdleTimer();  // Iniciar la lógica una vez


  // ================================
  // BOTÓN PAUSAR / REANUDAR
  // ================================
  var autorotateToggleElement = document.getElementById("autorotateToggle");

  autorotateToggleElement.addEventListener("click", function () {
    if (!autorotatePausado) {
      // PAUSAR
      autorotatePausado = true;
      autorotateToggleElement.classList.add("enabled");
      stopAutorotate(); // ❌ ESTE ES EL ERROR
    } else {
      // REANUDAR
      autorotatePausado = false;
      autorotateToggleElement.classList.remove("enabled");
      resetIdleTimer();
    }
  });





  

  // ====== FULLSCREEN ======
  if (screenfull.enabled) {
    fullscreenToggleElement.style.display = "block";

    fullscreenToggleElement.addEventListener("click", function () {
      screenfull.toggle();
    });

    screenfull.on("change", function () {
      fullscreenToggleElement.classList.toggle("enabled", screenfull.isFullscreen);
    });
  }

  // ===============================================================
  //      MINIATURAS (Thumbnails con texto debajo)
  // ===============================================================
  function createThumbnails() {
    data.scenes.forEach(function (sceneData) {

      var thumb = document.createElement("div");
      thumb.className = "thumb";
      thumb.dataset.id = sceneData.id;

      // Imagen
      var img = document.createElement("img");
      img.src = "tiles/" + sceneData.id + "/1/f/0/0.jpg";
      img.onerror = function () {
        img.src = "img/no-thumb.jpg";
      };

      // Nombre debajo
      var label = document.createElement("div");
      label.className = "thumbLabel";
      label.innerText = sceneData.name;

      thumb.appendChild(img);
      thumb.appendChild(label);

      thumb.addEventListener("click", function () {
        switchScene(findSceneById(sceneData.id));
      });

      thumbContainer.appendChild(thumb);
    });
  }

  function updateActiveThumb(id) {
    document.querySelectorAll(".thumb").forEach((t) => {
      t.classList.toggle("active", t.dataset.id === id);
    });
  }

  // ================================
  // HOTSPOTS CON POPUP / TOOLTIP
  // ================================
  function createLinkHotspots(sceneObj) {
    var scene = sceneObj.scene;

    if (!sceneObj.data.linkHotspots) return;

    sceneObj.data.linkHotspots.forEach(function (hotspot) {

      var wrapper = document.createElement("div");
      wrapper.className = "link-hotspot";

      var icon = document.createElement("img");
      icon.src = "img/link.png";
      icon.className = "link-hotspot-icon";

      var tooltip = document.createElement("div");
      tooltip.className = "link-hotspot-tooltip";
      tooltip.innerText = findSceneById(hotspot.target).data.name;

      wrapper.appendChild(icon);
      wrapper.appendChild(tooltip);

      wrapper.addEventListener("click", function () {
        switchScene(findSceneById(hotspot.target));
      });

      var hotspotObj = scene.hotspotContainer().createHotspot(wrapper, {
        yaw: hotspot.yaw, pitch: hotspot.pitch
      });

      // Reposicionar tooltip en cada render
      function updateTooltipPosition() {
        var screenPos = hotspotObj.screenPosition();
        tooltip.style.left = screenPos.x + "px";
        tooltip.style.top = (screenPos.y - 40) + "px";
      }

      viewer.addEventListener("render", updateTooltipPosition);
    });
  }

  // ===============================================================
  //   EFECTO CÁMARA TIPO CINEMÁTICO
  // ===============================================================
  function animateCamera(view, fromParams, toParams, duration = 1500) {
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const current = {
        yaw: fromParams.yaw + (toParams.yaw - fromParams.yaw) * ease,
        pitch: fromParams.pitch + (toParams.pitch - fromParams.pitch) * ease,
        fov: fromParams.fov + (toParams.fov - fromParams.fov) * ease
      };

      view.setParameters(current);
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // ===============================================================
  //   CAMBIO DE ESCENA
  // ===============================================================
  function switchScene(sceneObj) {

      // 🔥 Cerrar panel de planos (si está abierto)
    document.getElementById("popupPlano")?.classList.add("hidden");

    // 🔥 Cerrar panel BIM (si está abierto)
    document.getElementById("popupModelo3D")?.classList.add("hidden");
    //Cerrar lugares cercanos

    document.getElementById("popupLugares")?.classList.add("hidden");


    stopAutorotate();

    const overlay = document.getElementById("fadeOverlay");
    overlay.classList.add("fade-out");

    setTimeout(function () {
      sceneObj.scene.switchTo();

      overlay.classList.remove("fade-out");
      overlay.classList.add("fade-in");
      setTimeout(() => overlay.classList.remove("fade-in"), 350);

      const view = sceneObj.view;
      const finalParams = sceneObj.data.initialViewParameters;

      const startParams = {
        yaw: finalParams.yaw - 0.25,
        pitch: finalParams.pitch + 0.05,
        fov: finalParams.fov + 0.4
      };

      view.setParameters(startParams);
      animateCamera(view, startParams, finalParams, 1500);

      updateSceneName(sceneObj);
      updateActiveThumb(sceneObj.data.id);

      createLinkHotspots(sceneObj);

      resetIdleTimer();

    }, 300);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = scene.data.name;
  }

  function findSceneById(id) {
    return scenes.find((s) => s.data.id === id);
  }

  // ================================
  //   INICIALIZACIÓN
  // ================================
  createThumbnails();
  switchScene(scenes[0]);

    // ======================
  // 🎧 CONTROL DE MÚSICA
  // ======================
  var music = document.getElementById("bgMusic");
  var musicButton = document.getElementById("musicButton");
  var musicEnabled = true;

  // Intentar reproducir automáticamente
  music.volume = 0.6;
  music.play().catch(() => {
    // En móviles necesita interacción
    musicEnabled = false;
    musicButton.textContent = "🔇";
  });

  // Al hacer clic en el botón
  musicButton.addEventListener("click", function () {
    if (musicEnabled) {
      music.pause();
      musicButton.textContent = "🔇";
    } else {
      music.play().catch(()=>{});
      musicButton.textContent = "🔊";
    }
    musicEnabled = !musicEnabled;
  });

  // ======================
  // POPUP DEL PLANO
  // ======================
  window.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("btnPlanoRender");
    const popup = document.getElementById("popupPlano");
    const cerrar = document.getElementById("cerrarPopupPlano");

    if (btn) {
      btn.addEventListener("click", () => {
        popup.classList.remove("hidden");
      });
    }

    if (cerrar) {
      cerrar.addEventListener("click", () => {
        popup.classList.add("hidden");
      });
    }

  });

  // Hotspots dentro del plano (mapa)
  document.querySelectorAll(".planoHotspot").forEach(h => {
    h.addEventListener("click", () => {
      const target = h.dataset.target;
      const sceneObj = findSceneById(target);

      if (sceneObj) {
        // Cerrar popup
        document.getElementById("popupPlano").classList.add("hidden");

        // Cambiar de escena
        switchScene(sceneObj);
      } else {
        console.error("La escena no existe: " + target);
      }
    });
  });
  // ===============================
  //  TOOLTIP PARA BOTONES DEL PLANO
  // ===============================
  document.querySelectorAll(".planoHotspot").forEach(h => {

    let tooltip;

    // Mostrar tooltip al pasar el mouse
    h.addEventListener("mouseenter", () => {
      const name = h.dataset.name;

      tooltip = document.createElement("div");
      tooltip.className = "planoTooltip";
      tooltip.innerText = name;

      h.appendChild(tooltip);

      // Mostrar con animación
      requestAnimationFrame(() => {
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translate(-50%, -160%)";
      });
    });

    // Ocultar tooltip al salir
    h.addEventListener("mouseleave", () => {
      if (tooltip) {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translate(-50%, -140%)";
        setTimeout(() => tooltip?.remove(), 200);
      }
    });

  });

  // ===============================
  //     SWITCH ENTRE BIM <-> CAD
  // ===============================
  window.addEventListener("DOMContentLoaded", () => {

    const planoBIM = document.getElementById("planoBIM");
    const planoCAD = document.getElementById("planoCAD");

    const btnBIM   = document.getElementById("btnPlanoBIM");
    const btnCAD   = document.getElementById("btnPlanoCAD");

    // Mostrar BIM al abrir
    planoBIM.classList.add("visible");
    planoCAD.classList.add("hidden");

    // ← BOTÓN BIM
    btnBIM.addEventListener("click", () => {

      planoBIM.classList.remove("hidden");
      planoBIM.classList.add("visible");

      planoCAD.classList.remove("visible");
      planoCAD.classList.add("hidden");

      btnBIM.classList.add("active");
      btnCAD.classList.remove("active");
    });

    // ← BOTÓN CAD
    btnCAD.addEventListener("click", () => {

      planoCAD.classList.remove("hidden");
      planoCAD.classList.add("visible");

      planoBIM.classList.remove("visible");
      planoBIM.classList.add("hidden");

      btnCAD.classList.add("active");
      btnBIM.classList.remove("active");
    });

    const switcher = document.getElementById("planoSwitcher");

    btnBIM.addEventListener("click", () => {
      switcher.classList.remove("cad");
    });

    btnCAD.addEventListener("click", () => {
      switcher.classList.add("cad");
    });

  });

    // ====== POPUP MODELO BIM ======
  const btnModeloPopup = document.getElementById("btnModeloPopup");
  const popupModelo3D   = document.getElementById("popupModelo3D");
  const cerrarModelo3D  = document.getElementById("cerrarModelo3D");

  btnModeloPopup.addEventListener("click", () => {
    popupModelo3D.classList.remove("hidden");
  });

  cerrarModelo3D.addEventListener("click", () => {
    popupModelo3D.classList.add("hidden");
  });

    window.irEscena3D = function(targetId) {
    const targetScene = scenes.find(s => s.data.id === targetId);

    if (targetScene) {
      document.getElementById("popupModelo3D").classList.add("hidden");
      switchScene(targetScene);
    } else {
      console.error("La escena no existe:", targetId);
    }
  };

    // ===============================================
    // TOOLTIP EXCLUSIVO PARA HOTSPOTS DEL MODELO 3D
    // ===============================================
    document.querySelectorAll(".hotspot3D").forEach(h => {

      let tooltip3D;

      // Mostrar tooltip al pasar el mouse
      h.addEventListener("mouseenter", () => {
        const name = h.dataset.name;

        tooltip3D = document.createElement("div");
        tooltip3D.className = "tooltip3D";   // ← Clase diferente
        tooltip3D.innerText = name;

        h.appendChild(tooltip3D);

        // Mostrar con animación
        requestAnimationFrame(() => {
          tooltip3D.style.opacity = "1";
          tooltip3D.style.transform = "translate(-50%, -160%)";
        });
      });

      // Ocultar tooltip al salir
      h.addEventListener("mouseleave", () => {
        if (tooltip3D) {
          tooltip3D.style.opacity = "0";
          tooltip3D.style.transform = "translate(-50%, -140%)";
          setTimeout(() => tooltip3D?.remove(), 200);
        }
      });

    });

    // ================================
    // CERRAR POPUP DE PLANOS AL HACER CLIC FUERA
    // ================================
    document.addEventListener("click", function(e) {
      const panel = document.getElementById("popupPlano");
      const btn   = document.getElementById("btnPlanoRender");

      if (!panel.classList.contains("hidden")) {
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
          panel.classList.add("hidden");
        }
      }
    });


    // ================================
    // CERRAR POPUP BIM AL HACER CLIC FUERA
    // ================================
    document.addEventListener("click", function(e) {
      const panel = document.getElementById("popupModelo3D");
      const btn   = document.getElementById("btnModeloPopup");

      if (!panel.classList.contains("hidden")) {
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
          panel.classList.add("hidden");
        }
      }
    });

    


    // ====== POPUP LUGARES ======
    const btnLugares      = document.getElementById("btnLugares");
    const popupLugares    = document.getElementById("popupLugares");
    const cerrarLugares   = document.getElementById("cerrarPopupLugares");
    const iframeLugares   = document.getElementById("iframeLugares");

    let iframeLoaded = false;

    // Detectar cuando el iframe terminó de cargar
    iframeLugares.addEventListener("load", () => {
      iframeLoaded = true;
    });

    btnLugares.addEventListener("click", () => {
      popupLugares.classList.remove("hidden");

      // Esperar un poco para animación del popup
      setTimeout(() => {

        // Esperar a que el iframe realmente haya cargado
        if (!iframeLoaded) {
          console.warn("⚠️ El iframe aún no está listo");
          return;
        }

        try {

          const innerWin  = iframeLugares.contentWindow;
          const innerDoc  = innerWin.document;
          const innerMap  = innerWin.map;

          if (!innerMap) {
            console.warn("⚠️ map no existe todavía dentro del iframe");
            return;
          }

          // ===========================================
          //           🔥 AJUSTAR MAPA AQUÍ
          // ===========================================

          // 1) recalcular tamaño
          innerMap.invalidateSize();

          // 2) recenter
          innerMap.setView([-0.13226, -78.47046], 15);

          // 3) compensar sidebar
          const sidebar = innerDoc.querySelector(".sidebar");
          if (sidebar) {
            const w = sidebar.offsetWidth || 320;
            innerMap.panBy([-w / 2, 0]);
          }

        } catch (err) {
          console.warn("🚫 No se pudo acceder al mapa dentro del iframe", err);
        }

      }, 350);

    });

    cerrarLugares.addEventListener("click", () => {
      popupLugares.classList.add("hidden");
    });

    
    // Cerrar popup de Lugares al hacer clic fuera
    document.addEventListener("click", function(e) {
      const panel = document.getElementById("popupLugares");
      const btn   = document.getElementById("btnLugares");

      if (!panel.classList.contains("hidden")) {
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
          panel.classList.add("hidden");
        }
      }
    });


})();
