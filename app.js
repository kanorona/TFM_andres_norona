

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNWRlMDY0MS0wMWJkLTRhODItOTAzYS1jYTNhZmE0YzVkNTgiLCJpZCI6MzU0MTYyLCJpYXQiOjE3NjE5Mjc3OTF9.QdIV5TPs0D8mCnE3TjDHiHQxwunslZjXiZ5FS5tm6L0";



// agregar tiles


function openTour(sceneName) {
  const popup = document.getElementById("tourPopup");
  const iframe = document.getElementById("tourIframe");

  iframe.src = `marzipano/${sceneName}/app-files/index.html`;

  popup.classList.remove("hidden");
}

function closeTour() {
  const popup = document.getElementById("tourPopup");
  const iframe = document.getElementById("tourIframe");

  popup.classList.add("hidden");

  iframe.src = "";
}


function buildTileFolder(sceneName) {
  return "0-" + sceneName
    .toLowerCase()
    .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i")
    .replace(/ó/g, "o").replace(/ú/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9\-]/g, "");
}


// Base Hotspots

const hotspots = [
  {
    scene: "Areas-verdes",
    lon: -78.470430,
    lat: -0.132450,
    alt: 2938,
    thumb: "marzipano/Areas-verdes/app-files/tiles/0-reas-verdes/1/f/0/0.jpg",
    enabled: true
  },
  {
    scene: "Area-de-mascotas",
    lon: -78.470300,
    lat: -0.132525,
    alt: 2938,
    thumb: "marzipano/Area-de-mascotas/app-files/tiles/0-rea-de-mascotas/1/f/0/0.jpg",
    enabled: true
  },
  { scene: "Billar", lon: -78.470660, lat: -0.132550, alt: 2960, enabled: false },
  { scene: "Gimnasio", lon: -78.470446, lat: -0.132799, alt: 2937,
    thumb: "marzipano/Gimnasio/app-files/tiles/0-gimnasio-a/1/b/0/0.jpg",
    enabled: false },
  { scene: "Guaderia", lon: -78.470452, lat: -0.132777, alt: 2934,
    thumb: "marzipano/Guaderia/app-files/tiles/0-guardera/1/r/0/0.jpg",
    enabled: false },
  { scene: "Jacuzzi", lon: -78.470610, lat: -0.132545, alt: 2948,
    thumb: "marzipano/Jacuzzi/app-files/tiles/0-jacuzzi-a/1/f/0/0.jpg",
    enabled: true },
  { scene: "Sala-coworking", lon: -78.470599, lat: -0.132760, alt: 2937, enabled: false },
  { scene: "Sala-de-reuniones", lon: -78.470449, lat: -0.132813, alt: 2934, enabled: false },
  { scene: "sauna", lon: -78.470574, lat: -0.132846, alt: 2943, enabled: false },
  { scene: "spa", lon: -78.470513, lat: -0.132791, alt: 2943, enabled: false },
  { scene: "terraza-1", lon: -78.470655, lat: -0.132580, alt: 2948, enabled: true },
  { scene: "terraza-2", lon: -78.470515, lat: -0.132560, alt: 2948, enabled: true },
  { scene: "terraza-3", lon: -78.470640, lat: -0.132640, alt: 2943, enabled: true },
  { scene: "Turco", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false },
  { scene: "torre2_terraza2", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false },
  { scene: "torre2_terraza1", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false },
  { scene: "torre1_terraza2", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false },
  { scene: "torre1_terraza", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false },
  { scene: "sala_cine", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false },
  { scene: "sala_juegos", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false },
  { scene: "salon_eventos", lon: -78.470524, lat: -0.132830, alt: 2943, enabled: false }

];


//Inciar cesium

async function initCesium() {

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1),
    animation: false,
    timeline: false,
    geocoder: false,
    sceneModePicker: false,
    baseLayerPicker: true,
    fullscreenButton: true,
    homeButton: true
  });

  viewer._cesiumWidget._creditContainer.style.display = "none";


  // Agregar capas de ceisum


  let tileset1, tileset2, tileset3;

  try {
    tileset1 = await Cesium.Cesium3DTileset.fromIonAssetId(4318249);
    viewer.scene.primitives.add(tileset1);
  } catch (e) {
    console.log("Error capa 4257836", e);
  }
  if (tileset1) tileset1.style = new Cesium.Cesium3DTileStyle({ pointSize: 3.0 });

  try {
    tileset2 = await Cesium.Cesium3DTileset.fromIonAssetId(4319957);
    viewer.scene.primitives.add(tileset2);
  } catch (e) {
    console.log("Error capa 4185607", e);
  }
  try {
    tileset3 = await Cesium.Cesium3DTileset.fromIonAssetId(4188226);
    viewer.scene.primitives.add(tileset3);
  } catch (e) {
    console.log("Error capa 4188226", e);
  }

  // activar o descativar capas
  document.getElementById("toggleLayer1").addEventListener("change", e => {
    if (tileset1) tileset1.show = e.target.checked;
  });
  document.getElementById("toggleLayer2").addEventListener("change", e => {
    if (tileset2) tileset2.show = e.target.checked;
  });
  document.getElementById("toggleLayer3").addEventListener("change", e => {
    if (tileset3) tileset3.show = e.target.checked;
  });

  


  // Animacion y enfoque
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      -78.471100,
      -0.132100,
      3040
    ),
    orientation: {
      heading: Cesium.Math.toRadians(130),
      pitch: Cesium.Math.toRadians(-45)
    },
    duration: 3
  });


  // Crear hotspots
  

  const hotspotElements = [];

  hotspots.forEach(h => {
    
    if (!h.enabled) return;

    const div = document.createElement("div");
    div.className = "hotspotImg";

    const icon = document.createElement("img");
    icon.src = "img/360-grados_v2.png";
    div.appendChild(icon);

    const preview = document.createElement("div");
    preview.className = "hotspotPreview";

    const thumb = document.createElement("img");

    const tileFolder = h.thumb
      ? null
      : buildTileFolder(h.scene);

    const thumbUrl = h.thumb
      ? h.thumb
      : `marzipano/${h.scene}/app-files/tiles/${tileFolder}/1/f/0/0.jpg`;

    thumb.src = thumbUrl;
    thumb.onerror = () => preview.style.display = "none";

    preview.appendChild(thumb);
    div.appendChild(preview);

    div.onclick = () => openTour(h.scene);

    document.body.appendChild(div);

    hotspotElements.push({
      div,
      position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat, h.alt)
    });

  });


  
  // Posicion hotspot

  viewer.scene.postRender.addEventListener(() => {
    hotspotElements.forEach(h => {

      const win = Cesium.SceneTransforms.worldToWindowCoordinates(
        viewer.scene,
        h.position,
        new Cesium.Cartesian2()
      );

      if (Cesium.defined(win)) {
        h.div.style.left = `${win.x - 21}px`;
        h.div.style.top = `${win.y - 21}px`;
        h.div.style.display = "flex";
      } else {
        h.div.style.display = "none";
      }

    });
  });


  
  // Panel miniaturas
 

  const dockContent = document.getElementById("dockContent");

  hotspots.forEach(h => {

    const tileFolder = h.thumb
      ? null
      : buildTileFolder(h.scene);

    const thumbUrl = h.thumb
      ? h.thumb
      : `marzipano/${h.scene}/app-files/tiles/${tileFolder}/1/f/0/0.jpg`;

    const item = document.createElement("div");
    item.className = "dockThumb";

    const img = document.createElement("img");
    img.src = thumbUrl;

    img.onclick = () => openTour(h.scene);

    const label = document.createElement("div");
    label.className = "dockLabel";
    label.textContent = h.scene.replace(/-/g, " ");

    item.appendChild(img);
    item.appendChild(label);

    dockContent.appendChild(item);
  });


  
  // Boton panel plegable

  const dock = document.getElementById("sceneDock");
  const toggle = document.getElementById("dockToggle");

  toggle.onclick = () => {
    dock.classList.toggle("collapsed");
    toggle.textContent = dock.classList.contains("collapsed") ? "▼" : "▲";
  };

}

initCesium();
document.getElementById("tourPopupClose").onclick = closeTour;
