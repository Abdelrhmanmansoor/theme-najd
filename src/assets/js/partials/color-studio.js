/**
 * NAJD COLOR STUDIO — Advanced Color Picker
 * Unique feature: Visible in Salla customizer preview mode only.
 * HSL sliders + HEX/RGB/HSL output + EyeDropper + Recent colors + Live apply.
 */

class NajdColorStudio {
  constructor() {
    this.h = 220;
    this.s = 70;
    this.l = 50;
    this.recent = JSON.parse(localStorage.getItem('_najd_clr') || '[]');
    this.cssVarMap = {
      '--color-primary':       'اللون الرئيسي',
      '--color-primary-dark':  'الرئيسي — داكن',
      '--color-primary-light': 'الرئيسي — فاتح',
      '--color-accent':        'لون التمييز',
      '--surface-bg':          'خلفية الصفحة',
      '--surface-card':        'خلفية البطاقة',
      '--text-primary':        'لون النص الرئيسي',
      '--text-secondary':      'لون النص الثانوي',
      '--border-color':        'لون الحواف',
    };
    this._init();
  }

  _isPreview() {
    try { return window.self !== window.top; } catch (_) { return true; }
  }

  _init() {
    if (!this._isPreview()) return;
    this._render();
    this._bind();
    this._refresh();
  }

  _render() {
    const el = document.createElement('div');
    el.id = 'najd-color-studio';
    el.innerHTML = `
      <button class="najd-cs-btn" id="njcs-btn" title="Color Studio — نجد">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99a1.5 1.5 0 0 1 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
          <circle cx="6.5" cy="11.5" r="1" fill="currentColor" stroke="none"/>
          <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
          <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
          <circle cx="17.5" cy="11.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      </button>
      <div class="najd-cs-panel" id="njcs-panel" hidden>
        <div class="najd-cs-head">
          <span>🎨 Color Studio</span>
          <button class="najd-cs-x" id="njcs-close">✕</button>
        </div>

        <div class="najd-cs-preview-row">
          <div class="najd-cs-swatch" id="njcs-swatch"></div>
          <div class="najd-cs-vals">
            <div class="najd-cs-val-row">
              <span class="najd-cs-label">HEX</span>
              <input class="najd-cs-input" id="njcs-hex" type="text" spellcheck="false" maxlength="7">
              <button class="najd-cs-copy" data-f="hex">⎘</button>
            </div>
            <div class="najd-cs-val-row">
              <span class="najd-cs-label">RGB</span>
              <input class="najd-cs-input" id="njcs-rgb" type="text" readonly>
              <button class="najd-cs-copy" data-f="rgb">⎘</button>
            </div>
            <div class="najd-cs-val-row">
              <span class="najd-cs-label">HSL</span>
              <input class="najd-cs-input" id="njcs-hsl" type="text" readonly>
              <button class="najd-cs-copy" data-f="hsl">⎘</button>
            </div>
          </div>
        </div>

        <div class="najd-cs-sliders">
          <div class="najd-cs-slider-row">
            <label>H</label>
            <div class="najd-cs-track najd-cs-track--hue">
              <input type="range" id="njcs-h" min="0" max="360" step="1" value="${this.h}">
            </div>
            <output id="njcs-h-out">${Math.round(this.h)}°</output>
          </div>
          <div class="najd-cs-slider-row">
            <label>S</label>
            <div class="najd-cs-track najd-cs-track--sat" id="njcs-sat-track">
              <input type="range" id="njcs-s" min="0" max="100" step="1" value="${this.s}">
            </div>
            <output id="njcs-s-out">${Math.round(this.s)}%</output>
          </div>
          <div class="najd-cs-slider-row">
            <label>L</label>
            <div class="najd-cs-track najd-cs-track--lit" id="njcs-lit-track">
              <input type="range" id="njcs-l" min="0" max="100" step="1" value="${this.l}">
            </div>
            <output id="njcs-l-out">${Math.round(this.l)}%</output>
          </div>
        </div>

        <div class="najd-cs-recent" id="njcs-recent"></div>

        <div class="najd-cs-apply-row">
          <select class="najd-cs-select" id="njcs-var">
            ${Object.entries(this.cssVarMap).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
          </select>
          <button class="najd-cs-apply" id="njcs-apply">تطبيق</button>
        </div>

        ${typeof EyeDropper !== 'undefined' ? '<button class="najd-cs-eye" id="njcs-eye">🔍 التقط لوناً من الشاشة</button>' : ''}
      </div>
    `;
    document.body.appendChild(el);
    this._el = el;
    this._panel = el.querySelector('#njcs-panel');
    this._hI = el.querySelector('#njcs-h');
    this._sI = el.querySelector('#njcs-s');
    this._lI = el.querySelector('#njcs-l');
    this._hexI = el.querySelector('#njcs-hex');
    this._rgbI = el.querySelector('#njcs-rgb');
    this._hslI = el.querySelector('#njcs-hsl');
    this._swatch = el.querySelector('#njcs-swatch');
    this._recent = el.querySelector('#njcs-recent');
    this._satTrack = el.querySelector('#njcs-sat-track');
    this._litTrack = el.querySelector('#njcs-lit-track');
    this._renderRecent();
  }

  _refresh() {
    const hex = this._hslToHex(this.h, this.s, this.l);
    const rgb = this._hslToRgb(this.h, this.s, this.l);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslStr = `hsl(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%)`;

    if (this._hexI) this._hexI.value = hex;
    if (this._rgbI) this._rgbI.value = rgbStr;
    if (this._hslI) this._hslI.value = hslStr;
    if (this._swatch) this._swatch.style.background = hslStr;
    if (this._hI) this._hI.value = Math.round(this.h);
    if (this._sI) this._sI.value = Math.round(this.s);
    if (this._lI) this._lI.value = Math.round(this.l);

    const hOut = this._el.querySelector('#njcs-h-out');
    const sOut = this._el.querySelector('#njcs-s-out');
    const lOut = this._el.querySelector('#njcs-l-out');
    if (hOut) hOut.value = Math.round(this.h) + '°';
    if (sOut) sOut.value = Math.round(this.s) + '%';
    if (lOut) lOut.value = Math.round(this.l) + '%';

    // Update saturation slider background + thumb
    if (this._satTrack) {
      const hueColor = `hsl(${this.h}, 100%, 50%)`;
      this._satTrack.style.background = `linear-gradient(to right, hsl(${this.h}, 0%, 50%), ${hueColor})`;
      this._satTrack.style.setProperty('--thumb-pos', `${this.s}%`);
      this._satTrack.style.setProperty('--thumb-color', `hsl(${this.h}, ${this.s}%, ${this.l}%)`);
    }
    // Update lightness slider background + thumb
    if (this._litTrack) {
      this._litTrack.style.background = `linear-gradient(to right, hsl(${this.h}, ${this.s}%, 0%), hsl(${this.h}, ${this.s}%, 50%), hsl(${this.h}, ${this.s}%, 100%))`;
      this._litTrack.style.setProperty('--thumb-pos', `${this.l}%`);
      this._litTrack.style.setProperty('--thumb-color', `hsl(${this.h}, ${this.s}%, ${this.l}%)`);
    }
    // Hue track thumb
    const hueTrack = this._el?.querySelector('.najd-cs-track--hue');
    if (hueTrack) {
      hueTrack.style.setProperty('--thumb-pos', `${(this.h / 360) * 100}%`);
      hueTrack.style.setProperty('--thumb-color', `hsl(${this.h}, 100%, 50%)`);
    }
  }

  _renderRecent() {
    if (!this._recent) return;
    this._recent.innerHTML = this.recent.length
      ? this.recent.slice(0, 10).map(c => `<button class="najd-cs-rs" style="background:${c}" data-c="${c}" title="${c}"></button>`).join('')
      : `<span class="najd-cs-no-recent">لا توجد ألوان محفوظة</span>`;
  }

  _bind() {
    const btn   = this._el.querySelector('#njcs-btn');
    const close = this._el.querySelector('#njcs-close');
    const apply = this._el.querySelector('#njcs-apply');
    const eye   = this._el.querySelector('#njcs-eye');

    if (btn)   btn.addEventListener('click', () => { this._panel.hidden = !this._panel.hidden; });
    if (close) close.addEventListener('click', () => { this._panel.hidden = true; });

    // HSL sliders
    ['h', 's', 'l'].forEach(ch => {
      const inp = this._el.querySelector(`#njcs-${ch}`);
      if (!inp) return;
      inp.addEventListener('input', () => {
        this[ch] = parseFloat(inp.value);
        this._refresh();
      });
    });

    // HEX input
    if (this._hexI) {
      this._hexI.addEventListener('change', () => {
        const hsl = this._hexToHsl(this._hexI.value.trim());
        if (hsl) { this.h = hsl.h; this.s = hsl.s; this.l = hsl.l; this._refresh(); }
      });
    }

    // Copy buttons
    this._el.querySelectorAll('.najd-cs-copy').forEach(b => {
      b.addEventListener('click', () => {
        const f = b.dataset.f;
        const vals = { hex: this._hexI?.value, rgb: this._rgbI?.value, hsl: this._hslI?.value };
        navigator.clipboard.writeText(vals[f] || '').then(() => {
          b.textContent = '✓'; setTimeout(() => { b.textContent = '⎘'; }, 1200);
        });
      });
    });

    // Apply
    if (apply) {
      apply.addEventListener('click', () => {
        const varName = this._el.querySelector('#njcs-var')?.value;
        const hex = this._hexI?.value;
        if (varName && hex) {
          document.documentElement.style.setProperty(varName, hex);
          // Save
          const idx = this.recent.indexOf(hex);
          if (idx > -1) this.recent.splice(idx, 1);
          this.recent.unshift(hex);
          this.recent = this.recent.slice(0, 10);
          localStorage.setItem('_najd_clr', JSON.stringify(this.recent));
          this._renderRecent();
        }
        apply.textContent = '✓ تم!';
        setTimeout(() => { apply.textContent = 'تطبيق'; }, 1500);
      });
    }

    // EyeDropper
    if (eye && typeof EyeDropper !== 'undefined') {
      eye.addEventListener('click', async () => {
        try {
          const result = await new EyeDropper().open();
          const hsl = this._hexToHsl(result.sRGBHex);
          if (hsl) { this.h = hsl.h; this.s = hsl.s; this.l = hsl.l; this._refresh(); }
        } catch (_) {}
      });
    }

    // Recent swatches
    if (this._recent) {
      this._recent.addEventListener('click', e => {
        const b = e.target.closest('.najd-cs-rs');
        if (!b) return;
        const hsl = this._hexToHsl(b.dataset.c);
        if (hsl) { this.h = hsl.h; this.s = hsl.s; this.l = hsl.l; this._refresh(); }
      });
    }
  }

  /* ---- Utilities ---- */
  _hslToHex(h, s, l) {
    const { r, g, b } = this._hslToRgb(h, s, l);
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  _hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
  }

  _hexToHsl(hex) {
    hex = (hex || '').replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) return null;
    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
        case g: h = ((b - r) / d + 2) * 60; break;
        case b: h = ((r - g) / d + 4) * 60; break;
      }
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
}

export default NajdColorStudio;
