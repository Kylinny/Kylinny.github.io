const entry = document.querySelector('#entry-screen');
const archive = document.querySelector('#archive');
const welcome = document.querySelector('.welcome');
const welcomeText = welcome.dataset.text;
let typingTimer;
function typeWelcome(text) {
  clearTimeout(typingTimer);
  let typedCharacters = 0;
  welcome.textContent = '';
  const typeNextCharacter = () => {
    typedCharacters += 1;
    welcome.textContent = text.slice(0, typedCharacters);
    if (typedCharacters < text.length) typingTimer = setTimeout(typeNextCharacter, 130);
  };
  typeNextCharacter();
}
typingTimer = setTimeout(() => typeWelcome(welcomeText), 500);
const idlePromptTimer = setTimeout(() => {
  if (!entry.classList.contains('is-gone')) typeWelcome('what are you waiting for');
}, 10000);
const enter = () => {
  clearTimeout(typingTimer);
  clearTimeout(idlePromptTimer);
  entry.classList.add('is-gone');
  archive.setAttribute('aria-hidden', 'false');
  focusStory(stories.find((story) => story.id === 'sf'));
};
document.querySelector('#enter-site').addEventListener('click', enter);
window.addEventListener('wheel', (event) => { if (event.deltaY > 5 && !entry.classList.contains('is-gone')) enter(); }, { passive: true });
window.addEventListener('touchmove', () => { if (!entry.classList.contains('is-gone')) enter(); }, { passive: true, once: true });

const canvas = document.querySelector('#globe');
const ctx = canvas.getContext('2d');
const shell = document.querySelector('#globe-shell');
const EARTH_DAY_MS = 24 * 60 * 60 * 1000;
const locations = [
  { name: 'ST. LOUIS', lat: 38.627, lon: -90.1994 },
  { name: 'SAN FRANCISCO', lat: 37.7749, lon: -122.4194 },
  { name: 'ROME', lat: 41.9028, lon: 12.4964 },
];
const stories = [
  {
    id: 'stl', name: 'ST. LOUIS', country: 'USA', lat: 38.627, lon: -90.1994,
    kicker: 'FIRST DAY', timestamp: '2021.09—2024.05',
    body: 'I went to Washington University in St. Louis — no, it’s not in Seattle, nor is it in Washington. It may sound like the middle of nowhere. But we do have a pretty great monument: the Gateway Arch — and, believe it or not, it’s a NATIONAL PARK!',
    cover: 'assets/images/stl-web/stl-00-gateway-arch.jpg',
    gallery: [
      'assets/images/stl-web/stl-00-gateway-arch.jpg',
      'assets/images/stl-web/stl-00-first-day.jpg',
      'assets/images/stl-web/6A73D19B-9DAF-46A3-BA4F-8134E45D9F9C.jpg',
      'assets/images/stl-web/IMG_3578.jpg',
      'assets/images/stl-web/IMG_3802.jpg',
      'assets/images/stl-web/IMG_4221.jpg',
      'assets/images/stl-web/IMG_3184.jpg',
      'assets/images/stl-web/IMG_3209.jpg',
      'assets/images/stl-web/IMG_3242.jpg',
      'assets/images/stl-web/IMG_4088.jpg',
      'assets/images/stl-web/IMG_4398.jpg',
      'assets/images/stl-web/IMG_4419.jpg',
    ],
    captions: {
      'assets/images/stl-web/stl-00-first-day.jpg': 'My first day on campus.',
      'assets/images/stl-web/IMG_3578.jpg': 'South 40 was a dream. I lived in Nemerov.',
      'assets/images/stl-web/IMG_3802.jpg': 'If COVID had never happened, I could’ve practiced Broadway makeup on my own face instead of this mannequin.',
      'assets/images/stl-web/IMG_3242.jpg': 'Orientation Day — with my sophomore-year roommate on the right.',
      'assets/images/stl-web/IMG_4419.jpg': 'Forest Park is always the best.',
    },
    tags: ['WASHINGTON UNIVERSITY', 'MIDWEST', '桃源'],
  },
  {
    id: 'sf', name: 'SAN FRANCISCO', country: 'USA', lat: 37.7749, lon: -122.4194,
    kicker: 'HOME BASE', timestamp: '2023.05—08 · 2024.10—PRESENT', body: 'Hey, I’m Junyi. Currently working at Uber in San Francisco 🌁 And I LOVE fog',
    cover: 'assets/images/sf-00-golden-gate.jpg',
    gallery: ['assets/images/sf-web/sf-00-golden-gate.jpg', 'assets/images/sf-web/sf-01.jpg', 'assets/images/sf-web/sf-02.jpg', 'assets/images/sf-web/sf-03.jpg', 'assets/images/sf-web/sf-gallery-01.jpg', 'assets/images/sf-web/sf-gallery-02.jpg', 'assets/images/sf-web/sf-gallery-03.jpg', 'assets/images/sf-web/sf-gallery-04.jpg', 'assets/images/sf-web/sf-gallery-05.jpg', 'assets/images/sf-web/sf-gallery-06.jpg'],
    captions: {
      'assets/images/sf-web/sf-00-golden-gate.jpg': 'I took this shot while interning at PlayStation in the summer of 2023. It was my first time in the Bay Area, and I absolutely fell in love.',
      'assets/images/sf-web/sf-02.jpg': 'View from Alcatraz Island.',
      'assets/images/sf-web/sf-gallery-06.jpg': 'Sunset fishing feels surreal.',
    },
    tags: ['HOME BASE', 'UBER', 'NOW'],
  },
  {
    id: 'rome', name: 'ROME', country: 'ITALY', lat: 41.9028, lon: 12.4964,
    timestamp: '2025.09',
    cover: 'assets/images/profile-rome.jpg', gallery: ['assets/images/profile-rome.jpg', 'assets/images/rome-colosseum.jpg'],
    captions: {
      'assets/images/profile-rome.jpg': '2025 was a Jubilee Year in the Vatican. I was so lucky to be here for this once-in-every-25-years occasion.',
    },
    tags: ['PHOTOGRAPHY', 'TRAVEL', 'EUROPE'],
  },
];
let rotation = 2.1366; // San Francisco faces the viewer on first load.
let targetRotation = rotation;
let globeTilt = 0;
let targetTilt = globeTilt;
let globeZoom = 1;
let targetZoom = 1;
let dragging = false;
let lastX = 0;
let lastY = 0;
let lastRotationTimestamp = Date.now();
let stars = [];
let cityLights = [];
let markerPositions = [];
let landArcs = [];

const random = (seed) => {
  const value = Math.sin(seed * 9283.31) * 46271.41;
  return value - Math.floor(value);
};

function makeAtmosphere() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  stars = Array.from({ length: Math.max(130, Math.floor((w * h) / 6500)) }, (_, index) => ({
    x: random(index + 1) * w, y: random(index + 600) * h * .72,
    size: random(index + 1200) * 1.35 + .25, phase: random(index + 1800) * Math.PI * 2,
  }));
  const clusters = [
    [-122.4, 37.8, 42], [-118.2, 34, 28], [-74, 40.7, 40], [-87.6, 41.8, 19],
    [-0.1, 51.5, 38], [2.3, 48.8, 30], [12.5, 41.9, 25], [13.4, 52.5, 23],
    [28.9, 41, 22], [37.6, 55.7, 18], [139.7, 35.6, 42], [126.9, 37.5, 31],
    [121.5, 31.2, 38], [116.4, 39.9, 31], [77.2, 28.6, 26], [151.2, -33.9, 24],
    [-46.6, -23.5, 23], [31.2, 30, 18], [55.3, 25.2, 18], [103.8, 1.3, 20],
  ];
  cityLights = clusters.flatMap(([lon, lat, count], cluster) => Array.from({ length: count }, (_, index) => ({
    lat: lat + (random(cluster * 200 + index) - .5) * 7,
    lon: lon + (random(cluster * 400 + index) - .5) * 10,
    size: random(cluster * 700 + index) * 1.45 + .32,
    phase: random(cluster * 900 + index) * Math.PI * 2,
  })));
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  makeAtmosphere();
}

function point(lat, lon, radius, cx, cy, spin = rotation, tilt = globeTilt) {
  const latitude = lat * Math.PI / 180;
  const longitude = lon * Math.PI / 180 + spin;
  const x = Math.cos(latitude) * Math.sin(longitude);
  const y = Math.sin(latitude);
  const z = Math.cos(latitude) * Math.cos(longitude);
  const tiltedY = y * Math.cos(tilt) - z * Math.sin(tilt);
  const tiltedZ = y * Math.sin(tilt) + z * Math.cos(tilt);
  return { x: cx + radius * x, y: cy - radius * tiltedY, z: tiltedZ };
}

async function loadLandContours() {
  try {
    const topology = await fetch('assets/data/land-110m.json').then((response) => response.json());
    const scale = topology.transform.scale;
    const translate = topology.transform.translate;
    const decodeArc = (arcIndex) => {
      const source = topology.arcs[arcIndex < 0 ? -arcIndex - 1 : arcIndex];
      let x = 0; let y = 0;
      const coordinates = source.map(([deltaX, deltaY]) => {
        x += deltaX; y += deltaY;
        return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
      });
      return arcIndex < 0 ? coordinates.reverse() : coordinates;
    };
    const collectArcs = (geometry) => {
      if (geometry.type === 'GeometryCollection') return geometry.geometries.flatMap(collectArcs);
      return geometry.arcs.flat(Infinity);
    };
    landArcs = [...new Set(collectArcs(topology.objects.land))].map(decodeArc);
  } catch {
    // The night globe remains usable if the optional local outline data is unavailable.
  }
}

function drawStars(width, height, now) {
  const nebula = ctx.createRadialGradient(width * .72, height * .08, 0, width * .72, height * .08, width * .55);
  nebula.addColorStop(0, 'rgba(43, 84, 182, .26)'); nebula.addColorStop(.4, 'rgba(17, 42, 105, .1)'); nebula.addColorStop(1, 'rgba(3, 8, 21, 0)');
  ctx.fillStyle = nebula; ctx.fillRect(0, 0, width, height);
  stars.forEach((star) => {
    const alpha = .22 + (Math.sin(now * .0012 + star.phase) + 1) * .2;
    ctx.fillStyle = `rgba(194, 224, 255, ${alpha})`;
    ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
  });
}

function drawGlobe(width, height, now) {
  const radius = Math.max(width * .52, height * .82) * globeZoom;
  const cx = width * .58;
  const cy = height * 1.08;
  const glow = ctx.createRadialGradient(cx, cy - radius * .88, radius * .1, cx, cy - radius * .88, radius * 1.25);
  glow.addColorStop(0, 'rgba(92, 180, 255, .24)'); glow.addColorStop(.32, 'rgba(28, 93, 174, .11)'); glow.addColorStop(1, 'rgba(2, 8, 18, 0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
  const ocean = ctx.createRadialGradient(cx - radius * .16, cy - radius * .72, radius * .05, cx, cy, radius * 1.1);
  ocean.addColorStop(0, '#163d71'); ocean.addColorStop(.44, '#081c3b'); ocean.addColorStop(1, '#01040a');
  ctx.fillStyle = ocean; ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  cityLights.forEach((light) => {
    const p = point(light.lat, light.lon, radius, cx, cy);
    if (p.z < -.04) return;
    const brightness = Math.max(0, p.z) * (.45 + (Math.sin(now * .0018 + light.phase) + 1) * .25);
    ctx.fillStyle = `rgba(255, 230, 166, ${brightness})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, light.size + brightness, 0, Math.PI * 2); ctx.fill();
  });
  ctx.strokeStyle = 'rgba(162, 215, 243, .52)';
  ctx.lineWidth = .65;
  landArcs.forEach((arc) => {
    let connected = false;
    ctx.beginPath();
    arc.forEach(([lon, lat]) => {
      const p = point(lat, lon, radius, cx, cy);
      if (p.z < -.02) { connected = false; return; }
      if (!connected) { ctx.moveTo(p.x, p.y); connected = true; }
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  });
  const shadow = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy - radius * .3);
  shadow.addColorStop(0, 'rgba(0, 0, 0, .77)'); shadow.addColorStop(.42, 'rgba(0, 0, 0, .06)'); shadow.addColorStop(1, 'rgba(0, 4, 12, .25)');
  ctx.fillStyle = shadow; ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2); ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, radius, Math.PI * 1.03, Math.PI * 1.97);
  ctx.strokeStyle = 'rgba(132, 220, 255, .78)'; ctx.lineWidth = 2; ctx.shadowColor = '#6edbff'; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
  return { radius, cx, cy };
}

function drawCurvedText(text, cx, cy, radius, centerAngle) {
  const tracking = 1.15;
  const characters = [...text];
  const widths = characters.map((character) => ctx.measureText(character).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + tracking * (characters.length - 1);
  let offset = -totalWidth / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  characters.forEach((character, index) => {
    const width = widths[index];
    const angle = centerAngle + (offset + width / 2) / radius;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(character, 0, 0);
    ctx.restore();
    offset += width + tracking;
  });
}

function drawAtmosphericGlint(planet, now) {
  const phase = (now / 48000) * Math.PI * 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(planet.cx, planet.cy, planet.radius + 4, phase - .31, phase + .31);
  ctx.strokeStyle = 'rgba(201, 248, 255, .76)';
  ctx.lineWidth = 1.3;
  ctx.shadowColor = '#7eeeff';
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(202, 248, 255, .78)';
  ctx.font = '8px "DM Mono", monospace';
  drawCurvedText('THIS IS A LIVING EARTH, ROTATING AT ITS REAL-WORLD PACE.', planet.cx, planet.cy, planet.radius + 21, phase);
  ctx.restore();
}

function drawStoryPoints(planet, now) {
  markerPositions = [];
  stories.forEach((story, index) => {
    const marker = point(story.lat, story.lon, planet.radius, planet.cx, planet.cy);
    if (marker.z < 0) return;
    const lift = 72 + Math.sin(now * .0022 + index) * 7;
    const labelY = marker.y - lift;
    ctx.strokeStyle = 'rgba(140, 242, 255, .72)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(marker.x, marker.y); ctx.lineTo(marker.x, labelY + 8); ctx.stroke(); ctx.setLineDash([]);
    const pulse = 4 + (Math.sin(now * .003 + index) + 1) * 2;
    ctx.beginPath(); ctx.arc(marker.x, marker.y, pulse, 0, Math.PI * 2);
    ctx.fillStyle = '#b8fbff'; ctx.shadowColor = '#76efff'; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#b9f6ff'; ctx.font = '10px "DM Mono", monospace'; ctx.fillText(story.name, marker.x + 12, labelY + 4);
    ctx.fillStyle = 'rgba(185, 246, 255, .65)'; ctx.font = '8px "DM Mono", monospace'; ctx.fillText('OPEN NOTE', marker.x + 12, labelY + 18);
    markerPositions.push({ story, x: marker.x, y: marker.y });
  });
}

function draw(now = 0) {
  const width = canvas.clientWidth; const height = canvas.clientHeight;
  const timestamp = Date.now();
  const automaticStep = ((timestamp - lastRotationTimestamp) / EARTH_DAY_MS) * Math.PI * 2;
  lastRotationTimestamp = timestamp;
  if (!dragging) {
    const rotationDifference = targetRotation - rotation;
    if (Math.abs(rotationDifference) > .0003) rotation += rotationDifference * .028;
    else { rotation += automaticStep; targetRotation = rotation; }
    globeTilt += (targetTilt - globeTilt) * .05;
  }
  globeZoom += (targetZoom - globeZoom) * .035;
  ctx.clearRect(0, 0, width, height);
  drawStars(width, height, now);
  const planet = drawGlobe(width, height, now);
  drawAtmosphericGlint(planet, now);
  drawStoryPoints(planet, now);
  requestAnimationFrame(draw);
}

const toast = document.querySelector('#place-toast');
let toastTimer;
document.querySelectorAll('[data-place]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-place]').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const target = locations.find((location) => location.name === button.dataset.place);
  if (target) rotation = -target.lon * Math.PI / 180;
  toast.textContent = `OPENING: ${button.dataset.place} — FIELD NOTES COMING NEXT`;
  toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}));

const storyCard = document.querySelector('#story-card');
const storyKicker = document.querySelector('#story-kicker');
const storyTitle = document.querySelector('#story-title');
const storyImage = document.querySelector('#story-image');
const storyImageFrame = document.querySelector('#story-image-frame');
const storyBody = document.querySelector('#story-body');
const storyTags = document.querySelector('#story-tags');
const moreButton = document.querySelector('#more-button');
const galleryView = document.querySelector('#gallery-view');
const galleryBack = document.querySelector('#gallery-back');
const galleryKicker = document.querySelector('#gallery-kicker');
const galleryTitle = document.querySelector('#gallery-title');
const galleryGrid = document.querySelector('#gallery-grid');
let activeStory;
function showStoryImage(story) {
  storyImage.classList.add('is-dissolving');
  setTimeout(() => {
    storyImage.src = story.cover;
    storyImage.alt = `Cover image from ${story.name}`;
    storyImageFrame.hidden = false;
    requestAnimationFrame(() => storyImage.classList.remove('is-dissolving'));
  }, 360);
}
function openStory(story) {
  activeStory = story;
  storyKicker.textContent = [story.country, story.timestamp].filter(Boolean).join(' / ');
  storyTitle.textContent = story.name;
  storyBody.textContent = story.body || '';
  storyBody.hidden = !story.body;
  moreButton.hidden = !story.gallery?.length;
  storyTags.replaceChildren(...story.tags.map((tag) => { const label = document.createElement('span'); label.textContent = tag; return label; }));
  if (story.cover) showStoryImage(story);
  else { storyImageFrame.hidden = true; storyImage.removeAttribute('src'); }
  storyCard.classList.add('open'); storyCard.setAttribute('aria-hidden', 'false');
  document.querySelector('.hero').classList.add('story-open');
  document.querySelectorAll('.timeline-item').forEach((item) => item.classList.toggle('active', item.dataset.story === story.id));
}
function openGallery() {
  if (!activeStory?.gallery?.length) return;
  galleryKicker.textContent = `${activeStory.country} / ${activeStory.timestamp || ''}`;
  galleryTitle.textContent = activeStory.name;
  galleryGrid.replaceChildren(...activeStory.gallery.map((source, index) => {
    const caption = activeStory.captions?.[source];
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';
    const image = document.createElement('img');
    image.alt = `${activeStory.name} gallery image ${index + 1}`;
    image.src = source;
    figure.append(image);
    if (caption) {
      const text = document.createElement('figcaption');
      text.textContent = caption;
      figure.classList.add('has-caption');
      figure.tabIndex = 0;
      figure.append(text);
      figure.addEventListener('click', () => figure.classList.toggle('caption-open'));
    }
    return figure;
  }));
  storyCard.classList.remove('open');
  galleryView.classList.add('open'); galleryView.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-open');
}
function closeGallery() {
  galleryView.classList.remove('open'); galleryView.setAttribute('aria-hidden', 'true');
  galleryView.classList.remove('is-scrolled'); galleryView.scrollTop = 0;
  document.body.classList.remove('gallery-open');
  if (activeStory) storyCard.classList.add('open');
}
moreButton.addEventListener('click', openGallery);
galleryBack.addEventListener('click', closeGallery);
galleryView.addEventListener('scroll', () => galleryView.classList.toggle('is-scrolled', galleryView.scrollTop > 48), { passive: true });
function focusStory(story) {
  const desiredRotation = -story.lon * Math.PI / 180;
  targetRotation = rotation + Math.atan2(Math.sin(desiredRotation - rotation), Math.cos(desiredRotation - rotation));
  targetTilt = 0;
  targetZoom = 1.2;
  openStory(story);
}
function closeStory() { targetZoom = 1; storyCard.classList.remove('open'); storyCard.setAttribute('aria-hidden', 'true'); document.querySelector('.hero').classList.remove('story-open'); }
document.querySelectorAll('.timeline-item').forEach((item) => item.addEventListener('click', () => {
  const story = stories.find((candidate) => candidate.id === item.dataset.story);
  if (story) focusStory(story);
}));

shell.addEventListener('pointerdown', (event) => { dragging = true; lastX = event.clientX; lastY = event.clientY; shell.setPointerCapture(event.pointerId); });
shell.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  rotation += (event.clientX - lastX) * .008;
  globeTilt = Math.max(-1.05, Math.min(1.05, globeTilt + (event.clientY - lastY) * .006));
  targetRotation = rotation;
  targetTilt = globeTilt;
  lastX = event.clientX;
  lastY = event.clientY;
});
shell.addEventListener('pointerup', (event) => {
  const clicked = markerPositions.find((marker) => Math.hypot(marker.x - event.offsetX, marker.y - event.offsetY) < 28);
  dragging = false;
  if (clicked) focusStory(clicked.story);
});
document.addEventListener('pointerdown', (event) => {
  if (!storyCard.classList.contains('open') || storyCard.contains(event.target) || event.target.closest('.timeline-item')) return;
  if (event.target === canvas) {
    const hitMarker = markerPositions.some((marker) => Math.hypot(marker.x - event.offsetX, marker.y - event.offsetY) < 28);
    if (hitMarker) return;
  }
  closeStory();
});
window.addEventListener('resize', resize);
resize(); draw();
loadLandContours();
