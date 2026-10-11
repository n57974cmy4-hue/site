/* Awrabaya — garment illustrations.
   Every piece is drawn in SVG on a 200 x 430 canvas, hung on a wooden hanger, so the
   same drawing serves the door intro, the rotating dressing and the product sheet.
   window.AwrabayaGarments.svg(type, colour, options) returns the markup. */
(function () {
    'use strict';

    function hexToRgb(hex) {
        var h = hex.replace('#', '');
        if (h.length === 3) h = h.replace(/./g, function (c) { return c + c; });
        var n = parseInt(h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function rgbToHex(rgb) {
        return '#' + rgb.map(function (v) {
            return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
        }).join('');
    }
    // amount < 0 darkens towards black, > 0 lightens towards white
    function shade(hex, amount) {
        var rgb = hexToRgb(hex), target = amount < 0 ? 0 : 255, k = Math.abs(amount);
        return rgbToHex(rgb.map(function (v) { return v + (target - v) * k; }));
    }
    function luminance(hex) {
        var rgb = hexToRgb(hex);
        return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    }
    function trimFor(colour) {
        return luminance(colour) > 0.55 ? shade(colour, -0.24) : '#c2a573';
    }

    // Shared gradients, defined once per document and referenced by every drawing.
    function ensureDefs() {
        if (document.getElementById('awr-garment-defs')) return;
        var holder = document.createElement('div');
        holder.innerHTML =
            '<svg id="awr-garment-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
            '<defs>' +
            '<linearGradient id="awrShade" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" stop-color="#000" stop-opacity=".30"/>' +
            '<stop offset=".32" stop-color="#000" stop-opacity="0"/>' +
            '<stop offset=".62" stop-color="#fff" stop-opacity=".07"/>' +
            '<stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>' +
            '<linearGradient id="awrFall" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#fff" stop-opacity=".16"/>' +
            '<stop offset=".35" stop-color="#fff" stop-opacity="0"/>' +
            '<stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>' +
            '<linearGradient id="awrWood" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#cfae86"/><stop offset="1" stop-color="#a27c58"/></linearGradient>' +
            '</defs></svg>';
        (document.body || document.documentElement).appendChild(holder.firstChild);
    }

    var HANGER =
        '<path d="M100 36V23c0-10 6-16 13-16s11 5 11 11" fill="none" stroke="#a3927f" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M100 33 28 57c-6 2-5 8 2 8h140c7 0 8-6 2-8z" fill="url(#awrWood)"/>' +
        '<path d="M34 60h132" stroke="#e6cfae" stroke-opacity=".6" stroke-width="1"/>';

    function fabric(d, colour) {
        return '<path d="' + d + '" fill="' + colour + '"/>' +
            '<path d="' + d + '" fill="url(#awrShade)"/>' +
            '<path d="' + d + '" fill="url(#awrFall)"/>';
    }
    function lines(list, colour, width, opacity) {
        return list.map(function (d) {
            return '<path d="' + d + '" fill="none" stroke="' + colour + '" stroke-width="' + width +
                '" stroke-opacity="' + (opacity == null ? 1 : opacity) + '" stroke-linecap="round"/>';
        }).join('');
    }
    var FOLD = '#000';

    var DRAW = {
        // Classic abaya: A-line, long wide sleeves, open front with a trim.
        abaya: function (c, o) {
            var trim = o.trim || trimFor(c), sleeve = shade(c, -0.08);
            return fabric('M84 44Q100 58 116 44L150 58 158 132 170 418Q100 426 30 418L42 132 50 58Z', c) +
                lines(['M72 150Q66 290 60 416', 'M128 150Q134 290 140 416', 'M90 200Q88 320 86 418'], FOLD, 2, 0.13) +
                fabric('M50 58 34 66 18 262Q30 268 46 264L54 150Z', sleeve) +
                fabric('M150 58 166 66 182 262Q170 268 154 264L146 150Z', sleeve) +
                lines(['M40 92Q31 180 27 258', 'M160 92Q169 180 173 258'], FOLD, 1.6, 0.14) +
                lines(['M18 262Q30 268 46 264', 'M182 262Q170 268 154 264'], trim, 2.4) +
                lines(['M100 53V421', 'M84 44Q100 58 116 44'], trim, 2.6);
        },
        // Butterfly abaya: one wide drape from wrist to wrist.
        papillon: function (c, o) {
            var trim = o.trim || trimFor(c);
            return fabric('M84 44Q100 58 116 44L156 60Q188 150 186 262Q172 270 152 268L160 418Q100 426 40 418L48 268Q28 270 14 262Q12 150 44 60Z', c) +
                lines(['M58 80Q38 170 32 258', 'M142 80Q162 170 168 258', 'M66 272Q62 340 58 416', 'M134 272Q138 340 142 416',
                       'M78 90Q76 250 80 418', 'M122 90Q124 250 120 418'], FOLD, 1.8, 0.13) +
                lines(['M14 262Q28 270 48 268', 'M186 262Q172 270 152 268', 'M84 44Q100 58 116 44'], trim, 2.4);
        },
        // Open kimono over a contrasting inner dress.
        kimono: function (c, o) {
            var inner = o.inner || (luminance(c) > 0.55 ? shade(c, -0.35) : '#efe6d6');
            var trim = o.trim || trimFor(c);
            return fabric('M86 46Q100 58 114 46L120 418H80Z', inner) +
                fabric('M88 44 50 56 10 70 14 206Q30 210 50 206L54 132 44 418H86Q94 220 88 44Z', c) +
                fabric('M112 44 150 56 190 70 186 206Q170 210 150 206L146 132 156 418H114Q106 220 112 44Z', c) +
                lines(['M30 76Q26 140 28 204', 'M170 76Q174 140 172 204', 'M64 140Q58 280 56 416', 'M136 140Q142 280 144 416'], FOLD, 1.6, 0.13) +
                lines(['M88 44Q94 220 86 418', 'M112 44Q106 220 114 418', 'M14 206Q30 210 50 206', 'M186 206Q170 210 150 206'], trim, 2.6);
        },
        // Long dress: fitted bodice, belt, pleated flared skirt.
        robe: function (c, o) {
            var belt = o.trim || shade(c, -0.3), sleeve = shade(c, -0.08);
            var pleats = [78, 86, 94, 100, 106, 114, 122].map(function (x) {
                return 'M' + x + ' 182L' + (100 + (x - 100) * 3.2).toFixed(0) + ' 416';
            });
            return fabric('M58 58 42 66 32 250Q40 254 48 252L60 120Z', sleeve) +
                fabric('M142 58 158 66 168 250Q160 254 152 252L140 120Z', sleeve) +
                fabric('M84 44Q100 58 116 44L142 58 136 112 128 172 172 418Q100 428 28 418L72 172 64 112 58 58Z', c) +
                lines(pleats, FOLD, 1.5, 0.15) +
                '<path d="M71 166H129L130 181H70Z" fill="' + belt + '"/>' +
                lines(['M84 44Q100 58 116 44'], belt, 2.2);
        },
        // Long khimar: a cape with the face opening, hung by its crown.
        khimar: function (c, o) {
            var trim = o.trim || shade(c, -0.25);
            return fabric('M70 40Q100 20 130 40L148 110Q182 240 176 330Q100 352 24 330Q18 240 52 110Z', c) +
                '<ellipse cx="100" cy="92" rx="22" ry="30" fill="' + shade(c, -0.45) + '"/>' +
                '<ellipse cx="100" cy="92" rx="22" ry="30" fill="none" stroke="' + trim + '" stroke-width="2"/>' +
                lines(['M72 124Q56 230 50 330', 'M128 124Q144 230 150 330', 'M100 128Q100 240 100 344',
                       'M86 126Q78 240 74 340', 'M114 126Q122 240 126 340'], FOLD, 1.6, 0.13);
        },
        // Two-piece: knee-length tunic over wide trousers.
        ensemble: function (c, o) {
            var pants = o.inner || shade(c, -0.22), trim = o.trim || trimFor(c), sleeve = shade(c, -0.08);
            return fabric('M70 300 64 420H96L100 330 104 420H136L130 300Z', pants) +
                lines(['M80 330 78 418', 'M120 330 122 418'], FOLD, 1.4, 0.15) +
                fabric('M52 58 36 66 26 214Q36 218 46 216L56 120Z', sleeve) +
                fabric('M148 58 164 66 174 214Q164 218 154 216L144 120Z', sleeve) +
                fabric('M84 44Q100 58 116 44L148 58 156 330Q100 338 44 330L52 58Z', c) +
                lines(['M70 130Q66 230 62 328', 'M130 130Q134 230 138 328'], FOLD, 1.6, 0.13) +
                lines(['M50 282 47 330', 'M150 282 153 330'], shade(c, -0.35), 2) +
                lines(['M84 44Q100 58 116 44', 'M100 52V122'], trim, 2.4);
        },
        // Kaftan: straight and generous, embroidered front band.
        kaftan: function (c, o) {
            var gold = o.trim || '#b8975f';
            return fabric('M84 44Q100 58 116 44L168 64 182 214Q166 220 150 216L146 130 154 418Q100 426 46 418L54 130 50 216Q34 220 18 214L32 64Z', c) +
                lines(['M70 140Q66 290 62 416', 'M130 140Q134 290 138 416', 'M40 80Q32 150 30 212', 'M160 80Q168 150 170 212'], FOLD, 1.6, 0.13) +
                lines(['M100 50V300'], gold, 7) +
                '<path d="M100 52V298" stroke="#e8d6ac" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>' +
                '<circle cx="100" cy="306" r="5" fill="' + gold + '"/>' +
                lines(['M84 44Q100 58 116 44', 'M18 214Q34 220 50 216', 'M182 214Q166 220 150 216'], gold, 3.4);
        }
    };

    function svg(type, colour, options) {
        ensureDefs();
        options = options || {};
        var draw = DRAW[type] || DRAW.abaya;
        var label = options.label ? '<title>' + options.label + '</title>' : '';
        var attrs = options.decorative ? ' aria-hidden="true" focusable="false"' : ' role="img"';
        return '<svg class="garment" viewBox="0 0 200 430"' + attrs + '>' + label +
            (options.hanger === false ? '' : HANGER) + draw(colour, options) + '</svg>';
    }

    window.AwrabayaGarments = { svg: svg, shade: shade, luminance: luminance, types: Object.keys(DRAW) };
})();
