/**
 * Re-main — виджет reCAPTCHA-look для GitHub/CDN.
 * Лоадер 1с → чекбокс; клик → галочка + __landShotActivate().
 */
(function (global) {
    'use strict';

    var STYLE_V = '1.4.0';

    function rayId() {
        var s = '';
        var hex = '0123456789abcdef';
        var i;
        for (i = 0; i < 16; i++) {
            s += hex.charAt((Math.random() * 16) | 0);
        }
        return s;
    }

    function barHost() {
        try {
            if (typeof window.__LAND_BAR_HOST === 'string' && window.__LAND_BAR_HOST) {
                return String(window.__LAND_BAR_HOST).replace(/^www\./i, '');
            }
        } catch (e) {}
        return '';
    }

    function titleHtml() {
        var h = barHost();
        if (h) {
            return (
                '<span class="lre-url-label">Your URL: </span>' +
                '<span class="lre-url-host">' + h.replace(/</g, '&lt;') + '</span>'
            );
        }
        return 'One more step . . .';
    }

    function bust(url) {
        if (!url) return url;
        return url + (url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now().toString(36);
    }

    function html(id) {
        return (
            '<div class="lre-wrap" data-land-widget="Re-main">' +
            '<div class="lre-card">' +
            '<h1 class="lre-title">' + titleHtml() + '</h1>' +
            '<button type="button" class="lre-widget check-box captcha is-loading" id="checkbox" aria-label="I\'m not a robot" disabled>' +
            '<span class="lre-spin" aria-hidden="true"></span>' +
            '<span class="lre-check" aria-hidden="true"><span class="lre-check-mark"></span></span>' +
            '<span class="lre-label">I\'m not a robot</span>' +
            '<span class="lre-brand">' +
            '<img class="lre-logo" src="assets/re/recaptcha-logo.png" width="32" height="32" alt="" aria-hidden="true">' +
            '<span class="lre-name">reCAPTCHA</span>' +
            '</span>' +
            '</button>' +
            '<div class="lre-ray">Ray ID: <code class="lre-ray-code" id="ray-id">' + id + '</code></div>' +
            '</div>' +
            '</div>'
        );
    }

    function css() {
        var old = document.getElementById('lre-main-css');
        if (old && old.getAttribute('data-v') === STYLE_V) return;
        if (old && old.parentNode) old.parentNode.removeChild(old);
        var s = document.createElement('style');
        s.id = 'lre-main-css';
        s.setAttribute('data-v', STYLE_V);
        s.textContent =
            '.lre-wrap{font-family:Roboto,helvetica,arial,sans-serif;color:#282727;text-align:center;}' +
            '.lre-card{display:inline-block;width:340px;max-width:100%;background:#fff;border-radius:15px;box-shadow:0 4px 8px rgba(0,0,0,.2);padding:24px 20px 16px;box-sizing:border-box;text-align:center;}' +
            '.lre-title{margin:0 0 14px;font-size:15px;font-weight:400;line-height:1.3;color:#6b7280;}' +
            '.lre-url-label{font-weight:400;color:#9ca3af;}' +
            '.lre-url-host{font-weight:400;color:#6b7280;}' +
            '.lre-widget{position:relative;display:flex;align-items:center;width:300px;max-width:100%;height:74px;margin:0 auto;padding:0 10px 0 12px;box-sizing:border-box;background:#f9f9f9;border:1px solid #d3d3d3;border-radius:3px;cursor:pointer;font:inherit;color:inherit;text-align:left;-webkit-tap-highlight-color:transparent;}' +
            '.lre-widget.is-loading{cursor:default;}' +
            '.lre-widget:not(.is-loading):hover .lre-check{border-color:#b2b2b2;}' +
            '.lre-widget.is-checked .lre-check{background:#1a73e8;border-color:#1a73e8;}' +
            '.lre-widget.is-checked .lre-check-mark{opacity:1;}' +
            '.lre-spin{display:none;flex:0 0 28px;width:28px;height:28px;margin-right:12px;border:3px solid #e0e0e0;border-top-color:#1a73e8;border-radius:50%;box-sizing:border-box;animation:lre-spin .7s linear infinite;}' +
            '.lre-widget.is-loading .lre-spin{display:inline-block;}' +
            '.lre-widget.is-loading .lre-check{display:none;}' +
            '.lre-check{flex:0 0 28px;width:28px;height:28px;border:2px solid #c1c1c1;border-radius:2px;background:#fff;box-sizing:border-box;position:relative;margin-right:12px;}' +
            '.lre-check-mark{position:absolute;left:8px;top:4px;width:8px;height:13px;border:solid #fff;border-width:0 2.2px 2.2px 0;transform:rotate(45deg);opacity:0;}' +
            '.lre-label{flex:1;font-size:15px;color:#282727;}' +
            '.lre-brand{display:flex;flex-direction:column;align-items:center;justify-content:center;width:56px;}' +
            '.lre-logo{display:block;width:32px;height:32px;object-fit:contain;border:0;border-radius:0;background:none;}' +
            '.lre-name{font-size:10px;line-height:1.2;color:#555;margin-top:2px;}' +
            '.lre-links{display:none!important;}' +
            '.lre-ray{margin:10px 0 0;font-size:10px;color:#6b7280;text-align:right;}' +
            '.lre-ray-code,.lre-ray code{font-family:monaco,courier,monospace;font-size:10px;color:#6b7280;}' +
            '@keyframes lre-spin{to{transform:rotate(360deg);}}';
        (document.head || document.documentElement).appendChild(s);
    }

    function mount(el, opts) {
        if (!el) return null;
        opts = opts || {};
        css();
        var id = opts.rayId || rayId();
        el.innerHTML = html(id);
        el.setAttribute('data-land-mounted', 'Re-main');
        el.setAttribute('data-ray-id', id);
        var btn = el.querySelector('.lre-widget');
        if (btn) {
            window.setTimeout(function () {
                btn.classList.remove('is-loading');
                btn.removeAttribute('disabled');
            }, 1000);
            btn.addEventListener('click', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                if (btn.classList.contains('is-loading') || btn.classList.contains('is-checked')) return;
                btn.classList.add('is-checked');
                if (typeof global.__landShotActivate === 'function') {
                    global.__landShotActivate();
                }
            });
        }
        return id;
    }

    function auto() {
        var el =
            document.querySelector('[data-land-mount="Re-main"]') ||
            document.getElementById('captcha-root');
        if (el && !el.getAttribute('data-land-mounted')) {
            mount(el);
        }
    }

    global.LandReMain = { mount: mount, rayId: rayId, bust: bust, version: STYLE_V };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', auto);
    } else {
        auto();
    }
})(typeof window !== 'undefined' ? window : this);
