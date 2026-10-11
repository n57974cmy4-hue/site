/* Awrabaya — door intro.
   A riad door in a stone arch. The visitor takes the brass key: it flies to the lock,
   plunges in, turns, the two carved leaves swing open on a dressing full of light, and
   the camera walks through into the site. Skippable, keyboard friendly, and reduced to
   a simple fade when the visitor prefers less motion. */
(function () {
    'use strict';
    var root = document.getElementById('intro');
    if (!root) return;
    var G = window.AwrabayaGarments;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------------------------------------------------------------- geometry
    // Pointed arch through (x0, spring) and (x1, spring) with its apex at (mid, apex).
    function archPath(x0, x1, spring, apex, bottom) {
        var half = (x1 - x0) / 2, h = spring - apex, d = (h * h - half * half) / (2 * half), r = half + d;
        var mid = x0 + half;
        return 'M' + x0 + ' ' + bottom + 'V' + spring + 'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + mid + ' ' + apex +
            'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + x1 + ' ' + spring + 'V' + bottom + 'Z';
    }
    var DOOR = archPath(0, 400, 260, 0, 600);           // the opening, 400 x 600
    var INSET = archPath(22, 378, 268, 26, 600);
    var PANEL_TOP = archPath(44, 356, 280, 64, 600);

    function studs(xs, y0, y1, step) {
        var out = '';
        xs.forEach(function (x) {
            for (var y = y0; y <= y1; y += step) {
                out += '<circle cx="' + x + '" cy="' + y + '" r="4.2" fill="url(#awrBrass)"/>' +
                    '<circle cx="' + (x - 1.2) + '" cy="' + (y - 1.3) + '" r="1.4" fill="#fff6dc" opacity=".8"/>';
            }
        });
        return out;
    }
    function panel(x, y, w, h) {
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="#6f5545"/>' +
            '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="url(#awrStars)"/>' +
            '<rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (w - 3) + '" height="' + (h - 3) + '" rx="2" fill="none" stroke="#3e2e24" stroke-width="3"/>' +
            '<rect x="' + (x - 2) + '" y="' + (y - 2) + '" width="' + (w + 4) + '" height="' + (h + 4) + '" rx="4" fill="none" stroke="#b79478" stroke-opacity=".55" stroke-width="1.4"/>';
    }

    var defs =
        '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
        '<linearGradient id="awrWoodDoor" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#94755f"/><stop offset=".55" stop-color="#7a5e4c"/><stop offset="1" stop-color="#644b3c"/></linearGradient>' +
        '<linearGradient id="awrBrass" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#f3dda4"/><stop offset=".45" stop-color="#c9a05a"/><stop offset="1" stop-color="#8d6a33"/></linearGradient>' +
        '<linearGradient id="awrStone" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#ece1d0"/><stop offset="1" stop-color="#d4c2a8"/></linearGradient>' +
        '<radialGradient id="awrLight" cx=".5" cy=".42" r=".75">' +
        '<stop offset="0" stop-color="#fffdf7"/><stop offset=".55" stop-color="#f7ecdc"/><stop offset="1" stop-color="#e6d3ba"/></radialGradient>' +
        '<pattern id="awrStars" width="34" height="34" patternUnits="userSpaceOnUse">' +
        '<path d="M9 9H25V25H9ZM17 5.7 28.3 17 17 28.3 5.7 17Z" fill="none" stroke="#c7a689" stroke-opacity=".55" stroke-width="1"/>' +
        '<circle cx="17" cy="17" r="2.2" fill="#4b382c"/></pattern>' +
        '<pattern id="awrZellige" width="26" height="26" patternUnits="userSpaceOnUse">' +
        '<rect width="26" height="26" fill="#d9c6ab"/><path d="M13 2 24 13 13 24 2 13Z" fill="#c4ab8b"/>' +
        '<circle cx="13" cy="13" r="3.4" fill="#ede2d0"/></pattern>' +
        '<clipPath id="awrDoorClip"><path d="' + DOOR + '"/></clipPath>' +
        '<clipPath id="awrPanelClip"><path d="' + PANEL_TOP + '"/></clipPath>' +
        '<symbol id="awrDoorFace" viewBox="0 0 400 600"><g clip-path="url(#awrDoorClip)">' +
        '<rect width="400" height="600" fill="url(#awrWoodDoor)"/>' +
        '<path d="' + INSET + '" fill="none" stroke="#3e2e24" stroke-width="3"/>' +
        '<path d="' + INSET + '" fill="none" stroke="#b79478" stroke-opacity=".5" stroke-width="1.2" transform="translate(1.5 1.5)"/>' +
        '<g clip-path="url(#awrPanelClip)">' + panel(44, 40, 138, 236) + panel(218, 40, 138, 236) + '</g>' +
        panel(44, 300, 138, 250) + panel(218, 300, 138, 250) +
        studs([24, 376], 300, 580, 40) + studs([190, 210], 70, 580, 44) +
        '<path d="M200 0V600" stroke="#33251d" stroke-width="3.5"/><path d="M201.8 0V600" stroke="#b79478" stroke-opacity=".45" stroke-width="1"/>' +
        // ring knockers
        '<circle cx="113" cy="318" r="19" fill="none" stroke="url(#awrBrass)" stroke-width="5"/><circle cx="113" cy="296" r="6" fill="url(#awrBrass)"/>' +
        '<circle cx="287" cy="318" r="19" fill="none" stroke="url(#awrBrass)" stroke-width="5"/><circle cx="287" cy="296" r="6" fill="url(#awrBrass)"/>' +
        // lock plate on the right leaf, with its keyhole
        '<g class="intro-lock"><rect x="221" y="352" width="34" height="92" rx="12" fill="url(#awrBrass)"/>' +
        '<rect x="224" y="355" width="28" height="86" rx="10" fill="none" stroke="#7d5c2b" stroke-opacity=".6"/>' +
        '<circle cx="238" cy="390" r="5.6" fill="#24180f"/><path d="M234.6 392 233 410H243L241.4 392Z" fill="#24180f"/></g>' +
        '</g></symbol>' +
        '<symbol id="awrKey" viewBox="0 0 60 154">' +
        '<circle cx="30" cy="26" r="20" fill="none" stroke="url(#awrBrass)" stroke-width="7"/>' +
        '<path d="M30 12 34 22 44 26 34 30 30 40 26 30 16 26 26 22Z" fill="url(#awrBrass)"/>' +
        '<rect x="26" y="44" width="8" height="110" rx="3" fill="url(#awrBrass)"/>' +
        '<rect x="24" y="46" width="12" height="7" rx="2" fill="url(#awrBrass)"/>' +
        '<path d="M34 118H50V126H44V132H50V142H34Z" fill="url(#awrBrass)"/>' +
        '<path d="M28.5 46V150" stroke="#fff4d2" stroke-opacity=".7" stroke-width="1.2"/></symbol>' +
        '</defs></svg>';

    // Inside the riad: warm light and a rail of pieces waiting on their hangers.
    function interior() {
        var pieces = [['abaya', '#2c2420', -3], ['kimono', '#b08453', 2], ['robe', '#8a8f74', -1.5],
                      ['papillon', '#d4a5a0', 2.5], ['kaftan', '#2f5b4c', -2]];
        var out = '<svg class="intro-inside" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">' +
            '<g clip-path="url(#awrDoorClip)"><rect width="400" height="600" fill="url(#awrLight)"/>' +
            '<path d="M120 0 60 600H340L280 0Z" fill="#fff" opacity=".35"/>' +
            '<rect y="520" width="400" height="80" fill="#e4d2b9"/>' +
            '<ellipse cx="200" cy="540" rx="170" ry="16" fill="#b89c7e" opacity=".35"/>' +
            '<path d="M36 186H364" stroke="url(#awrBrass)" stroke-width="5" stroke-linecap="round"/>';
        pieces.forEach(function (p, i) {
            var x = 30 + i * 68, w = 80, h = 172;
            var g = G.svg(p[0], p[1], { decorative: true })
                .replace('<svg class="garment"', '<svg x="' + x + '" y="176" width="' + w + '" height="' + h * 2 + '"');
            out += '<g transform="rotate(' + p[2] + ' ' + (x + w / 2) + ' 186)">' + g + '</g>';
        });
        return out + '</g></svg>';
    }

    function frame() {
        var outer = archPath(-46, 446, 250, -54, 640);
        return '<svg class="intro-frame" viewBox="-60 -60 520 700" aria-hidden="true">' +
            '<path d="' + outer + ' ' + DOOR.replace(/V600Z$/, 'V600Z') + '" fill="url(#awrStone)" fill-rule="evenodd"/>' +
            '<path d="' + archPath(-24, 424, 256, -28, 640) + '" fill="none" stroke="#b9a184" stroke-width="1.6"/>' +
            '<path d="' + archPath(-30, 430, 254, -36, 640) + '" fill="none" stroke="#fff8ec" stroke-opacity=".7" stroke-width="1"/>' +
            '<path d="' + DOOR + '" fill="none" stroke="#9e8468" stroke-width="2.4"/>' +
            '<rect x="-60" y="600" width="520" height="40" fill="url(#awrZellige)"/>' +
            '<rect x="-60" y="600" width="520" height="3" fill="#a88f71" opacity=".7"/>' +
            '</svg>';
    }

    var brandMark = document.querySelector('.brand-mark svg');
    root.innerHTML = defs +
        '<div class="intro-wall" aria-hidden="true"></div>' +
        '<div class="intro-glow" aria-hidden="true"></div>' +
        '<header class="intro-head">' +
        '<span class="intro-brand" aria-hidden="true">' + (brandMark ? brandMark.outerHTML : 'AWRABAYA') + '</span>' +
        '<span class="intro-tagline">Ma pudeur, mon trésor</span></header>' +
        '<div class="intro-stage">' +
        '<div class="intro-door">' +
        interior() +
        '<div class="intro-leaves">' +
        '<div class="intro-leaf intro-leaf-left"><svg viewBox="0 0 200 600" preserveAspectRatio="none" aria-hidden="true"><use href="#awrDoorFace" width="400" height="600"/></svg></div>' +
        '<div class="intro-leaf intro-leaf-right"><svg viewBox="200 0 200 600" preserveAspectRatio="none" aria-hidden="true"><use href="#awrDoorFace" width="400" height="600"/></svg></div>' +
        '</div>' +
        frame() +
        '<button type="button" class="intro-key" aria-label="Tourner la clé et entrer">' +
        '<svg viewBox="0 0 60 154" aria-hidden="true"><use href="#awrKey" width="60" height="154"/></svg></button>' +
        '<span class="intro-flash" aria-hidden="true"></span>' +
        '</div></div>' +
        '<p class="intro-hint"><span class="intro-hint-dot" aria-hidden="true"></span>Touchez la clé pour entrer</p>' +
        '<button type="button" class="intro-skip">Passer l\'intro</button>' +
        '<p class="intro-wait" aria-live="polite"></p>';

    document.documentElement.classList.add('intro-open');
    document.body.classList.add('stage-paused');

    // Keep the opened leaves inside the doorway: clip their container to the arch.
    (function clipLeaves() {
        var pts = [], half = 200, h = 260, d = (h * h - half * half) / (2 * half), r = half + d;
        var pct = function (x, y) { return (x / 4).toFixed(2) + '% ' + (y / 6).toFixed(2) + '%'; };
        pts.push(pct(0, 600), pct(0, 260));
        var a0 = Math.PI, a1 = Math.PI - Math.atan2(h, d);
        for (var k = 1; k <= 24; k++) {
            var a = a0 + (a1 - a0) * k / 24;
            pts.push(pct(200 + d + r * Math.cos(a), 260 - r * Math.sin(a)));
        }
        for (var j = 23; j >= 0; j--) {
            var b = a0 + (a1 - a0) * j / 24;
            pts.push(pct(400 - (200 + d + r * Math.cos(b)), 260 - r * Math.sin(b)));
        }
        pts.push(pct(400, 600));
        root.querySelector('.intro-leaves').style.clipPath = 'polygon(' + pts.join(',') + ')';
    })();

    var key = root.querySelector('.intro-key');
    var stage = root.querySelector('.intro-stage');
    var started = false, finished = false;

    function siteReady() {
        var loader = document.getElementById('loader');
        return !loader || loader.classList.contains('is-done');
    }
    function whenReady(fn) {
        if (siteReady()) { fn(); return; }
        root.querySelector('.intro-wait').textContent = 'Préparation de la boutique…';
        var timer = setInterval(function () {
            if (siteReady()) { clearInterval(timer); root.querySelector('.intro-wait').textContent = ''; fn(); }
        }, 120);
    }
    function finish() {
        if (finished) return;
        finished = true;
        document.body.classList.remove('stage-paused');
        whenReady(function () {
            root.classList.add('is-leaving');
            document.documentElement.classList.remove('intro-open');
            setTimeout(function () {
                root.remove();
                window.dispatchEvent(new CustomEvent('awrabaya:entered'));
            }, reduce ? 400 : 1100);
        });
    }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function play(el, frames, options) {
        if (!el.animate) return wait(options.duration);
        var a = el.animate(frames, Object.assign({ fill: 'forwards' }, options));
        return a.finished ? a.finished.catch(function () {}) : wait(options.duration);
    }

    function open() {
        if (started) return;
        started = true;
        root.classList.add('is-turning');
        if (reduce) { root.classList.add('is-open'); setTimeout(finish, 300); return; }
        var from = getComputedStyle(key).transform;
        var base = 'translate(-50%, -100%)';
        play(key, [
            { transform: from === 'none' ? base : from },
            { transform: base + ' translate(0, 0) rotate(0deg) scale(1)' }
        ], { duration: 750, easing: 'cubic-bezier(.65,0,.25,1)' })
            .then(function () {
                key.classList.add('is-in');
                return play(key, [
                    { transform: base + ' rotateX(0deg) rotateY(0deg)' },
                    { transform: base + ' rotateX(-72deg) rotateY(0deg)' }
                ], { duration: 420, easing: 'cubic-bezier(.5,0,.2,1)' });
            })
            .then(function () {
                return play(key, [
                    { transform: base + ' rotateX(-72deg) rotateY(0deg)' },
                    { transform: base + ' rotateX(-72deg) rotateY(88deg)' }
                ], { duration: 520, easing: 'cubic-bezier(.6,0,.3,1)' });
            })
            .then(function () {
                root.classList.add('is-unlocked');          // click: glint and a small jolt
                return wait(260);
            })
            .then(function () {
                root.classList.add('is-open');               // leaves swing in, light spills out
                document.body.classList.remove('stage-paused');
                return wait(1250);
            })
            .then(function () {
                root.classList.add('is-entering');           // walk through the doorway
                return wait(1000);
            })
            .then(finish);
    }

    key.addEventListener('click', open);
    root.querySelector('.intro-door').addEventListener('click', function (e) {
        if (!e.target.closest('.intro-key')) open();
    });
    root.querySelector('.intro-skip').addEventListener('click', function () {
        started = true;
        root.classList.add('is-open', 'is-entering');
        finish();
    });
    document.addEventListener('keydown', function (e) {
        if (finished) return;
        if (e.key === 'Escape') root.querySelector('.intro-skip').click();
        else if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === document.body) { e.preventDefault(); open(); }
    });
    setTimeout(function () { try { key.focus({ preventScroll: true }); } catch (err) { key.focus(); } }, 50);
})();
