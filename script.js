const entry = document.querySelector('#entry-screen');
const archive = document.querySelector('#archive');
const enter = () => { entry.classList.add('is-gone'); archive.setAttribute('aria-hidden', 'false'); };
document.querySelector('#enter-site').addEventListener('click', enter);
window.addEventListener('wheel', (event) => { if (event.deltaY > 5 && !entry.classList.contains('is-gone')) enter(); }, { passive: true });
window.addEventListener('touchmove', () => { if (!entry.classList.contains('is-gone')) enter(); }, { passive: true, once: true });

const toast = document.querySelector('#place-toast');
let toastTimer;
document.querySelectorAll('[data-place]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-place]').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const target = locations.find((location) => location.name === button.dataset.place);
  if (target) rotation = -target.lon * Math.PI / 180;
  toast.textContent = `SIGNAL LOCKED: ${button.dataset.place} — FIELD NOTES COMING NEXT`;
  toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}));

const canvas = document.querySelector('#globe');
const ctx = canvas.getContext('2d');
const shell = document.querySelector('#globe-shell');
// Center the first scene on San Francisco (122.4194° W).
let rotation = 2.1366, dragging = false, lastX = 0;
const locations = [{ name: 'SAN FRANCISCO', lat: 37.7749, lon: -122.4194 }, { name: 'ROME', lat: 41.9028, lon: 12.4964 }];
function size() { const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
function point(lat, lon, r, cx, cy) { const la = lat * Math.PI / 180; const lo = lon * Math.PI / 180 + rotation; const x = Math.cos(la) * Math.sin(lo); const y = Math.sin(la); const z = Math.cos(la) * Math.cos(lo); return { x: cx + r * x, y: cy - r * y, z }; }
function draw() { const w = canvas.clientWidth, h = canvas.clientHeight, cx = w / 2, cy = h / 2, r = Math.min(w, h) * .37; ctx.clearRect(0, 0, w, h); const glow = ctx.createRadialGradient(cx, cy, r*.2, cx, cy, r*1.6); glow.addColorStop(0, 'rgba(75,185,255,.2)'); glow.addColorStop(1, 'rgba(11,37,80,0)'); ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='#061a34';ctx.fill();ctx.strokeStyle='rgba(151,222,255,.5)';ctx.lineWidth=1;ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
  for(let lat=-75;lat<=75;lat+=15){ctx.beginPath();for(let lon=-180;lon<=180;lon+=3){const p=point(lat,lon,r,cx,cy);lon===-180?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)}ctx.strokeStyle='rgba(118,208,255,.18)';ctx.stroke()}
  for(let lon=-165;lon<=180;lon+=15){ctx.beginPath();for(let lat=-90;lat<=90;lat+=3){const p=point(lat,lon,r,cx,cy);lat===-90?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)}ctx.strokeStyle='rgba(118,208,255,.18)';ctx.stroke()}
  locations.forEach(l=>{const p=point(l.lat,l.lon,r,cx,cy);if(p.z>0){ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='#8df6ff';ctx.shadowColor='#8df6ff';ctx.shadowBlur=14;ctx.fill();ctx.shadowBlur=0;ctx.font='10px DM Mono';ctx.fillText(l.name,p.x+9,p.y-9)}});ctx.restore();requestAnimationFrame(draw);}
shell.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;shell.setPointerCapture(e.pointerId)});shell.addEventListener('pointermove',e=>{if(dragging){rotation+=(e.clientX-lastX)*.012;lastX=e.clientX}});shell.addEventListener('pointerup',()=>dragging=false);window.addEventListener('resize',size);size();draw();
