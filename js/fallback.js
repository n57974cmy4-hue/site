/* Awrabaya — safety net for the 3D stage.
   The chapters are revealed by the WebGL engine. If it cannot start on a device (no
   WebGL 2, a blocked module, an old browser), the site switches to a classic scrolling
   page: every chapter shown, the arch drawn flat, nothing hidden behind the stage. */
(function () {
    'use strict';
    var switched = false;

    function engineRunning() { return !!window.__glassSite; }

    function staticArch() {
        var source = document.querySelector('script[data-shape]');
        var hero = document.getElementById('slide-1');
        if (!source || !hero || hero.querySelector('.static-arch')) return;
        var match = source.textContent.match(/\sd="([^"]+)"/);
        if (!match) return;
        var art = document.createElement('div');
        art.className = 'static-arch';
        art.setAttribute('aria-hidden', 'true');
        art.innerHTML = '<svg viewBox="200 0 600 1000"><defs>' +
            '<linearGradient id="staticArchFill" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#fffaf2"/><stop offset=".5" stop-color="#e8d8c2"/><stop offset="1" stop-color="#c6aa88"/></linearGradient>' +
            '<linearGradient id="staticArchEdge" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b8996f"/></linearGradient></defs>' +
            '<path d="' + match[1] + '" fill="url(#staticArchFill)" fill-rule="evenodd" stroke="url(#staticArchEdge)" stroke-width="3"/></svg>';
        hero.appendChild(art);
    }

    function enable() {
        if (switched || engineRunning()) return;
        switched = true;
        document.documentElement.classList.add('static-site');
        document.body.classList.remove('stage-paused');
        document.querySelectorAll('.slide').forEach(function (slide) { slide.classList.add('active'); });
        var contact = document.getElementById('contact');
        if (contact) contact.classList.add('is-visible');
        staticArch();
        if (window.__glassLoader) window.__glassLoader.done();
    }

    // A failing engine module or library: switch right away.
    window.addEventListener('error', function (event) {
        var target = event.target, file = event.filename || '';
        var scriptFailed = target && target.tagName === 'SCRIPT' && /app\.js|three|SVGLoader/.test(target.src || '');
        if (scriptFailed || /app\.js|three\.module|SVGLoader/.test(file)) setTimeout(enable, 0);
    }, true);
    window.addEventListener('unhandledrejection', function () { setTimeout(function () { if (!engineRunning()) enable(); }, 300); });

    // Otherwise give the engine a fair chance, then check it really started.
    var started = performance.now();
    var timer = setInterval(function () {
        if (engineRunning()) {
            clearInterval(timer);
            // a slow engine that arrives after the switch takes the stage back
            if (switched) {
                switched = false;
                document.documentElement.classList.remove('static-site');
                var art = document.querySelector('.static-arch');
                if (art) art.remove();
            }
            return;
        }
        if (switched) return;
        var loader = document.getElementById('loader');
        var loaderDone = !loader || loader.classList.contains('is-done');
        if ((loaderDone && performance.now() - started > 2500) || performance.now() - started > 20000) enable();
    }, 400);

    window.AwrabayaFallback = { enable: enable };
})();
