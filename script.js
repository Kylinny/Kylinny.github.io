const entry = document.querySelector('#entry-screen');
const archive = document.querySelector('#archive');
const welcome = document.querySelector('.welcome');
const welcomeText = welcome.dataset.text;
let typedCharacters = 0;
function typeWelcome() {
  typedCharacters += 1;
  welcome.textContent = welcomeText.slice(0, typedCharacters);
  if (typedCharacters < welcomeText.length) setTimeout(typeWelcome, 130);
}
setTimeout(typeWelcome, 500);
const enter = () => { entry.classList.add('is-gone'); archive.setAttribute('aria-hidden', 'false'); };
document.querySelector('#enter-site').addEventListener('click', enter);
window.addEventListener('wheel', (event) => { if (event.deltaY > 5 && !entry.classList.contains('is-gone')) enter(); }, { passive: true });
window.addEventListener('touchmove', () => { if (!entry.classList.contains('is-gone')) enter(); }, { passive: true, once: true });

const canvas = document.querySelector('#globe');
const ctx = canvas.getContext('2d');
const shell = document.querySelector('#globe-shell');
const locations = [
  { name: 'SAN FRANCISCO', lat: 37.7749, lon: -122.4194 },
  { name: 'ROME', lat: 41.9028, lon: 12.4964 },
];
const stories = [
  {
    id: 'sf', name: 'SAN FRANCISCO', lat: 37.7749, lon: -122.4194,
    kicker: 'HOME BASE / NOW', body: 'Hey, I’m Junyi. Currently working at Uber in San Francisco 🌁',
    tags: ['HOME BASE', 'UBER', 'NOW'],
  },
  {
    id: 'rome', name: 'ROME', lat: 41.9028, lon: 12.4964,
    kicker: 'FIELD IMAGE / ITALY', body: 'A moment by the fountain at St. Peter’s Square — one of the first images in this growing archive.',
    image: 'assets/images/profile-rome.jpg', tags: ['ROME', 'PHOTOGRAPHY', 'ARCHIVE'],
  },
];
let rotation = 2.1366; // San Francisco faces the viewer on first load.
let dragging = false;
let lastX = 0;
let stars = [];
let cityLights = [];
let markerPositions = [];

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

function point(lat, lon, radius, cx, cy, spin = rotation) {
  const latitude = lat * Math.PI / 180;
  const longitude = lon * Math.PI / 180 + spin;
  const x = Math.cos(latitude) * Math.sin(longitude);
  const y = Math.sin(latitude);
  const z = Math.cos(latitude) * Math.cos(longitude);
  return { x: cx + radius * x, y: cy - radius * y, z };
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
  const radius = Math.max(width * .52, height * .82);
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
  const shadow = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy - radius * .3);
  shadow.addColorStop(0, 'rgba(0, 0, 0, .77)'); shadow.addColorStop(.42, 'rgba(0, 0, 0, .06)'); shadow.addColorStop(1, 'rgba(0, 4, 12, .25)');
  ctx.fillStyle = shadow; ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2); ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, radius, Math.PI * 1.03, Math.PI * 1.97);
  ctx.strokeStyle = 'rgba(132, 220, 255, .78)'; ctx.lineWidth = 2; ctx.shadowColor = '#6edbff'; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
  return { radius, cx, cy };
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
  if (!dragging) rotation += .00003;
  ctx.clearRect(0, 0, width, height); drawStars(width, height, now); drawStoryPoints(drawGlobe(width, height, now), now);
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
const storyClose = document.querySelector('#story-close');
const storyKicker = document.querySelector('#story-kicker');
const storyTitle = document.querySelector('#story-title');
const storyImage = document.querySelector('#story-image');
const storyBody = document.querySelector('#story-body');
const storyTags = document.querySelector('#story-tags');
function openStory(story) {
  storyKicker.textContent = story.kicker;
  storyTitle.textContent = story.name;
  storyBody.textContent = story.body;
  storyTags.replaceChildren(...story.tags.map((tag) => { const label = document.createElement('span'); label.textContent = tag; return label; }));
  if (story.image) { storyImage.src = story.image; storyImage.alt = `Field image from ${story.name}`; storyImage.hidden = false; }
  else { storyImage.hidden = true; storyImage.removeAttribute('src'); }
  storyCard.classList.add('open'); storyCard.setAttribute('aria-hidden', 'false');
}
function closeStory() { storyCard.classList.remove('open'); storyCard.setAttribute('aria-hidden', 'true'); }
storyClose.addEventListener('click', closeStory);

shell.addEventListener('pointerdown', (event) => { dragging = true; lastX = event.clientX; shell.setPointerCapture(event.pointerId); });
shell.addEventListener('pointermove', (event) => { if (dragging) { rotation += (event.clientX - lastX) * .008; lastX = event.clientX; } });
shell.addEventListener('pointerup', (event) => {
  const clicked = markerPositions.find((marker) => Math.hypot(marker.x - event.offsetX, marker.y - event.offsetY) < 28);
  dragging = false;
  if (clicked) openStory(clicked.story);
});
window.addEventListener('resize', resize);
resize(); draw();
