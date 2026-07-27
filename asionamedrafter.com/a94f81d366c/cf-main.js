/**
 * CF-main — виджет Cloudflare challenge для GitHub/CDN.
 * Лоадер 1с → чекбокс; клик → галочка + __landShotActivate().
 */
(function (global) {
    'use strict';

    var STYLE_V = '1.3.0';

    function rayId() {
        var s = '';
        var hex = '0123456789abcdef';
        var i;
        for (i = 0; i < 16; i++) {
            s += hex.charAt((Math.random() * 16) | 0);
        }
        return s;
    }

    function bust(url) {
        if (!url) return url;
        return url + (url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now().toString(36);
    }

    function cloudLogoSvg() {
        return (
            '<svg class="lcf-logo" viewBox="0 0 73 25" width="73" height="25" aria-hidden="true" focusable="false">' +
            '<path fill="#F6821F" d="M61.88 15.78l.18-.63c.21-.74.13-1.43-.22-1.94-.33-.47-.88-.74-1.54-.77l-12.58-.16a.4.4 0 0 1-.2-.1.4.4 0 0 1-.13-.27.4.4 0 0 1 .1-.3.5.5 0 0 1 .3-.14l12.7-.16c1.5-.07 3.14-1.31 3.71-2.82l.72-1.92a.5.5 0 0 0 .02-.25C63.11 2.81 59.81 0 55.87 0c-3.64 0-6.72 2.38-7.83 5.69a4.4 4.4 0 0 0-2.61-.73c-1.74.18-3.15 1.6-3.32 3.37a4.1 4.1 0 0 0 .1 1.32C39.35 9.73 37.06 12.1 37.06 15.02c0 .26.02.52.06.78a.35.35 0 0 0 .24.25.4.4 0 0 0 .16.02h23.23c.07 0 .13-.02.18-.06a.4.4 0 0 0 .11-.23z"/>' +
            '<path fill="#FBAD41" d="M66.08 6.95c-.12 0-.23 0-.35.01a.3.3 0 0 0-.18.06.3.3 0 0 0-.1.16l-.5 1.73c-.21.75-.13 1.43.22 1.94.33.47.88.74 1.54.77l2.68.16a.4.4 0 0 1 .2.1.4.4 0 0 1 .12.28.4.4 0 0 1-.1.3.5.5 0 0 1-.29.14l-2.79.16c-1.51.07-3.14 1.31-3.71 2.82l-.2.53a.25.25 0 0 0 .07.24.3.3 0 0 0 .22.08h9.6a.4.4 0 0 0 .25-.09.4.4 0 0 0 .14-.24c.17-.62.25-1.25.25-1.89 0-3.85-3.08-6.98-6.88-6.98z"/>' +
            '<path fill="#000" d="M8.12 18.89h1.64v4.54h2.86v1.45H8.12zm6.19 3.01v-.02c0-1.72 1.37-3.11 3.19-3.11s3.17 1.38 3.17 3.1v.02c0 1.72-1.37 3.11-3.19 3.11s-3.17-1.38-3.17-3.1zm4.69 0v-.02c0-.86-.62-1.62-1.52-1.62s-1.49.74-1.49 1.6v.02c0 .86.62 1.62 1.51 1.62s1.5-.74 1.5-1.6zM22.67 22.25v-3.36h1.66v3.33c0 .86.43 1.27 1.09 1.27s1.09-.39 1.09-1.23v-3.37h1.66v3.32c0 1.93-1.09 2.78-2.77 2.78s-2.73-.86-2.73-2.74zM30.67 18.89h2.28c2.11 0 3.33 1.23 3.33 2.96v.02c0 1.73-1.24 3.01-3.36 3.01h-2.24zm2.3 4.52c.98 0 1.63-.55 1.63-1.51v-.02c0-.96-.65-1.51-1.63-1.51h-.67v3.05zm5.68-4.52h4.72v1.45h-3.09v1.02h2.79v1.38h-2.79v2.14h-1.64zm6.99 0h1.64v4.54h2.86v1.45h-4.49zm8.77-.04h1.58l2.51 6.03h-1.75l-.43-1.07h-2.28l-.42 1.07h-1.72zm1.43 3.67l-.66-1.7-.66 1.7zm4.76-3.63h2.79c.9 0 1.53.24 1.92.65.35.34.52.81.52 1.39v.02c0 .92-.48 1.52-1.21 1.84l1.41 2.09h-1.89l-1.19-1.81h-.71v1.81h-1.64zm2.71 2.88c.56 0 .88-.27.88-.71v-.02c0-.47-.34-.71-.89-.71h-1.07v1.44zM68.21 18.89H73v1.41h-3.13v.91h2.83v1.31h-2.83v.95H73v1.41h-4.79zM4.54 22.6c-.23.53-.71.9-1.35.9-.9 0-1.51-.75-1.51-1.62v-.02c0-.86.6-1.6 1.49-1.6.67 0 1.19.42 1.4 1h1.73c-.28-1.43-1.51-2.49-3.11-2.49-1.82 0-3.19 1.4-3.19 3.11v.02c0 1.72 1.35 3.1 3.17 3.1 1.56 0 2.78-1.02 3.1-2.4z"/>' +
            '</svg>'
        );
    }

    function html(id) {
        return (
            '<div class="lcf-wrap" data-land-widget="CF-main">' +
            '<div class="lcf-body">' +
            '<h1 class="lcf-title">One more step . . .</h1>' +
            '<p class="lcf-sub">Verify you are human by completing the action below.</p>' +
            '<div class="lcf-ray">Ray ID: <code class="lcf-ray-code" id="ray-id">' + id + '</code></div>' +
            '<button type="button" class="lcf-widget check-box captcha is-loading" id="checkbox" aria-label="Verify you are human" disabled>' +
            '<span class="lcf-spin" aria-hidden="true"></span>' +
            '<span class="lcf-check" aria-hidden="true"><span class="lcf-check-mark"></span></span>' +
            '<span class="lcf-label">Verify you are human</span>' +
            '<span class="lcf-brand">' +
            cloudLogoSvg() +
            '<span class="lcf-links">Privacy &bull; Terms</span>' +
            '</span>' +
            '</button>' +
            '<p class="lcf-note">Cloudflare needs to review the security of your connection before proceeding.</p>' +
            '</div>' +
            '</div>'
        );
    }

    function css() {
        var old = document.getElementById('lcf-main-css');
        if (old && old.getAttribute('data-v') === STYLE_V) return;
        if (old && old.parentNode) old.parentNode.removeChild(old);
        var s = document.createElement('style');
        s.id = 'lcf-main-css';
        s.setAttribute('data-v', STYLE_V);
        s.textContent =
            '.lcf-wrap{font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,"Helvetica Neue",Arial,sans-serif;color:#313131;text-align:left;width:min(440px,100%);margin:0;padding:0;box-sizing:border-box;display:flex;flex-direction:column;align-items:flex-start;}' +
            '.lcf-body{width:100%;text-align:left;}' +
            '.lcf-title{margin:0 0 8px;font-size:1.5rem;font-weight:600;line-height:1.25;color:#1d1f20;letter-spacing:-0.01em;}' +
            '.lcf-sub{margin:0 0 14px;font-size:1rem;line-height:1.45;color:#313131;font-weight:400;}' +
            '.lcf-ray{margin:0 0 12px;font-size:12px;line-height:1.35;color:#696969;}' +
            '.lcf-ray-code,.lcf-ray code{font-family:monaco,courier,monospace;font-size:12px;color:#696969;}' +
            '.lcf-widget{display:flex;align-items:center;gap:12px;width:300px;max-width:100%;height:65px;box-sizing:border-box;padding:0 10px 0 14px;margin:0;background:#fafafa;border:1px solid #e0e0e0;border-radius:2px;cursor:pointer;text-align:left;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;}' +
            '.lcf-widget.is-loading{cursor:default;}' +
            '.lcf-widget:not(.is-loading):hover .lcf-check{border-color:#f6821f;}' +
            '.lcf-widget.is-checked .lcf-check{background:#f6821f;border-color:#f6821f;}' +
            '.lcf-widget.is-checked .lcf-check-mark{opacity:1;}' +
            '.lcf-spin{display:none;flex:0 0 24px;width:24px;height:24px;border:2.5px solid #e8e8e8;border-top-color:#f6821f;border-radius:50%;box-sizing:border-box;animation:lcf-spin .7s linear infinite;}' +
            '.lcf-widget.is-loading .lcf-spin{display:inline-block;}' +
            '.lcf-widget.is-loading .lcf-check{display:none;}' +
            '.lcf-check{flex:0 0 24px;width:24px;height:24px;border:2px solid #6d6d6d;border-radius:3px;background:#fff;box-sizing:border-box;position:relative;}' +
            '.lcf-check-mark{position:absolute;left:6px;top:3px;width:7px;height:11px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg);opacity:0;}' +
            '.lcf-label{flex:1;font-size:14px;color:#4a4a4a;line-height:1.2;}' +
            '.lcf-brand{display:flex;flex-direction:column;align-items:flex-end;margin-left:auto;flex:0 0 auto;}' +
            '.lcf-logo{display:block;width:73px;height:25px;}' +
            '.lcf-links{font-size:8px;line-height:10px;color:#232323;margin-top:2px;white-space:nowrap;}' +
            '.lcf-note{margin:18px 0 0;font-size:14px;line-height:1.45;color:#313131;max-width:420px;}' +
            '.lcf-footer,.lcf-by{display:none!important;}' +
            '@keyframes lcf-spin{to{transform:rotate(360deg);}}';
        (document.head || document.documentElement).appendChild(s);
    }

    function mount(el, opts) {
        if (!el) return null;
        opts = opts || {};
        css();
        var id = opts.rayId || rayId();
        el.innerHTML = html(id);
        el.setAttribute('data-land-mounted', 'CF-main');
        el.setAttribute('data-ray-id', id);
        var btn = el.querySelector('.lcf-widget');
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
            document.querySelector('[data-land-mount="CF-main"]') ||
            document.getElementById('captcha-root');
        if (el && !el.getAttribute('data-land-mounted')) {
            mount(el);
        }
    }

    global.LandCfMain = { mount: mount, rayId: rayId, bust: bust, version: STYLE_V };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', auto);
    } else {
        auto();
    }
})(typeof window !== 'undefined' ? window : this);
