const c = document.getElementById('canvas');
const ctx = c.getContext('2d');

const maxWidth = Math.min(window.innerWidth * 0.9, 800);
const maxHeight = 500;

function updateCanvasSize() {
    c.style.width = maxWidth + 'px';
    c.style.height = maxHeight + 'px';

    const dpr = window.devicePixelRatio || 1;
    c.width = maxWidth * dpr;
    c.height = maxHeight * dpr;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    draw();
}

let words = [
    { t: 'g-', x: 36, y: 1 },
    { t: 'r-', x: 18, y: 1 },
    { t: 'a-', x: 34, y: 1 },
    { t: 's-', x: 32, y: 1 },
    { t: 's-', x: 30, y: 1 },
    { t: 'h-', x: 26, y: 1 },
    { t: 'o-', x: 22, y: 1 },
    { t: 'p-', x: 20, y: 1 },
    { t: 'p-', x: 24, y: 1 },
    { t: 'e-', x: 28, y: 1 },
    { t: 'r', x: 38, y: 1 },
    { t: 'who', x: 15, y: 2 },
    { t: 'a)s', x: 2, y: 3 },
    { t: 'w(e', x: 6, y: 3 },
    { t: 'loo)k', x: 10, y: 3 },
    { t: 'up', x: 2, y: 4 },
    { t: 'now', x: 4, y: 4 },
    { t: 'gath', x: 7, y: 4 },
    { t: 'ering', x: 22, y: 6 },
    { t: 'int(o-', x: 27, y: 6 },
    { t: 'The)', x: 3, y: 7 },
    { t: 'G', x: 14, y: 5 },
    { t: 'RAS', x: 18, y: 5 },
    { t: 'S', x: 21, y: 5 },
    { t: 'H', x: 17, y: 5 },
    { t: 'O', x: 15, y: 5 },
    { t: 'PPE', x: 11, y: 5 },
    { t: 'R', x: 16, y: 5 },
    { t: ':l', x: 7, y: 7 },
    { t: 'eA', x: 9, y: 8 },
    { t: 'p:', x: 12, y: 9 },
    { t: 'S', x: 1, y: 10 },
    { t: '!', x: 11, y: 9 },
    { t: 'a', x: 2, y: 7 },
    { t: 'g', x: 19, y: 12 },
    { t: 'r', x: 21, y: 12 },
    { t: 'a', x: 23, y: 12 },
    { t: 's', x: 25, y: 12 },
    { t: 's)', x: 29, y: 12 },
    { t: 'h', x: 27, y: 12 },
    { t: 'O', x: 28, y: 12 },
    { t: 'P', x: 26, y: 12 },
    { t: 'P', x: 24, y: 12 },
    { t: 'E', x: 22, y: 12 },
    { t: 'R', x: 20, y: 12 },
    { t: 'a', x: 32, y: 10 },
    { t: '(r', x: 15, y: 11 },
    { t: 'rIvInG', x: 2, y: 12 },
    { t: ';', x: 14, y: 15 },
    { t: 'to', x: 32, y: 13 },
    { t: 'be)', x: 6, y: 14 },
    { t: 'com)', x: 14, y: 14 },
    { t: 'e)', x: 21, y: 14 },
    { t: 'rea(', x: 2, y: 14 },
    { t: 'rran(', x: 9, y: 14 },
    { t: 'gi(', x: 18, y: 14 },
    { t: 'ngl ', x: 23, y: 14 },
    { t: 'y ', x: 26, y: 14 },
    { t: ',', x: 2, y: 15 },
    { t: 'grasshopper', x: 3, y: 15 },
    { t: '.', x: 18, y: 12 },
];

const originalWords = JSON.parse(JSON.stringify(words));
let settings = {
    hSpacing: 12,
    vSpacing: 30,
    fontSize: 22,
    showCurves: true
};

function initializePositions() {
    words.forEach(w => {
        w.originalX = w.x;
        w.originalY = w.y;
        w.px = w.originalX * settings.hSpacing + 10;
        w.py = w.originalY * settings.vSpacing + 20;
    });
}

initializePositions();

let drag = -1, ox = 0, oy = 0;

const metrics = w => {
    ctx.font = `${settings.fontSize}px Consolas`;
    const m = ctx.measureText(w.t);
    return {
        wpx: m.width,
        ascent: m.actualBoundingBoxAscent ?? 12,
        descent: m.actualBoundingBoxDescent ?? 4
    };
};

function draw() {
    ctx.clearRect(0, 0, maxWidth, maxHeight);
    ctx.font = `${settings.fontSize}px Consolas`;

    words.forEach(w => {
        const m = metrics(w);
        w.wpx = m.wpx;
        w.ascent = m.ascent;
        w.descent = m.descent;
        ctx.fillStyle = '#000';
        ctx.fillText(w.t, w.px, w.py);
        w.ax = w.px + 5;
        w.ay = w.py - w.ascent - 5;
    });

    if (settings.showCurves && words.length > 1) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        for (let i = 0; i < words.length - 1; i++) {
            const a = words[i], b = words[i + 1];
            const mx = (a.ax + b.ax) / 2, my = (a.ay + b.ay) / 2;
            const h = 30;
            const cx = mx, cy = my - h;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.ax, a.ay);
            ctx.quadraticCurveTo(cx, cy, b.ax, b.ay);
            ctx.stroke();
        }
    }

    if (words.length) {
        ctx.fillStyle = 'red';
        const first = words[0], last = words[words.length - 1];
        ctx.beginPath();
        ctx.arc(first.ax, first.ay, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(last.ax, last.ay, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function hitTest(x, y) {
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const left = w.px, right = w.px + (w.wpx || 0);
        const top = w.py - (w.ascent || 12), bottom = w.py + (w.descent || 4);
        if (x >= left && x <= right && y >= top && y <= bottom) return i;
    }
    return -1;
}

function toLocal(e) {
    const r = c.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return [clientX - r.left, clientY - r.top];
}

c.addEventListener('mousedown', e => {
    const [x, y] = toLocal(e), idx = hitTest(x, y);
    if (idx !== -1) {
        drag = idx;
        ox = x - words[idx].px;
        oy = y - words[idx].py;
    }
});

c.addEventListener('mousemove', e => {
    if (drag !== -1) {
        const [x, y] = toLocal(e);
        words[drag].px = x - ox;
        words[drag].py = y - oy;
        draw();
    }
});

['mouseup', 'mouseleave'].forEach(ev =>
    c.addEventListener(ev, () => drag = -1)
);

c.addEventListener('touchstart', e => {
    e.preventDefault();
    const [x, y] = toLocal(e), idx = hitTest(x, y);
    if (idx !== -1) {
        drag = idx;
        ox = x - words[idx].px;
        oy = y - words[idx].py;
    }
});

c.addEventListener('touchmove', e => {
    e.preventDefault();
    if (drag !== -1) {
        const [x, y] = toLocal(e);
        words[drag].px = x - ox;
        words[drag].py = y - oy;
        draw();
    }
});

c.addEventListener('touchend', () => drag = -1);

document.getElementById('resetBtn').addEventListener('click', () => {
    words = JSON.parse(JSON.stringify(originalWords));
    settings.hSpacing = 12;
    settings.vSpacing = 30;
    settings.fontSize = 22;
    settings.showCurves = true;

    document.getElementById('hSpacing').value = settings.hSpacing;
    document.getElementById('vSpacing').value = settings.vSpacing;
    document.getElementById('fontSize').value = settings.fontSize;
    document.getElementById('toggleCurvesBtn').textContent = 'Hide Curves';

    initializePositions();
    draw();
});

document.getElementById('toggleCurvesBtn').addEventListener('click', () => {
    settings.showCurves = !settings.showCurves;
    document.getElementById('toggleCurvesBtn').textContent =
        settings.showCurves ? 'Hide Curves' : 'Show Curves';
    draw();
});

document.getElementById('hSpacing').addEventListener('input', (e) => {
    const newHSpacing = parseInt(e.target.value);
    
    if (settings.hSpacing !== newHSpacing) {
        const scaleFactor = newHSpacing / settings.hSpacing;
        words.forEach(w => {
            w.px = 10 + (w.px - 10) * scaleFactor;
        });
        settings.hSpacing = newHSpacing;
        draw();
    }
});

document.getElementById('vSpacing').addEventListener('input', (e) => {
    const newVSpacing = parseInt(e.target.value);
    
    if (settings.vSpacing !== newVSpacing) {
        const scaleFactor = newVSpacing / settings.vSpacing;
        words.forEach(w => {
            w.py = 20 + (w.py - 20) * scaleFactor;
        });
        settings.vSpacing = newVSpacing;
        draw();
    }
});

document.getElementById('fontSize').addEventListener('input', (e) => {
    settings.fontSize = parseInt(e.target.value);
    draw();
});

window.addEventListener('resize', updateCanvasSize);
updateCanvasSize();