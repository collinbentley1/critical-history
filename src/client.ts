import type { Camera, Location } from "./locations";
import { isSafeExternalHref, renderMarkdownInto } from "./markdown";

type Mapbox = typeof import("mapbox-gl").default;
type MapboxMap = import("mapbox-gl").Map;

type AppConfig = {
  readonly mapboxAccessToken: string;
  readonly mapStyle: string;
  readonly typeformUrl: string;
};

const overviewCamera: Camera = {
  bearing: 0,
  center: [-72.92889674697767, 41.311363185264725],
  pitch: 0,
  speed: 0.3,
  zoom: 14.66,
};

let appLocations: readonly Location[] = [];

const state = {
  config: undefined as AppConfig | undefined,
  guided: false,
  map: undefined as MapboxMap | undefined,
  mapbox: undefined as Mapbox | undefined,
  selectedLocation: undefined as Location | undefined,
};

const elements = {
  aboutClose: element<HTMLButtonElement>("about-close"),
  aboutContent: element<HTMLElement>("about-content"),
  aboutDialog: element<HTMLDialogElement>("about-dialog"),
  aboutPrivacy: element<HTMLButtonElement>("about-privacy"),
  aboutTitle: element<HTMLElement>("about-title"),
  contact: element<HTMLButtonElement>("contact"),
  detail: element<HTMLElement>("location-detail"),
  guidedToggle: element<HTMLButtonElement>("guided-toggle"),
  introClose: element<HTMLButtonElement>("intro-close"),
  introGuided: element<HTMLButtonElement>("intro-guided"),
  introOverlay: element<HTMLElement>("intro-overlay"),
  list: element<HTMLElement>("location-list"),
  map: element<HTMLElement>("map"),
  mapStatus: element<HTMLElement>("map-status"),
  modeLabel: element<HTMLElement>("mode-label"),
  navAbout: element<HTMLButtonElement>("nav-about"),
  newLocation: element<HTMLButtonElement>("new-location"),
  next: element<HTMLButtonElement>("next-location"),
  previous: element<HTMLButtonElement>("previous-location"),
};

void boot();

async function boot(): Promise<void> {
  const [config, loadedLocations] = await Promise.all([fetchConfig(), fetchLocations()]);
  appLocations = loadedLocations;
  state.config = config;
  state.selectedLocation = getInitialLocation(loadedLocations);

  renderLocationList();
  renderSelectedLocation();
  bindControls();
  await setupMap(config);

  if (window.location.pathname === "/privacy") {
    await openAbout("privacy");
  }
}

async function fetchLocations(): Promise<readonly Location[]> {
  const response = await fetch("/api/locations", { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`locations request failed: ${response.status}`);
  }

  return (await response.json()) as readonly Location[];
}

async function fetchConfig(): Promise<AppConfig> {
  const response = await fetch("/api/config", { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`config request failed: ${response.status}`);
  }

  return (await response.json()) as AppConfig;
}

function bindControls(): void {
  elements.introClose.addEventListener("click", () => {
    setGuided(false);
    closeIntro();
  });

  elements.introGuided.addEventListener("click", () => {
    setGuided(true);
    closeIntro();
  });

  elements.guidedToggle.addEventListener("click", () => setGuided(!state.guided));
  elements.previous.addEventListener("click", () => selectRelativeLocation(-1));
  elements.next.addEventListener("click", () => selectRelativeLocation(1));
  elements.navAbout.addEventListener("click", () => void openAbout("about"));
  elements.aboutPrivacy.addEventListener("click", () => void openAbout(elements.aboutPrivacy.dataset.view === "privacy" ? "about" : "privacy"));
  elements.aboutClose.addEventListener("click", () => closeAbout());
  elements.aboutDialog.addEventListener("close", () => {
    if (window.location.pathname === "/privacy") {
      history.replaceState(null, "", "/");
    }
  });

  elements.newLocation.addEventListener("click", openTypeform);
  elements.contact.addEventListener("click", openTypeform);
}

function closeIntro(): void {
  elements.introOverlay.hidden = true;
}

async function openAbout(view: "about" | "privacy"): Promise<void> {
  elements.aboutPrivacy.dataset.view = view;

  if (view === "privacy") {
    elements.aboutTitle.textContent = "Privacy";
    elements.aboutPrivacy.textContent = "About";
    const response = await fetch("/privacy.md", { headers: { Accept: "text/markdown" } });
    renderMarkdownInto(elements.aboutContent, response.ok ? await response.text() : "Privacy policy unavailable.");
    if (window.location.pathname !== "/privacy") {
      history.pushState(null, "", "/privacy");
    }
  } else {
    elements.aboutTitle.textContent = "About";
    elements.aboutPrivacy.textContent = "Privacy Policy";
    renderMarkdownInto(
      elements.aboutContent,
      "Yale University's namesake is Elihu Yale, a slave trader and governor of the British East India Company responsible for over a century of colonial rule in India.\n\nThis Critical History Map was developed to think about how Yale's history as a colonial institution remains embedded in its architecture and landscape in the present day, and to highlight sites where Yale students and New Haven residents changed the course of the university's history through remarkable moments of struggle.",
    );
    if (window.location.pathname === "/privacy") {
      history.replaceState(null, "", "/");
    }
  }

  if (!elements.aboutDialog.open) {
    elements.aboutDialog.showModal();
  }
}

function closeAbout(): void {
  elements.aboutDialog.close();
}

function openTypeform(): void {
  const url = state.config?.typeformUrl;
  if (!url || !isSafeExternalHref(url)) {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function renderLocationList(): void {
  const fragment = document.createDocumentFragment();

  for (const location of appLocations) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "location-item";
    button.dataset.locationId = String(location.id);
    button.addEventListener("click", () => {
      selectLocation(location);
      setGuided(true);
    });

    const title = document.createElement("span");
    title.className = "location-item-title";
    title.textContent = location.title;

    const index = document.createElement("span");
    index.className = "location-item-index";
    index.textContent = String(location.id + 1).padStart(2, "0");

    button.append(index, title);
    fragment.append(button);
  }

  elements.list.replaceChildren(fragment);
  syncActiveLocation();
}

function renderSelectedLocation(): void {
  const location = getSelectedLocation();
  const article = document.createElement("article");
  article.className = "location-article";

  const imageFrame = document.createElement("figure");
  imageFrame.className = "location-image";

  const image = document.createElement("img");
  image.src = location.image;
  image.alt = location.imageAlt || location.title;
  image.loading = "eager";

  const caption = document.createElement("figcaption");
  caption.textContent = location.imageCredit ? `Image: ${location.imageCredit}` : "";

  imageFrame.append(image, caption);

  const heading = document.createElement("div");
  heading.className = "location-heading";

  const counter = document.createElement("span");
  counter.className = "location-counter";
  counter.textContent = `${location.id + 1}/${appLocations.length}`;

  const title = document.createElement("h2");
  title.textContent = location.title;

  heading.append(counter, title);

  const body = document.createElement("div");
  body.className = "location-copy";
  renderMarkdownInto(body, location.text);

  article.append(imageFrame, heading, body);
  elements.detail.replaceChildren(article);
  syncActiveLocation();
}

function selectLocation(location: Location): void {
  state.selectedLocation = location;
  renderSelectedLocation();
  flyTo(cameraForLocation(location));
}

function selectRelativeLocation(offset: number): void {
  const currentIndex = appLocations.findIndex((location) => location.id === getSelectedLocation().id);
  const nextIndex = (currentIndex + offset + appLocations.length) % appLocations.length;
  const nextLocation = appLocations[nextIndex];
  if (nextLocation) {
    selectLocation(nextLocation);
    setGuided(true);
  }
}

function setGuided(next: boolean): void {
  state.guided = next;
  document.body.dataset.mode = next ? "guided" : "explore";
  elements.modeLabel.textContent = next ? "Guided Tour" : "Explore";
  elements.guidedToggle.textContent = next ? "Explore" : "Guided Tour";

  if (next) {
    flyTo(cameraForLocation(getSelectedLocation()));
  } else {
    flyTo(overviewCamera);
  }
}

function syncActiveLocation(): void {
  const id = String(getSelectedLocation().id);
  for (const button of elements.list.querySelectorAll<HTMLButtonElement>(".location-item")) {
    button.toggleAttribute("aria-current", button.dataset.locationId === id);
  }
}

async function setupMap(config: AppConfig): Promise<void> {
  if (!config.mapboxAccessToken) {
    showMapStatus("Mapbox access token is not configured.");
    return;
  }

  try {
    const mapbox = (await import("mapbox-gl")).default;
    mapbox.accessToken = config.mapboxAccessToken;
    state.mapbox = mapbox;

    state.map = new mapbox.Map({
      attributionControl: true,
      bearing: overviewCamera.bearing,
      center: asMutableCoordinates(overviewCamera.center),
      container: elements.map,
      pitch: overviewCamera.pitch,
      style: config.mapStyle,
      zoom: overviewCamera.zoom,
    });

    state.map.addControl(new mapbox.NavigationControl({ showCompass: true, showZoom: true }), "top-left");

    await new Promise<void>((resolve, reject) => {
      state.map?.once("load", () => resolve());
      state.map?.once("error", (event) => reject(event.error));
    });

    for (const location of appLocations) {
      addMarker(location);
    }
  } catch (error) {
    console.error(error);
    showMapStatus("Map unavailable.");
  }
}

function addMarker(location: Location): void {
  if (!state.map || !state.mapbox) {
    return;
  }

  const marker = document.createElement("button");
  marker.type = "button";
  marker.className = "map-marker";
  marker.ariaLabel = location.title;
  marker.addEventListener("click", () => {
    selectLocation(location);
    setGuided(true);
  });

  new state.mapbox.Marker({ anchor: "bottom", element: marker })
    .setLngLat(asMutableCoordinates(location.marker))
    .setPopup(new state.mapbox.Popup({ offset: 24 }).setText(location.title))
    .addTo(state.map);
}

function flyTo(camera: Camera): void {
  state.map?.flyTo({
    bearing: camera.bearing,
    center: asMutableCoordinates(camera.center),
    essential: true,
    pitch: camera.pitch,
    speed: camera.speed,
    zoom: camera.zoom,
  });
}

function showMapStatus(message: string): void {
  elements.mapStatus.textContent = message;
  elements.mapStatus.hidden = false;
}

function asMutableCoordinates(coordinates: readonly [number, number]): [number, number] {
  return [coordinates[0], coordinates[1]];
}

function cameraForLocation(location: Location): Camera {
  return {
    bearing: location.bearing,
    center: location.center,
    pitch: location.pitch,
    speed: location.speed,
    zoom: location.zoom,
  };
}

function getInitialLocation(values: readonly Location[]): Location {
  const location = values[0];
  if (!location) {
    throw new Error("No locations configured.");
  }

  return location;
}

function getSelectedLocation(): Location {
  if (!state.selectedLocation) {
    throw new Error("No selected location.");
  }

  return state.selectedLocation;
}

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) {
    throw new Error(`Missing #${id}`);
  }

  return found as T;
}
