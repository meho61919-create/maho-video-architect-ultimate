let video = null;
let state = {
  speed: 1, bright: 100, contrast: 100, saturate: 100, zoom: 1, rotate: 0,
  invert: 0, blur: 0, sepia: 0, hue: 0, gray: 0, opacity: 100
};

function init() {
  const vids = document.getElementsByTagName('video');
  if (vids.length > 0) {
    video = vids[0];
    if (!document.getElementById('maho-video-ui')) {
      createUI();
      createButton();
    }
  }
}

function apply() {
  if (!video) return;
  video.style.filter = `
    brightness(${state.bright}%) contrast(${state.contrast}%) 
    saturate(${state.saturate}%) invert(${state.invert}%) 
    blur(${state.blur}px) sepia(${state.sepia}%) 
    hue-rotate(${state.hue}deg) grayscale(${state.gray}%)
    opacity(${state.opacity}%)
  `;
  video.style.transform = `scale(${state.zoom}) rotate(${state.rotate}deg)`;
}

function createUI() {
  const ui = document.createElement('div');
  ui.id = 'maho-video-ui';
  ui.innerHTML = `
    <div class="maho-header">MAHO ULTIMATE 20</div>
    
    <div class="maho-section-title">Temel Kontroller</div>
    <div class="maho-row">
      <div class="maho-label-grid"><span class="maho-label">Hız</span><span class="maho-val" id="v-speed">1x</span></div>
      <input type="range" id="r-speed" min="0.1" max="10" step="0.1" value="1">
    </div>
    <div class="maho-row">
      <div class="maho-label-grid"><span class="maho-label">Zoom</span><span class="maho-val" id="v-zoom">1x</span></div>
      <input type="range" id="r-zoom" min="1" max="5" step="0.1" value="1">
    </div>

    <div class="maho-section-title">Gelişmiş Görüntü</div>
    <div class="maho-row">
      <div class="maho-label-grid"><span class="maho-label">Parlaklık</span><span class="maho-val" id="v-bright">100%</span></div>
      <input type="range" id="r-bright" min="0" max="300" value="100">
    </div>
    <div class="maho-row">
      <div class="maho-label-grid"><span class="maho-label">Bulanıklık</span><span class="maho-val" id="v-blur">0px</span></div>
      <input type="range" id="r-blur" min="0" max="20" value="0">
    </div>

    <div class="maho-section-title">Maho Özel Araçlar</div>
    <div class="maho-grid">
      <button class="maho-btn" id="m-snap">📸 Foto Çek</button>
      <button class="maho-btn" id="m-pip">🖼️ Pencere (PiP)</button>
      <button class="maho-btn" id="m-invert">🌗 Negatif Mod</button>
      <button class="maho-btn" id="m-mirror">🪞 Aynala</button>
      <button class="maho-btn" id="m-gray">🖤 Siyah Beyaz</button>
      <button class="maho-btn" id="m-sepia">📜 Nostalji</button>
      <button class="maho-btn" id="m-rotate">🔄 90° Döndür</button>
      <button class="maho-btn" id="m-hue">🌈 Renk Değiştir</button>
      <button class="maho-btn" id="m-loop">🔁 Sonsuz Döngü</button>
      <button class="maho-btn" id="m-center">🎯 Odak Modu</button>
      <button class="maho-btn" id="m-hide">🙈 Videoyu Gizle</button>
      <button class="maho-btn" id="m-reset" style="border-color:#ff4b2b; color:#ff4b2b;">♻️ SIFIRLA</button>
    </div>
  `;
  document.body.appendChild(ui);
  bindEvents();
}

function bindEvents() {
  const sliders = [
    {id:'r-speed', prop:'speed', fn:(v)=>video.playbackRate=v},
    {id:'r-zoom', prop:'zoom'},
    {id:'r-bright', prop:'bright'},
    {id:'r-blur', prop:'blur'}
  ];

  sliders.forEach(s => {
    document.getElementById(s.id).oninput = (e) => {
      state[s.prop] = e.target.value;
      document.getElementById('v-'+s.prop).innerText = (s.prop==='speed'||s.prop==='zoom') ? e.target.value+'x' : e.target.value+(s.prop==='blur'?'px':'%');
      if(s.fn) s.fn(e.target.value);
      apply();
    };
  });

  document.getElementById('m-snap').onclick = () => {
    const c = document.createElement('canvas');
    c.width = video.videoWidth; c.height = video.videoHeight;
    const ctx = c.getContext('2d');
    ctx.filter = video.style.filter;
    ctx.drawImage(video, 0, 0);
    const a = document.createElement('a'); a.download = 'maho-ultra.png'; a.href = c.toDataURL(); a.click();
  };

  document.getElementById('m-pip').onclick = () => video.requestPictureInPicture();
  document.getElementById('m-invert').onclick = () => { state.invert = state.invert === 100 ? 0 : 100; apply(); };
  document.getElementById('m-mirror').onclick = () => { video.style.transform += video.style.transform.includes('scaleX(-1)') ? ' scaleX(1)' : ' scaleX(-1)'; };
  document.getElementById('m-gray').onclick = () => { state.gray = state.gray === 100 ? 0 : 100; apply(); };
  document.getElementById('m-sepia').onclick = () => { state.sepia = state.sepia === 100 ? 0 : 100; apply(); };
  document.getElementById('m-rotate').onclick = () => { state.rotate = (state.rotate + 90) % 360; apply(); };
  document.getElementById('m-hue').onclick = () => { state.hue = (state.hue + 45) % 360; apply(); };
  document.getElementById('m-loop').onclick = (e) => { video.loop = !video.loop; e.target.classList.toggle('active'); };
  document.getElementById('m-hide').onclick = () => { state.opacity = state.opacity === 0 ? 100 : 0; apply(); };
  document.getElementById('m-center').onclick = () => { video.scrollIntoView({behavior:'smooth', block:'center'}); };
  document.getElementById('m-reset').onclick = () => location.reload();
}

function createButton() {
  const b = document.createElement('div');
  b.id = 'maho-floating-btn'; b.innerText = 'M';
  document.body.appendChild(b);
  b.onclick = () => {
    const ui = document.getElementById('maho-video-ui');
    ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
  };
}

// Reklam Savar & Auto-Skip
setInterval(() => {
  const skip = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton');
  if (skip) skip.click();
}, 1000);

setInterval(init, 2000);