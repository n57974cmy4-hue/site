/* Awrabaya — the page: fitting room, runway, reveals, counters and contact form.
   No WebGL, no framework: it opens the same way on every phone and computer. */
(function () {
    'use strict';
    var G = window.AwrabayaGarments;
    var CATALOGUE = window.AWRABAYA_CATALOGUE || [];
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var euro = function (v) { return v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }); };
    var byId = function (id) { return CATALOGUE.filter(function (p) { return p.id === id; })[0]; };
    function openProduct(id) {
        if (window.AwrabayaDressing && window.AwrabayaDressing.openProduct) window.AwrabayaDressing.openProduct(id);
    }

    // ---------------------------------------------------------------- header
    var header = document.querySelector('.site-header');
    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    if ('IntersectionObserver' in window) {
        var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { spy.observe(s); });
    }

    // ---------------------------------------------------------------- reveals and counters
    function countUp(el) {
        var target = Number(el.dataset.count || 0), decimals = Number(el.dataset.decimals || 0);
        var format = function (v) { return v.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); };
        if (reduce) { el.textContent = format(target); return; }
        var start = performance.now(), duration = 1600;
        (function tick(now) {
            var t = Math.min(1, (now - start) / duration), eased = 1 - Math.pow(1 - t, 3);
            el.textContent = format(target * eased);
            if (t < 1) requestAnimationFrame(tick);
        })(start);
    }
    var revealed = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !reduce) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var siblings = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);
                e.target.style.transitionDelay = Math.min(siblings, 5) * 0.08 + 's';
                e.target.classList.add('is-in');
                var value = e.target.querySelector('.figure-value');
                if (value) countUp(value);
                io.unobserve(e.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
        revealed.forEach(function (el) { io.observe(el); });
    } else {
        revealed.forEach(function (el) { el.classList.add('is-in'); });
        document.querySelectorAll('.figure-value').forEach(countUp);
    }

    // ---------------------------------------------------------------- the fitting room
    var FEATURED = ['mariniere', 'cape', 'nour', 'layla'].map(byId).filter(Boolean);
    var cabin = document.querySelector('.cabin');
    if (cabin && G && FEATURED.length) {
        var layers = cabin.querySelectorAll('.cabin-layer');
        var nameEl = cabin.querySelector('.cabin-name'), priceEl = cabin.querySelector('.cabin-price');
        var colorEl = cabin.querySelector('.cabin-color'), swatches = cabin.querySelector('.cabin-swatches');
        var piece = 0, colour = 0, front = 0, timer = 0, pausedUntil = 0;

        function paint() {
            var p = FEATURED[piece], c = p.colors[colour];
            var next = layers[1 - front];
            next.innerHTML = G.figure(p, colour, { eager: true });
            next.classList.add('is-on');
            layers[front].classList.remove('is-on');
            front = 1 - front;
            nameEl.textContent = p.name;
            priceEl.textContent = euro(p.price);
            colorEl.textContent = c.name;
            swatches.innerHTML = p.colors.map(function (col, k) {
                return '<button type="button" class="cabin-swatch' + (k === colour ? ' is-active' : '') + '" data-k="' + k +
                    '" aria-label="' + col.name + '" aria-pressed="' + (k === colour) + '" style="--c:' + col.hex + '"></button>';
            }).join('');
        }
        function advance() {
            if (performance.now() < pausedUntil) return;
            var p = FEATURED[piece];
            if (colour < p.colors.length - 1) colour++;
            else { colour = 0; piece = (piece + 1) % FEATURED.length; }
            paint();
        }
        function hold() { pausedUntil = performance.now() + 9000; }
        swatches.addEventListener('click', function (e) {
            var b = e.target.closest('.cabin-swatch');
            if (!b) return;
            colour = Number(b.dataset.k); hold(); paint();
        });
        cabin.querySelector('.cabin-prev').addEventListener('click', function () {
            piece = (piece - 1 + FEATURED.length) % FEATURED.length; colour = 0; hold(); paint();
        });
        cabin.querySelector('.cabin-next').addEventListener('click', function () {
            piece = (piece + 1) % FEATURED.length; colour = 0; hold(); paint();
        });
        var see = function () { openProduct(FEATURED[piece].id); };
        cabin.querySelector('.cabin-see').addEventListener('click', see);
        cabin.querySelector('.cabin-garment').addEventListener('click', see);
        paint();
        FEATURED.forEach(function (p) {
            p.colors.forEach(function (c) { if (c.photo) { var img = new Image(); img.src = c.photo; } });
        });
        if (!reduce) timer = setInterval(advance, 3600);
        document.addEventListener('visibilitychange', function () {
            clearInterval(timer);
            if (!document.hidden && !reduce) timer = setInterval(advance, 3600);
        });
    }

    // ---------------------------------------------------------------- the runway
    var track = document.querySelector('.runway-track');
    if (track && G && CATALOGUE.length) {
        var card = function (p, hidden) {
            return '<button type="button" class="look"' + (hidden ? ' tabindex="-1" aria-hidden="true"' : '') +
                ' data-id="' + p.id + '" aria-label="' + p.name + ', ' + euro(p.price) + '">' +
                '<span class="look-frame">' + G.figure(p, 0, { decorative: true }) + '</span>' +
                '<span class="look-name" style="display:block">' + p.name + '</span>' +
                '<span class="look-meta"><span class="look-price">' + euro(p.price) + '</span><span class="look-dots">' +
                p.colors.map(function (c) { return '<i style="background:' + c.hex + '"></i>'; }).join('') + '</span></span></button>';
        };
        // the list twice, so the loop is seamless
        track.innerHTML = CATALOGUE.map(function (p) { return card(p, false); }).join('') +
            CATALOGUE.map(function (p) { return card(p, true); }).join('');
        var speed = Math.max(40, CATALOGUE.length * 7);
        track.style.animationDuration = speed + 's';
        track.addEventListener('click', function (e) {
            var look = e.target.closest('.look');
            if (look) openProduct(look.dataset.id);
        });
        // hovering a piece shows its next colour: the range at a glance
        track.addEventListener('mouseover', function (e) {
            var look = e.target.closest('.look');
            if (!look || look._shown) return;
            var p = byId(look.dataset.id);
            if (!p || p.colors.length < 2) return;
            look._shown = true;
            look.querySelector('.look-frame').innerHTML = G.figure(p, 1, { decorative: true });
        });
        track.addEventListener('mouseout', function (e) {
            var look = e.target.closest('.look');
            if (!look || !look._shown || look.contains(e.relatedTarget)) return;
            look._shown = false;
            var p = byId(look.dataset.id);
            look.querySelector('.look-frame').innerHTML = G.figure(p, 0, { decorative: true });
        });
    }

    // ---------------------------------------------------------------- contact form
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.reportValidity()) return;
            var data = new FormData(form);
            var field = function (n) { return String(data.get(n) || '').trim(); };
            var name = field('name'), email = field('email'), phone = field('phone'), message = field('message');
            var body = ['Nom : ' + name, 'E-mail : ' + email, phone ? 'Téléphone : ' + phone : null, '', message]
                .filter(function (l) { return l !== null; }).join('\n');
            window.location.href = 'mailto:' + (form.dataset.email || 'contact.awrabaya@gmail.com') +
                '?subject=' + encodeURIComponent('Demande de ' + name) + '&body=' + encodeURIComponent(body);
        });
    }
})();
