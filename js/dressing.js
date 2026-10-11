/* Awrabaya — the rotating dressing.
   A boutique carousel rack seen in perspective: the pieces hang on a brass ring that
   turns under the visitor's hand (drag, swipe, wheel, arrows), swing on their hangers
   with the rotation, and open into a product sheet with colours, sizes and an order
   button. Built with CSS 3D transforms; the catalogue lives in js/catalogue.js. */
(function () {
    'use strict';
    var G = window.AwrabayaGarments;
    var CATALOGUE = window.AWRABAYA_CATALOGUE || [];
    var CATEGORIES = window.AWRABAYA_CATEGORIES || [{ id: 'all', label: 'Tout' }];
    var root = document.getElementById('dressing');
    if (!root || !G || !CATALOGUE.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var euro = function (v) { return v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }); };
    var esc = function (s) {
        return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    };

    // ---------------------------------------------------------------- markup
    root.innerHTML =
        '<div class="dr-room" aria-hidden="true"></div>' +
        '<header class="dr-top">' +
        '<div class="dr-title"><p class="dr-eyebrow">Awrabaya · la penderie</p><h2 id="dr-title">Le dressing</h2></div>' +
        '<div class="dr-filters" role="tablist" aria-label="Catégories">' +
        CATEGORIES.map(function (c, i) {
            return '<button type="button" role="tab" class="dr-chip' + (i ? '' : ' is-active') + '" data-cat="' + c.id + '" aria-selected="' + (i ? 'false' : 'true') + '">' + esc(c.label) + '</button>';
        }).join('') +
        '</div>' +
        '<button type="button" class="dr-close" aria-label="Fermer le dressing"><span aria-hidden="true">×</span></button>' +
        '</header>' +
        '<div class="dr-stage">' +
        '<svg class="dr-ring dr-ring-back" aria-hidden="true"></svg>' +
        '<div class="dr-rig"><div class="dr-carousel"></div></div>' +
        '<svg class="dr-ring dr-ring-front" aria-hidden="true"></svg>' +
        '</div>' +
        '<div class="dr-focus" aria-live="polite">' +
        '<button type="button" class="dr-arrow dr-prev" aria-label="Pièce précédente">&#8592;</button>' +
        '<div class="dr-focus-text"><p class="dr-focus-name"></p><p class="dr-focus-meta"></p></div>' +
        '<button type="button" class="dr-see">Voir la pièce <span aria-hidden="true">&#8599;</span></button>' +
        '<button type="button" class="dr-arrow dr-next" aria-label="Pièce suivante">&#8594;</button>' +
        '</div>' +
        '<p class="dr-hint">Faites tourner la penderie du bout du doigt</p>' +
        '<div class="dr-doors" aria-hidden="true"><div class="dr-door dr-door-left"><span class="dr-handle"></span></div>' +
        '<div class="dr-door dr-door-right"><span class="dr-handle"></span></div></div>' +
        '<aside class="dr-panel" aria-labelledby="dr-panel-name" aria-hidden="true">' +
        '<button type="button" class="dr-panel-close" aria-label="Revenir au dressing">&#8592; Le dressing</button>' +
        '<div class="dr-panel-art"></div>' +
        '<div class="dr-panel-body">' +
        '<h3 id="dr-panel-name"></h3><p class="dr-panel-price"></p><p class="dr-panel-desc"></p>' +
        '<p class="dr-label-row">Coloris <span class="dr-color-name"></span></p><div class="dr-colors"></div>' +
        '<p class="dr-label-row">Taille <span class="dr-size-msg" aria-live="polite"></span></p><div class="dr-sizes"></div>' +
        '<button type="button" class="dr-order">Commander cette pièce <span aria-hidden="true">&#8599;</span></button>' +
        '<p class="dr-order-note">Votre messagerie s\'ouvre avec la commande prête à envoyer.<br>Nous confirmons la disponibilité, la livraison et le paiement par retour d\'e-mail.</p>' +
        '</div></aside>';

    var stage = root.querySelector('.dr-stage');
    var rig = root.querySelector('.dr-rig');
    var carousel = root.querySelector('.dr-carousel');
    var ringBack = root.querySelector('.dr-ring-back');
    var ringFront = root.querySelector('.dr-ring-front');
    var panel = root.querySelector('.dr-panel');
    var focusName = root.querySelector('.dr-focus-name');
    var focusMeta = root.querySelector('.dr-focus-meta');

    // ---------------------------------------------------------------- state
    var items = [], nodes = [], step = 36, radius = 300, itemW = 170, itemH = 365;
    var theta = 0, omega = 0, goal = null, swing = 0, swingVel = 0;
    var dragging = false, lastX = 0, lastT = 0, moved = 0, downTarget = null;
    var lastInput = 0, front = -1, isOpen = false, running = false, rafId = 0, lastFrame = 0;
    var current = null, choice = { color: 0, size: null };
    var picked = {};                     // colour index chosen per piece, shared with the sheet
    var TILT = -9, PERSPECTIVE = 1500;

    function layout() {
        var w = stage.clientWidth, h = stage.clientHeight;
        itemW = Math.max(118, Math.min(215, w * 0.16, h * 0.4));
        itemH = itemW * 2.15;
        var n = Math.max(items.length, 3);
        radius = Math.max(itemW * n / (2 * Math.PI) * (w < 700 ? 1.04 : 1.18), itemW * 1.15);
        radius = Math.min(radius, w * 0.42 + itemW * 0.8);
        root.style.setProperty('--item-w', itemW + 'px');
        var railY = Math.max(56, (h - itemH * 1.06) * 0.5);
        root.style.setProperty('--rail-y', railY + 'px');
        root.style.setProperty('--floor-y', (stage.offsetTop + railY + itemH * 0.97) + 'px');
        nodes.forEach(function (node, i) {
            node.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
        });
        drawRing();
    }

    // The brass rail, projected with the same perspective as the CSS scene, split into
    // the arc behind the pieces and the arc in front of them.
    function drawRing() {
        var w = stage.clientWidth, h = stage.clientHeight;
        var railY = parseFloat(getComputedStyle(root).getPropertyValue('--rail-y')) || 80;
        var ox = w / 2, oy = railY + itemH * 0.42;
        var t = TILT * Math.PI / 180, back = [], frontArc = [];
        // the carousel is pushed back by its radius so the front piece keeps its size
        function project(r, y, a) {
            var x = r * Math.sin(a), z = r * Math.cos(a) - radius;
            var y2 = y * Math.cos(t) - z * Math.sin(t), z2 = y * Math.sin(t) + z * Math.cos(t);
            var s = PERSPECTIVE / (PERSPECTIVE - z2);
            return [ox + x * s, oy + (railY + y2 - oy) * s, Math.cos(a)];
        }
        for (var k = 0; k <= 96; k++) {
            var p = project(radius, 0, k / 96 * Math.PI * 2);
            (p[2] < 0 ? back : frontArc).push(p);
        }
        var toPath = function (pts) {
            // order along the angle and break where the arc wraps around
            return pts.length ? 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') : '';
        };
        var floorY = itemH * 1.0, shadow = [];
        for (var j = 0; j < 64; j++) shadow.push(project(radius * 0.92, floorY, j / 64 * Math.PI * 2));
        var top = project(0, -itemH * 0.08, 0), base = project(0, floorY, 0);
        var frontSorted = frontArc.slice().sort(function (a, b) { return a[0] - b[0]; });
        var backSorted = back.slice().sort(function (a, b) { return a[0] - b[0]; });
        ringBack.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        ringFront.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        ringBack.innerHTML =
            '<path d="' + toPath(shadow) + 'Z" fill="#7a5f4c" opacity=".16" filter="url(#drBlur)"/>' +
            '<defs><filter id="drBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>' +
            '<linearGradient id="drBrass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9c7740"/><stop offset=".5" stop-color="#ecd29a"/><stop offset="1" stop-color="#9c7740"/></linearGradient></defs>' +
            '<path d="M' + top[0] + ' ' + (top[1] - 40) + 'V' + base[1] + '" stroke="#b8945c" stroke-width="6" stroke-linecap="round"/>' +
            '<ellipse cx="' + base[0] + '" cy="' + base[1] + '" rx="' + (itemW * 0.55) + '" ry="' + (itemW * 0.09) + '" fill="#b08f6a"/>' +
            '<path d="' + toPath(backSorted) + '" fill="none" stroke="#a88552" stroke-width="5" stroke-linecap="round"/>';
        ringFront.innerHTML =
            '<path d="' + toPath(frontSorted) + '" fill="none" stroke="url(#drBrassF)" stroke-width="6" stroke-linecap="round"/>' +
            '<defs><linearGradient id="drBrassF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a7834c"/><stop offset=".5" stop-color="#f1dcaa"/><stop offset="1" stop-color="#a7834c"/></linearGradient></defs>' +
            '<ellipse cx="' + top[0] + '" cy="' + (top[1] - 40) + '" rx="16" ry="6" fill="url(#drBrassF)"/>';
        stage.style.perspective = PERSPECTIVE + 'px';
        stage.style.perspectiveOrigin = ox + 'px ' + oy + 'px';
    }

    function colourOf(item) { return item.colors[picked[item.id] || 0].hex; }

    function build(category) {
        items = CATALOGUE.filter(function (p) { return category === 'all' || p.category === category; });
        step = 360 / Math.max(items.length, 3);
        carousel.innerHTML = items.map(function (p, i) {
            return '<div class="dr-item" data-i="' + i + '" role="button" tabindex="-1" aria-label="' + esc(p.name) + ', ' + euro(p.price) + '">' +
                '<div class="dr-swing"><div class="dr-garment">' + G.svg(p.type, colourOf(p), { decorative: true }) + '</div>' +
                '<span class="dr-tag">' + euro(p.price) + '</span></div>' +
                '<p class="dr-name">' + esc(p.name) + '</p></div>';
        }).join('');
        nodes = Array.prototype.slice.call(carousel.children);
        front = -1;
        theta = 0; goal = null;
        layout();
    }

    function norm(a) { a = ((a + 180) % 360 + 360) % 360 - 180; return a; }

    function frame(now) {
        if (!running) return;
        rafId = requestAnimationFrame(frame);
        var dt = lastFrame ? Math.min(3, (now - lastFrame) / 16.67) : 1;
        lastFrame = now;
        var prev = theta;
        if (!dragging) {
            if (goal !== null) {
                theta += (goal - theta) * (1 - Math.pow(0.86, dt));
                if (Math.abs(goal - theta) < 0.05) { theta = goal; goal = null; }
            } else if (Math.abs(omega) > 0.18) {
                theta += omega * dt;
                omega *= Math.pow(0.955, dt);
            } else {
                omega = 0;
                var idle = now - lastInput > 6000 && !panel.classList.contains('is-open') && !reduce;
                if (idle) theta += 0.09 * dt;
                else goal = Math.round(theta / step) * step;
            }
        }
        var speed = (theta - prev) / dt;
        // hangers swing against the rotation: a damped spring
        var target = Math.max(-16, Math.min(16, -speed * 2.2));
        swingVel += ((target - swing) * 0.08 - swingVel * 0.16) * dt;
        swing += swingVel * dt;
        carousel.style.transform = 'translateZ(' + (-radius) + 'px) rotateY(' + theta + 'deg)';
        for (var i = 0; i < nodes.length; i++) {
            var a = norm(theta + i * step);
            var facing = Math.cos(a * Math.PI / 180);
            var node = nodes[i];
            var dim = Math.round((0.62 + 0.38 * Math.max(0, facing)) * 50) / 50;
            if (node._dim !== dim) { node._dim = dim; node.style.setProperty('--dim', dim); }
            var sw = (swing * (1 + 0.18 * Math.sin(i * 1.7))).toFixed(2);
            if (node._sw !== sw) { node._sw = sw; node.firstChild.style.transform = 'rotateZ(' + sw + 'deg)'; }
        }
        var k = ((Math.round(-theta / step) % items.length) + items.length) % items.length;
        if (k !== front) setFront(k);
    }

    function setFront(k) {
        if (nodes[front]) nodes[front].classList.remove('is-front');
        front = k;
        var p = items[k];
        if (!p) return;
        nodes[k].classList.add('is-front');
        focusName.textContent = p.name;
        focusMeta.innerHTML = euro(p.price) + '<span class="dr-dots">' + p.colors.map(function (c) {
            return '<i style="background:' + c.hex + '"></i>';
        }).join('') + '</span>';
    }

    function turnTo(k) {
        var target = -k * step;
        goal = target + 360 * Math.round((theta - target) / 360);
        omega = 0; lastInput = performance.now();
    }

    // ---------------------------------------------------------------- input
    stage.addEventListener('pointerdown', function (e) {
        if (e.button !== undefined && e.button !== 0) return;
        dragging = true; moved = 0; lastX = e.clientX; lastT = performance.now();
        downTarget = e.target.closest('.dr-item');
        omega = 0; goal = null; lastInput = lastT;
        stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
        stage.classList.add('is-grabbing');
    });
    stage.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var now = performance.now(), dx = e.clientX - lastX;
        var delta = dx * (stage.clientWidth < 700 ? 0.42 : 0.26);
        theta += delta;
        omega = delta / Math.max(1, (now - lastT) / 16.67);
        moved += Math.abs(dx); lastX = e.clientX; lastT = now; lastInput = now;
    });
    function release() {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove('is-grabbing');
        if (performance.now() - lastT > 90) omega = 0;
        if (moved < 6 && downTarget) {
            var i = Number(downTarget.dataset.i);
            if (i === front) openPanel(i); else turnTo(i);
        }
    }
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('wheel', function (e) {
        e.preventDefault();
        var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        goal = null; omega = Math.max(-9, Math.min(9, omega - d * 0.025));
        lastInput = performance.now();
    }, { passive: false });
    root.querySelector('.dr-prev').addEventListener('click', function () { turnTo((front - 1 + items.length) % items.length); });
    root.querySelector('.dr-next').addEventListener('click', function () { turnTo((front + 1) % items.length); });
    root.querySelector('.dr-see').addEventListener('click', function () { openPanel(front); });
    root.querySelector('.dr-close').addEventListener('click', close);
    root.querySelectorAll('.dr-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            root.querySelectorAll('.dr-chip').forEach(function (c) {
                c.classList.toggle('is-active', c === chip);
                c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
            });
            carousel.classList.add('is-swapping');
            setTimeout(function () {
                build(chip.dataset.cat);
                carousel.classList.remove('is-swapping');
                theta = -180; omega = reduce ? 0 : 7.5; goal = reduce ? 0 : null;
            }, 260);
        });
    });
    root.addEventListener('keydown', function (e) {
        if (!isOpen) return;
        if (e.key === 'Escape') { e.preventDefault(); panel.classList.contains('is-open') ? closePanel() : close(); }
        else if (panel.classList.contains('is-open')) return;
        else if (e.key === 'ArrowLeft') { e.preventDefault(); turnTo((front - 1 + items.length) % items.length); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); turnTo((front + 1) % items.length); }
    });
    window.addEventListener('resize', function () { if (isOpen) layout(); });

    // ---------------------------------------------------------------- product sheet
    function openPanel(i) {
        var p = items[i];
        if (!p) return;
        current = p;
        choice = { color: picked[p.id] || 0, size: p.sizes.length === 1 ? p.sizes[0] : null };
        panel.querySelector('#dr-panel-name').textContent = p.name;
        panel.querySelector('.dr-panel-price').textContent = euro(p.price);
        panel.querySelector('.dr-panel-desc').textContent = p.description;
        panel.querySelector('.dr-colors').innerHTML = p.colors.map(function (c, k) {
            return '<button type="button" class="dr-swatch" data-k="' + k + '" aria-label="' + esc(c.name) + '" style="--c:' + c.hex + '"></button>';
        }).join('');
        panel.querySelector('.dr-sizes').innerHTML = p.sizes.map(function (s) {
            return '<button type="button" class="dr-size" data-s="' + esc(s) + '">' + esc(s) + '</button>';
        }).join('');
        panel.querySelector('.dr-size-msg').textContent = '';
        renderChoice();
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        root.classList.add('has-panel');
        setTimeout(function () { panel.querySelector('.dr-panel-close').focus({ preventScroll: true }); }, 60);
    }
    function renderChoice() {
        var p = current, c = p.colors[choice.color];
        panel.querySelector('.dr-panel-art').innerHTML = G.svg(p.type, c.hex, { label: p.name + ', ' + c.name });
        panel.querySelector('.dr-color-name').textContent = c.name;
        panel.querySelectorAll('.dr-swatch').forEach(function (b) {
            var on = Number(b.dataset.k) === choice.color;
            b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        panel.querySelectorAll('.dr-size').forEach(function (b) {
            var on = b.dataset.s === choice.size;
            b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }
    panel.addEventListener('click', function (e) {
        var sw = e.target.closest('.dr-swatch'), sz = e.target.closest('.dr-size');
        if (sw) {
            choice.color = Number(sw.dataset.k);
            picked[current.id] = choice.color;
            var i = items.indexOf(current);
            if (nodes[i]) nodes[i].querySelector('.dr-garment').innerHTML = G.svg(current.type, current.colors[choice.color].hex, { decorative: true });
            renderChoice();
        } else if (sz) {
            choice.size = sz.dataset.s;
            panel.querySelector('.dr-size-msg').textContent = '';
            renderChoice();
        }
    });
    function closePanel() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        root.classList.remove('has-panel');
        lastInput = performance.now();
    }
    panel.querySelector('.dr-panel-close').addEventListener('click', closePanel);
    panel.querySelector('.dr-order').addEventListener('click', function () {
        if (!choice.size) {
            panel.querySelector('.dr-size-msg').textContent = '— choisissez votre taille';
            panel.querySelector('.dr-sizes').classList.remove('is-shaking');
            void panel.offsetWidth;
            panel.querySelector('.dr-sizes').classList.add('is-shaking');
            return;
        }
        var form = document.getElementById('contact-form');
        var to = (form && form.dataset.email) || 'contact.awrabaya@gmail.com';
        var p = current, c = p.colors[choice.color];
        var body = ['Bonjour Awrabaya,', '', 'Je souhaite commander :',
            '• ' + p.name + ' — ' + euro(p.price), '• Coloris : ' + c.name, '• Taille : ' + choice.size, '',
            'Nom et prénom : ', 'Adresse de livraison : ', 'Téléphone : ', '', 'Merci !'].join('\n');
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Commande — ' + p.name + ' (' + c.name + ', ' + choice.size + ')') +
            '&body=' + encodeURIComponent(body);
    });

    // ---------------------------------------------------------------- open / close
    var opener = null;
    function open() {
        if (isOpen) return;
        isOpen = true; opener = document.activeElement;
        if (!items.length) build('all');
        root.hidden = false;
        root.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('dressing-open');
        document.body.classList.add('stage-paused');
        requestAnimationFrame(function () {
            layout();
            root.classList.add('is-visible');
            theta = reduce ? 0 : -220; omega = 0; goal = null;
            setTimeout(function () { root.classList.add('is-open'); }, reduce ? 0 : 380);
            // the rack spins in and settles on the first piece
            setTimeout(function () { goal = 0; lastInput = performance.now(); }, reduce ? 0 : 900);
            running = true; lastFrame = 0; rafId = requestAnimationFrame(frame);
            root.querySelector('.dr-close').focus({ preventScroll: true });
        });
    }
    function close() {
        if (!isOpen) return;
        closePanel();
        root.classList.remove('is-open');
        setTimeout(function () {
            root.classList.remove('is-visible');
            setTimeout(function () {
                isOpen = false; running = false; cancelAnimationFrame(rafId);
                root.hidden = true; root.setAttribute('aria-hidden', 'true');
                document.documentElement.classList.remove('dressing-open');
                document.body.classList.remove('stage-paused');
                if (opener && opener.focus) opener.focus({ preventScroll: true });
            }, reduce ? 0 : 420);
        }, reduce ? 0 : 520);
    }

    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-open-dressing]');
        if (!trigger) return;
        e.preventDefault();
        open();
    });
    // Open the dressing straight on one piece: the rack turns to it, then its sheet opens.
    function openProduct(id) {
        var wasOpen = isOpen;
        if (!wasOpen) open();
        setTimeout(function () {
            var find = function () { for (var i = 0; i < items.length; i++) if (items[i].id === id) return i; return -1; };
            var i = find();
            if (i < 0) {
                build('all');
                root.querySelectorAll('.dr-chip').forEach(function (c) {
                    var on = c.dataset.cat === 'all';
                    c.classList.toggle('is-active', on); c.setAttribute('aria-selected', on ? 'true' : 'false');
                });
                i = find();
            }
            if (i < 0) return;
            turnTo(i);
            setTimeout(function () { openPanel(i); }, reduce ? 0 : 750);
        }, wasOpen || reduce ? 0 : 1000);
    }
    window.AwrabayaDressing = { open: open, close: close, turnTo: turnTo, openPanel: openPanel, openProduct: openProduct };
})();
