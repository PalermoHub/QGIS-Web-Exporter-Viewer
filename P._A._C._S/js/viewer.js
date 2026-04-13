// ═══════════════════════════════════════════════════════════════════
// MAPPA
// ═══════════════════════════════════════════════════════════════════
const map = L.map('map', { zoomControl: false, minZoom: 13, maxZoom: 18 });
const MAP_CONFIG = {"popupHover": false, "highlightHover": false, "minZoom": 13, "maxZoom": 18, "restrictExtent": false, "showTable": true, "showAnalysis": true, "showCoords": true, "coordsPosition": "bottomleft", "showScale": true, "scalePosition": "bottomright", "homeBbox": null, "limitBbox": null};
const POPUP_FIELDS   = {"Tipologia edilizia": ["ID_ue", "tipologia_edilizia", "modalit\u00e0_intervento"], "Modalit\u00e0 Intervento": ["ID_ue", "tipologia_edilizia", "modalit\u00e0_intervento"]};
const TOOLTIP_FIELDS = {"Tipologia edilizia": ["ID_ue"]};
const PANEL_FIELDS   = {"Tipologia edilizia": ["Crcoscrizione", "Quartiere", "UPL_nome", "fid", "ID_ue", "FA_ID_Type", "tipo_poligono", "tipologia_edilizia", "Tipologia_Mista", "modalit\u00e0_intervento", "Zona_F", "Zona_FICV", "Piano_precedente", "Destinazione", "Modificato", "Note_variazione", "Superfetazioni", "Riqualificare", "Incongruenza", "P_F_Soprintendenza", "Progetto", "tipologia_edilizia_stampa", "Altezza_media_pacs", "Altezza_cod", "Volume_pacs", "Note_interne", "Superficie", "Indirizzo", "Num_Civico", "Foglio", "Consistenza", "Volume", "Altezza_media"], "Modalit\u00e0 Intervento": ["fid", "ID_ue", "FA_ID_Type", "tipo_poligono", "tipologia_edilizia", "Tipologia_Mista", "modalit\u00e0_intervento", "Zona_F", "Zona_FICV", "Piano_precedente", "Destinazione", "Modificato", "Note_variazione", "Superfetazioni", "Riqualificare", "Incongruenza", "P_F_Soprintendenza", "Progetto", "tipologia_edilizia_stampa", "Altezza_media_pacs", "Altezza_cod", "Volume_pacs", "Note_interne", "Superficie", "Indirizzo", "Num_Civico", "Foglio", "Consistenza", "Volume", "Altezza_media", "UPL_nome", "Quartiere", "Crcoscrizione"]};
const LABEL_FIELDS   = {};
const CLUSTER_CONFIG  = {};
const HEATMAP_CONFIG  = null;
const MINIMAP_CONFIG  = {"enabled": true, "position": "bottomright", "width": 150, "height": 150, "zoomOffset": -5, "toggleDisplay": true, "minimized": false};

const BASEMAPS_CONFIG = [
  { key: "carto", label: "CartoDB Chiaro", isDefault: true,
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", thumbnail: "https://a.basemaps.cartocdn.com/light_all/2/2/1.png",
    layer: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OSM</a> &copy; <a href=\"https://carto.com/\">CARTO</a>", maxZoom: 19, subdomains: "abcd" }) },
  { key: "carto_dark", label: "CartoDB Scuro", isDefault: false,
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", thumbnail: "https://a.basemaps.cartocdn.com/dark_all/2/2/1.png",
    layer: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OSM</a> &copy; <a href=\"https://carto.com/\">CARTO</a>", maxZoom: 19, subdomains: "abcd" }) },
  { key: "osm", label: "OpenStreetMap", isDefault: false,
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", thumbnail: "https://tile.openstreetmap.org/2/2/1.png",
    layer: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors", maxZoom: 19 }) },
  { key: "google_satellite", label: "Google Satellite", isDefault: false,
    url: "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", thumbnail: "https://mt0.google.com/vt/lyrs=s&x=2&y=1&z=2",
    layer: L.tileLayer("https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", { attribution: "&copy; <a href=\"https://maps.google.com\">Google Maps</a>", maxZoom: 20, subdomains: "0123" }) }
];

let activeBasemap = (BASEMAPS_CONFIG.find(b => b.isDefault) || BASEMAPS_CONFIG[0]).layer.addTo(map);
activeBasemap.bringToBack();

L.Control.BasemapGallery = L.Control.extend({
  options: { position: "topright" },
  onAdd: function(map) {
    const c = L.DomUtil.create("div", "basemap-gallery bm-horizontal");
    L.DomEvent.disableClickPropagation(c);
    L.DomEvent.disableScrollPropagation(c);
    BASEMAPS_CONFIG.forEach(function(bm) {
      const item = L.DomUtil.create("div", "bm-item bm-circle" + (bm.isDefault ? " active" : ""), c);
      item.title = bm.label;
      const img = L.DomUtil.create("img", "bm-thumb", item);
      img.src = bm.thumbnail; img.alt = bm.label;
      img.onerror = function() { img.style.display = "none"; item.style.background = "#ddd"; };
      const lbl = L.DomUtil.create("span", "bm-label", item);
      lbl.textContent = bm.label;
      item.addEventListener("click", function() {
        map.removeLayer(activeBasemap);
        activeBasemap = bm.layer.addTo(map);
        activeBasemap.bringToBack();
        c.querySelectorAll(".bm-item").forEach(function(el) { el.classList.remove("active"); });
        item.classList.add("active");
      });
    });
    return c;
  }
});
new L.Control.BasemapGallery().addTo(map);



// Contributors aggiuntivi nella barra di attribuzione
(function() {
  const extra = "@gbvitrano";
  if (extra) map.attributionControl.addAttribution(extra);
})();

// ═══════════════════════════════════════════════════════════════════
// STATO
// ═══════════════════════════════════════════════════════════════════
const leafletLayers = {};
const allBounds = L.latLngBounds([]);
let _charts    = [];   // [{uid, instance}, ...]
const _clusterLayers = [];      // [{name, pruneCluster, gjFallback}] — popolato durante init
let _clusterGlobalEnabled = true; // false quando l'utente disattiva il clustering dal pulsante
let _chartUid  = 0;
let _chartType = 'bar';
const _presetCharts = [];

// ═══════════════════════════════════════════════════════════════════
// STILI — pattern (doppia campitura) e tratteggi
// ═══════════════════════════════════════════════════════════════════
const _patternCache = {};

function _getOrCreatePattern(key, createFn) {
  if (!(key in _patternCache)) {
    try {
      const p = createFn();
      // Inizializzazione SINCRONA: bypassiamo map.whenReady per evitare che il
      // <pattern> SVG non esista ancora quando getStyle() restituisce fillPattern.
      // map.addPattern() usa whenReady() che può differire se map._loaded è false,
      // causando che fill="url(#id)" venga applicato prima che il <pattern> esista
      // nel DOM → il browser fallisce silenziosamente e mostra nero solido.
      map._patterns = map._patterns || {};
      map._patterns[L.stamp(p)] = p;
      p.onAdd(map);   // sincrono: crea _dom, addShapes, addDom immediatamente
      _patternCache[key] = p;
    } catch(e) {
      _patternCache[key] = null;
    }
  }
  return _patternCache[key];
}

// Restituisce true se la feature ha una categoria di stile corrispondente.
// Le feature senza corrispondenza (non tematizzate) vengono escluse dalla mappa,
// coerentemente con il comportamento del renderer QGIS categorizzato.
function _featureHasStyle(layerName, feature) {
  const styleMap = GEOSHEET.styles[layerName] || {};
  const layerDef = GEOSHEET.layers.find(l => l.name === layerName);
  const field = layerDef ? layerDef.style_field : null;
  if (!field) return true;  // layer non categorizzato → mostra tutto
  const v = String((feature.properties || {})[field] ?? '');
  return (v in styleMap) || ('__default__' in styleMap);
}

function getStyle(layerName, feature) {
  const styleMap  = GEOSHEET.styles[layerName] || {};
  const layerDef  = GEOSHEET.layers.find(l => l.name === layerName);
  const field     = layerDef ? layerDef.style_field : null;
  const val       = field ? String((feature.properties || {})[field] ?? '') : '__default__';
  const s = styleMap[val] || styleMap['__default__'] || {};
  const _geomType = feature && feature.geometry ? feature.geometry.type : '';
  const _isLine = _geomType === 'LineString' || _geomType === 'MultiLineString';
  const st = {
    color:       _isLine ? (s.color || '#3388ff') : (s.outline || s.color || '#3388ff'),
    weight:      _isLine ? (s.size != null && s.size > 0 ? s.size : 1.5) : 1.5,
    opacity:     0.9,
    fillColor:   s.color  || '#3388ff',
    fillOpacity: s.opacity != null ? s.opacity : 0.6,
  };
  // Tratteggio linee/contorni
  if (s.dash_array) st.dashArray = s.dash_array;
  // Doppia campitura via SVG pattern inline (blocco <svg> nascosto iniettato nell'HTML da Python).
  // Approccio diretto: fill="url(#pid)" → risolto nel document scope → zero problemi di timing DOM.
  // Fallback Leaflet.pattern mantenuto per compatibilità con mappe legacy senza pattern_svg_id.
  if (s.pattern_tipo) {
    if (s.pattern_svg_id) {
      // ── Approccio primario: SVG <pattern> inline generato in Python ──
      // Leaflet applica fillColor come attributo fill sul path SVG.
      // Il browser risolve url(#id) nel document scope → trova il <pattern> nel <svg> nascosto.
      st.fillColor   = 'url(#' + s.pattern_svg_id + ')';
      st.fillOpacity = 1;
    } else if (typeof L.Pattern !== 'undefined') {
      // ── Fallback Leaflet.pattern (mappe esportate senza pattern_svg_id) ──
      const pKey  = layerName + '\x01' + val;
      const bgOp  = s.opacity != null ? s.opacity : 0.6;
      const pCol  = s.pattern_colore || '#333333';
      const bCol  = s.color || '#3388ff';
      const angle = s.pattern_angolo != null ? s.pattern_angolo : 45;
      const sp    = 8;
      const dashA = s.pattern_dash_array || null;
      const hasBg = bgOp > 0.02;
      let pat = null;

      if (s.pattern_tipo === 'strisce' || s.pattern_tipo === 'incroci') {
        const half = sp / 2;
        const lineD = s.pattern_tipo === 'incroci'
          ? ('M 0,' + half + ' L ' + sp + ',' + half + ' M ' + half + ',0 L ' + half + ',' + sp)
          : ('M 0,' + half + ' L ' + sp + ',' + half);
        const lineShape = {
          type: 'path', d: lineD,
          stroke: true, color: pCol, weight: 1.5, opacity: 0.9,
          fill: false, lineCap: 'square'
        };
        if (dashA) lineShape.dashArray = dashA;
        const shapes = hasBg
          ? [{ type: 'rect', x: 0, y: 0, width: sp, height: sp,
               stroke: false, fill: true, fillColor: bCol, fillOpacity: bgOp }, lineShape]
          : [lineShape];
        pat = _getOrCreatePattern(pKey, () => L.compositePattern({
          width: sp, height: sp, angle: angle, shapes: shapes
        }));
      } else if (s.pattern_tipo === 'punti') {
        const shapes2 = hasBg
          ? [{ type: 'rect', x: 0, y: 0, width: sp, height: sp,
               stroke: false, fill: true, fillColor: bCol, fillOpacity: bgOp },
             { type: 'circle', x: sp/2, y: sp/2, radius: 2,
               stroke: false, fill: true, fillColor: pCol, fillOpacity: 0.9 }]
          : [{ type: 'circle', x: sp/2, y: sp/2, radius: 2,
               stroke: false, fill: true, fillColor: pCol, fillOpacity: 0.9 }];
        pat = _getOrCreatePattern(pKey, () => L.compositePattern({
          width: sp, height: sp, angle: 0, shapes: shapes2
        }));
      } else if (s.pattern_tipo === 'strisce+punti' || s.pattern_tipo === 'incroci+punti') {
        const baseType2 = s.pattern_tipo.split('+')[0];
        const half2 = sp / 2;
        const lineD2 = baseType2 === 'incroci'
          ? ('M 0,' + half2 + ' L ' + sp + ',' + half2 + ' M ' + half2 + ',0 L ' + half2 + ',' + sp)
          : ('M 0,' + half2 + ' L ' + sp + ',' + half2);
        const pCol2 = s.pattern_colore2 || pCol;
        const lineShape2 = {
          type: 'path', d: lineD2,
          stroke: true, color: pCol, weight: 1.5, opacity: 0.9,
          fill: false, lineCap: 'square'
        };
        if (dashA) lineShape2.dashArray = dashA;
        const shapes3 = [];
        if (hasBg) shapes3.push({ type: 'rect', x: 0, y: 0, width: sp, height: sp,
          stroke: false, fill: true, fillColor: bCol, fillOpacity: bgOp });
        shapes3.push(lineShape2);
        shapes3.push({ type: 'circle', x: sp/2, y: sp/2, radius: 1.5,
          stroke: false, fill: true, fillColor: pCol2, fillOpacity: 0.9 });
        pat = _getOrCreatePattern(pKey, () => L.compositePattern({
          width: sp, height: sp, angle: angle, shapes: shapes3
        }));
      }

      if (pat) {
        st.fill        = !_isLine;
        st.fillPattern = pat;
        st.fillOpacity = 1;
      }
    }
  }
  return st;
}

function _buildMarkerSvg(s) {
  // Costruisce un SVG per il marker punto.
  // Se s.ml2_forma è impostato, aggiunge un secondo cerchio/forma come corona/anello.
  const r    = s.size != null ? Math.max(4, s.size) : 8;
  const fill = s.color   || '#3388ff';
  const strk = s.outline || s.color || '#3388ff';
  const op   = s.opacity != null ? s.opacity : 0.7;

  if (s.ml2_forma) {
    // Doppio layer: outer (ml2) sotto, inner (punto principale) sopra
    const r2   = s.ml2_dim && s.ml2_dim > 0 ? Math.max(r + 2, s.ml2_dim / 2) : r * 1.8;
    const pad  = 2;
    const tot  = Math.ceil(r2 * 2 + pad * 2);
    const cx   = tot / 2;

    let outerSvg = '';
    if (s.ml2_riemp === 'no') {
      // Anello vuoto
      const sc = s.ml2_cont || s.ml2_colore || fill;
      outerSvg = '<circle cx="' + cx + '" cy="' + cx + '" r="' + (r2 - 0.5) + '" '
               + 'fill="none" stroke="' + sc + '" stroke-width="1.5" stroke-opacity="0.9"/>';
    } else {
      const fc = s.ml2_colore || fill;
      const sc = s.ml2_cont || fc;
      outerSvg = '<circle cx="' + cx + '" cy="' + cx + '" r="' + (r2 - 0.5) + '" '
               + 'fill="' + fc + '" fill-opacity="' + op + '" '
               + 'stroke="' + sc + '" stroke-width="1" stroke-opacity="0.9"/>';
    }
    const innerSvg = '<circle cx="' + cx + '" cy="' + cx + '" r="' + (r - 0.5) + '" '
                   + 'fill="' + fill + '" fill-opacity="' + op + '" '
                   + 'stroke="' + strk + '" stroke-width="0.8" stroke-opacity="0.9"/>';
    return {
      html: '<svg width="' + tot + '" height="' + tot + '" viewBox="0 0 ' + tot + ' ' + tot
          + '" xmlns="http://www.w3.org/2000/svg">' + outerSvg + innerSvg + '</svg>',
      size: tot, anchor: cx,
    };
  }
  // Simbolo semplice
  const d = r * 2;
  return {
    html: '<svg width="' + d + '" height="' + d + '" viewBox="0 0 ' + d + ' ' + d
        + '" xmlns="http://www.w3.org/2000/svg">'
        + '<circle cx="' + r + '" cy="' + r + '" r="' + (r - 0.5) + '" '
        + 'fill="' + fill + '" fill-opacity="' + op + '" '
        + 'stroke="' + strk + '" stroke-width="1" stroke-opacity="0.9"/></svg>',
    size: d, anchor: r,
  };
}

function pointToLayer(layerName, feature, latlng) {
  const styleMap = GEOSHEET.styles[layerName] || {};
  const layerDef = GEOSHEET.layers.find(l => l.name === layerName);
  const field    = layerDef ? layerDef.style_field : null;
  const val      = field ? String((feature.properties || {})[field] ?? '') : '__default__';
  const s = styleMap[val] || styleMap['__default__'] || {};

  const useCluster = CLUSTER_CONFIG.__layers__ && CLUSTER_CONFIG.__layers__[layerName];

  // Se doppio layer oppure clustering: usa L.marker con DivIcon SVG
  if (useCluster || s.ml2_forma) {
    const m = _buildMarkerSvg(s);
    return L.marker(latlng, { icon: L.divIcon({
      html:        m.html,
      className:   '',
      iconSize:    [m.size, m.size],
      iconAnchor:  [m.anchor, m.anchor],
      popupAnchor: [0, -m.anchor],
    })});
  }
  return L.circleMarker(latlng, {
    radius:      s.size    != null ? Math.max(4, s.size) : 8,
    fillColor:   s.color   || '#3388ff',
    color:       s.outline || s.color || '#3388ff',
    weight:      1,
    opacity:     0.9,
    fillOpacity: s.opacity != null ? s.opacity : 0.7,
  });
}

// ═══════════════════════════════════════════════════════════════════
// POPUP
// ═══════════════════════════════════════════════════════════════════
const SKIP_FIELDS = new Set(['id', 'geometry', 'updated_at', 'fid']);

// ── Pannello laterale ────────────────────────────────────────────
function gspOpen(layerName, props) {
  const allowed = PANEL_FIELDS[layerName];
  const keys = (allowed && allowed.length > 0)
    ? allowed
    : Object.keys(props || {}).filter(k => !SKIP_FIELDS.has(k));
  const rows = keys
    .filter(k => !SKIP_FIELDS.has(k) && (props[k] ?? '') !== '')
    .map(k => `<tr><td>${k}</td><td>${props[k]}</td></tr>`)
    .join('');
  document.getElementById('gsp-layer').textContent = layerName;
  document.getElementById('gsp-body').innerHTML =
    `<table>${rows || '<tr><td colspan="2" style="color:#aaa">Nessun dato</td></tr>'}</table>`;
  document.getElementById('geo-side-panel').classList.add('gsp-open');
  document.getElementById('map').classList.add('gsp-active');
}
function gspClose() {
  document.getElementById('geo-side-panel').classList.remove('gsp-open');
  document.getElementById('map').classList.remove('gsp-active');
}

function makePopup(layerName, props) {
  const allowed = POPUP_FIELDS[layerName];
  const keys = allowed
    ? allowed
    : Object.keys(props || {}).filter(k => !SKIP_FIELDS.has(k));
  const rows = keys
    .filter(k => !SKIP_FIELDS.has(k) && (props[k] ?? '') !== '')
    .map(k => `<tr><td>${k}</td><td>${props[k]}</td></tr>`)
    .join('');
  const hasPanel = PANEL_FIELDS[layerName] !== undefined;
  const detailLink = hasPanel
    ? `<tr><td colspan="2" style="padding-top:5px;text-align:right">` +
      `<a href="#" class="gsp-details-link">▶ Dettagli completi</a></td></tr>`
    : '';
  return `<div class="popup-layer">${layerName}</div>` +
         `<table class="popup-tbl">${rows || '<tr><td colspan="2" style="color:#aaa">Nessun attributo</td></tr>'}${detailLink}</table>`;
}

function makeTooltip(layerName, props) {
  const allowed = TOOLTIP_FIELDS[layerName];
  if (!allowed || allowed.length === 0) return null;
  const rows = allowed
    .filter(k => !SKIP_FIELDS.has(k) && (props[k] ?? '') !== '')
    .map(k => `<tr><td style="font-weight:600;padding-right:6px;white-space:nowrap">${k}</td><td>${props[k]}</td></tr>`)
    .join('');
  return rows ? `<table style="font-size:11px;border-collapse:collapse">${rows}</table>` : null;
}

// ═══════════════════════════════════════════════════════════════════
// CARICAMENTO LAYER
// ═══════════════════════════════════════════════════════════════════

// Funzione comune per bind popup/tooltip/panel su un marker o layer
function _bindFeatureInteraction(layerName, f, l) {
  l.bindPopup(makePopup(layerName, f.properties), { maxWidth: 340 });
  const _lfCfg = LABEL_FIELDS[layerName];
  // Supporta sia il vecchio formato stringa che il nuovo {field, minZoom}
  const _lf      = _lfCfg ? (typeof _lfCfg === 'string' ? _lfCfg : _lfCfg.field)    : null;
  const _lfZoom  = _lfCfg ? (typeof _lfCfg === 'string' ? 0       : (_lfCfg.minZoom || 0)) : 0;
  if (_lf && f.properties && f.properties[_lf] != null && String(f.properties[_lf]).trim() !== '') {
    l.bindTooltip(String(f.properties[_lf]), { permanent: true, direction: 'top', className: 'gs-label' });
    // Aggiorna visibilità etichetta in base allo zoom corrente
    if (_lfZoom > 0) {
      const _updateLabelVis = function() {
        const tt = l.getTooltip && l.getTooltip();
        if (!tt) return;
        if (map.getZoom() >= _lfZoom) {
          if (!tt.isOpen()) l.openTooltip();
        } else {
          if (tt.isOpen()) l.closeTooltip();
        }
      };
      map.on('zoomend', _updateLabelVis);
      // Applica subito allo zoom iniziale (differito per attendere che il layer sia pronto)
      setTimeout(_updateLabelVis, 50);
    }
  } else {
    const ttHtml = makeTooltip(layerName, f.properties);
    if (ttHtml) l.bindTooltip(ttHtml, { sticky: true, opacity: 0.92 });
  }
  if (PANEL_FIELDS[layerName] !== undefined) {
    l.on('popupopen', () => {
      const link = l.getPopup().getElement().querySelector('.gsp-details-link');
      if (link) link.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        l.closePopup();
        gspOpen(layerName, f.properties);
      }, { once: true });
    });
  }
  if (MAP_CONFIG.popupHover) l.on('mouseover', () => l.openPopup());
  if (MAP_CONFIG.highlightHover) {
    l.on('mouseover', () => { if (l.setStyle) l.setStyle({weight:3,fillOpacity:0.85,opacity:1}); });
    l.on('mouseout',  () => { if (l.setStyle) l.setStyle(getStyle(layerName, f)); });
  }
  l.on('popupopen',  () => {
    document.getElementById('info-bar').textContent =
      `Layer: ${layerName} — ${Object.keys(f.properties || {}).filter(k => !SKIP_FIELDS.has(k)).length} attributi`;
  });
  l.on('popupclose', () => {
    document.getElementById('info-bar').textContent = 'Clicca su una feature per i dettagli';
  });
}

[...GEOSHEET.layers].reverse().forEach(layerDef => {
  try {
    const _isPoint   = layerDef.geom_type === 'Point' || layerDef.geom_type === 'MultiPoint';
    const _clEnabled = CLUSTER_CONFIG.__layers__ && CLUSTER_CONFIG.__layers__[layerDef.name];
    const _clAvail   = typeof PruneClusterForLeaflet !== 'undefined';
    const _useCluster = Boolean(_clEnabled && _isPoint && _clAvail);

    if (_useCluster) {
      // ── PruneCluster: raggruppamento con ciambella SVG per categoria ───────
      const _opts = CLUSTER_CONFIG.__opts__ || {};
      const _pruneCluster = new PruneClusterForLeaflet(_opts.radius || 120);

      // Mappa valore-stile → indice categoria (0–7) e colore corrispondente
      const _styleMap  = GEOSHEET.styles[layerDef.name] || {};
      const _catColors = [];   // _catColors[idx] = colore hex/rgb
      const _valToCat  = {};   // _valToCat[valore] = indice 0–7
      Object.keys(_styleMap).forEach(function(v, i) {
        const idx = Math.min(i, 7);
        _valToCat[v] = idx;
        _catColors[idx] = (_styleMap[v] || {}).color || '#3388ff';
      });
      if (_catColors.length === 0) _catColors[0] = '#3388ff';

      // ── Icona del cluster aggregato — ciambella SVG (usa helper _buildDonutIcon) ──
      _pruneCluster.BuildLeafletClusterIcon = function(cluster) {
        return _buildDonutIcon(_catColors, cluster);
      };

      // ── Stile e interazione del singolo marker ───────────────────────────
      _pruneCluster.PrepareLeafletMarker = function(leafletMarker, data) {
        const f     = data.feature;
        const lName = data.layerName;
        if (!f || !lName) return;
        // Aggiorna icona e interazioni solo se il feature è cambiato
        if (leafletMarker._gsFeature !== f) {
          leafletMarker._gsFeature = f;
          const _sm   = GEOSHEET.styles[lName] || {};
          const _ld   = GEOSHEET.layers.find(function(l) { return l.name === lName; });
          const _fld  = _ld ? _ld.style_field : null;
          const _val  = _fld ? String((f.properties || {})[_fld] ?? '') : '__default__';
          const _s    = _sm[_val] || _sm['__default__'] || {};
          const _m = _buildMarkerSvg(_s);
          leafletMarker.setIcon(L.divIcon({
            html:        _m.html,
            className:   '',
            iconSize:    [_m.size, _m.size],
            iconAnchor:  [_m.anchor, _m.anchor],
            popupAnchor: [0, -_m.anchor],
          }));
          leafletMarker.off();
          _bindFeatureInteraction(lName, f, leafletMarker);
        }
      };

      // Metadati per l'analisi mappa (ripristino categorie originali)
      _pruneCluster._pcMarkers  = [];
      _pruneCluster._valToCat   = _valToCat;
      _pruneCluster._catColors  = _catColors;
      _pruneCluster._styleField = layerDef.style_field || null;
      _pruneCluster._layerName  = layerDef.name;
      _pruneCluster._origBuildIcon     = _pruneCluster.BuildLeafletClusterIcon;
      _pruneCluster._origPrepareMarker = _pruneCluster.PrepareLeafletMarker;

      // Mappa inversa: indice categoria → valore originale (per tooltip ciambella)
      const _catToVal = {};
      Object.keys(_valToCat).forEach(function(v) { _catToVal[_valToCat[v]] = v; });
      _pruneCluster._catToVal = _catToVal;

      // BuildLeafletCluster — aggiunge tooltip ciambella al mouseover
      _pruneCluster._origBuildCluster = _pruneCluster.BuildLeafletCluster.bind(_pruneCluster);
      _pruneCluster.BuildLeafletCluster = function(cluster, position) {
        const m    = _pruneCluster._origBuildCluster(cluster, position);
        const html = _clusterTooltipHtml(cluster, _catColors, _catToVal);
        if (html && m && m.bindTooltip) {
          m.bindTooltip(html, { className: 'gs-cluster-tt', direction: 'top', sticky: false, opacity: 1 });
        }
        return m;
      };
      _pruneCluster._styleBuildCluster = _pruneCluster.BuildLeafletCluster;

      // ── Registra i marker assegnando la categoria dallo stile ────────────
      let _minLat = Infinity, _maxLat = -Infinity, _minLng = Infinity, _maxLng = -Infinity;
      (layerDef.geojson.features || []).forEach(function(f) {
        if (!f.geometry) return;
        if (!_featureHasStyle(layerDef.name, f)) return; // salta feature non tematizzate
        const gt     = f.geometry.type;
        const coords = gt === 'Point'      ? f.geometry.coordinates
                     : gt === 'MultiPoint' ? f.geometry.coordinates[0] : null;
        if (!coords) return;
        const pm = new PruneCluster.Marker(coords[1], coords[0]);
        pm.data.feature   = f;
        pm.data.layerName = layerDef.name;
        // Categoria basata sul campo stile → alimenta cluster.stats per la ciambella
        const _fld = layerDef.style_field;
        const _val = _fld ? String((f.properties || {})[_fld] ?? '') : '__default__';
        pm.category = _valToCat[_val] !== undefined ? _valToCat[_val] : 0;
        _pruneCluster.RegisterMarker(pm);
        _pruneCluster._pcMarkers.push(pm);
        if (coords[1] < _minLat) _minLat = coords[1];
        if (coords[1] > _maxLat) _maxLat = coords[1];
        if (coords[0] < _minLng) _minLng = coords[0];
        if (coords[0] > _maxLng) _maxLng = coords[0];
      });
      map.addLayer(_pruneCluster);
      leafletLayers[layerDef.name] = _pruneCluster;
      if (isFinite(_minLat)) {
        try { allBounds.extend([[_minLat, _minLng], [_maxLat, _maxLng]]); } catch(e) {}
      }

      // Layer geoJSON di supporto — usato sia per disable_at_zoom sia per l'analisi mappa
      const _gjFallback = L.geoJSON(layerDef.geojson, {
        filter:        function(f) { return _featureHasStyle(layerDef.name, f); },
        style:         function(f) { return getStyle(layerDef.name, f); },
        pointToLayer:  function(f, ll) { return pointToLayer(layerDef.name, f, ll); },
        onEachFeature: function(f, l) { _bindFeatureInteraction(layerDef.name, f, l); },
      });
      // Riferimenti incrociati per permettere lo switch da _applyMapAnalysis/_resetAnalysisColors
      _pruneCluster._gjFallback     = _gjFallback;
      _gjFallback._pruneCluster     = _pruneCluster;
      _gjFallback._disableAtZoom    = _opts.disable_at_zoom || null;

      // Registro globale cluster per il toggle manuale da pulsante mappa
      _clusterLayers.push({ name: layerDef.name, pruneCluster: _pruneCluster, gjFallback: _gjFallback });

      // Disabilita il raggruppamento sopra una certa soglia di zoom
      if (_opts.disable_at_zoom) {
        map.on('zoomend', function() {
          if (!_clusterGlobalEnabled) return;  // toggle manuale ha precedenza
          if (map.getZoom() >= _opts.disable_at_zoom) {
            if (map.hasLayer(_pruneCluster)) {
              map.removeLayer(_pruneCluster);
              _gjFallback.addTo(map);
              leafletLayers[layerDef.name] = _gjFallback;
            }
          } else {
            if (map.hasLayer(_gjFallback)) {
              map.removeLayer(_gjFallback);
              map.addLayer(_pruneCluster);
              leafletLayers[layerDef.name] = _pruneCluster;
            }
          }
        });
        // Applica subito allo zoom iniziale
        if (map.getZoom() >= _opts.disable_at_zoom) {
          map.removeLayer(_pruneCluster);
          _gjFallback.addTo(map);
          leafletLayers[layerDef.name] = _gjFallback;
        }
      }

    } else {
      // ── Nessun clustering: percorso standard L.geoJSON ──────────────────
      const gjLayer = L.geoJSON(layerDef.geojson, {
        filter:        f  => _featureHasStyle(layerDef.name, f),
        style:         f  => getStyle(layerDef.name, f),
        pointToLayer:  (f, ll) => pointToLayer(layerDef.name, f, ll),
        onEachFeature: (f, l) => _bindFeatureInteraction(layerDef.name, f, l),
      }).addTo(map);
      leafletLayers[layerDef.name] = gjLayer;
      try { const b = gjLayer.getBounds(); if (b.isValid()) allBounds.extend(b); } catch(e) {}
    }

  } catch(e) {
    console.warn('Errore caricamento layer', layerDef.name, e);
  }
});

// ── Heatmap layers (Leaflet.heat) ───────────────────────────────────────────
(function() {
  if (!HEATMAP_CONFIG || !HEATMAP_CONFIG.layers) return;
  if (typeof L.heatLayer === 'undefined') { console.warn('Leaflet.heat non disponibile'); return; }

  const _gradients = {
    'default': { 0.4: '#0000ff', 0.65: '#00ff00', 1: '#ff0000' },
    'heat':    { 0.0: '#ffff00', 0.5: '#ff7700', 1: '#ff0000' },
    'cool':    { 0.0: '#0000ff', 0.5: '#00ffff', 1: '#00ff00' },
    'fire':    { 0.0: '#ff0000', 0.5: '#ff7700', 1: '#ffff00' },
    'purple':  { 0.0: '#7b00ff', 0.5: '#ff00ff', 1: '#ffddff' },
  };

  function _firstCoord(geom) {
    if (!geom) return null;
    const t = geom.type;
    if (t === 'Point')      return geom.coordinates;
    if (t === 'MultiPoint') return geom.coordinates[0];
    return null;
  }

  GEOSHEET.layers.forEach(function(layerDef) {
    const lCfg = HEATMAP_CONFIG.layers[layerDef.name];
    if (!lCfg || !lCfg.enabled) return;

    const geojson = layerDef.geojson;
    if (!geojson || !geojson.features) return;

    const intensityField = (lCfg.field || '').trim();
    const pts = [];
    let maxVal = 0;

    geojson.features.forEach(function(f) {
      const coords = _firstCoord(f.geometry);
      if (!coords) return;
      let intensity = 1;
      if (intensityField && f.properties && f.properties[intensityField] != null) {
        const v = parseFloat(f.properties[intensityField]);
        if (!isNaN(v) && v > 0) { intensity = v; if (v > maxVal) maxVal = v; }
      }
      pts.push([coords[1], coords[0], intensity]);
    });

    if (pts.length === 0) return;

    // Normalizza intensità se si usa un campo numerico
    if (maxVal > 0 && intensityField) {
      for (let i = 0; i < pts.length; i++) pts[i][2] = pts[i][2] / maxVal;
    }

    const gradKey = HEATMAP_CONFIG.gradient || 'default';
    const hLayer = L.heatLayer(pts, {
      radius:     HEATMAP_CONFIG.radius  || 25,
      blur:       HEATMAP_CONFIG.blur    || 15,
      maxZoom:    18,
      max:        1.0,
      minOpacity: 0.05,
      opacity:    HEATMAP_CONFIG.opacity || 0.8,
      gradient:   _gradients[gradKey] || _gradients['default'],
    });
    // Non aggiunta alla mappa: di default la heatmap è disattivata
    leafletLayers['__heat__' + layerDef.name] = hLayer;
  });
})();

// ── Viewport filter rbush ─────────────────────────────────────────────────
// Nasconde le feature fuori dal bbox visibile sui layer con molte geometrie.
// Attivo solo su layer L.geoJSON standard (non cluster, non heatmap).
// Sospeso automaticamente quando un filtro legenda è attivo.
(function() {
  if (typeof rbush === 'undefined') {
    console.warn('[QGISWebExporter] rbush non disponibile — viewport filter disabilitato');
    return;
  }

  // Raccoglie tutte le coordinate di una geometry GeoJSON come array di [lon, lat]
  function _coords(geom) {
    if (!geom) return [];
    const t = geom.type;
    if (t === 'Point')        return [geom.coordinates];
    if (t === 'MultiPoint' || t === 'LineString') return geom.coordinates;
    if (t === 'MultiLineString' || t === 'Polygon') return geom.coordinates.flat(1);
    if (t === 'MultiPolygon') return geom.coordinates.flat(2);
    if (t === 'GeometryCollection') return geom.geometries.flatMap(_coords);
    return [];
  }

  // Calcola bbox rbush {minX, minY, maxX, maxY} di una feature
  function _bbox(f) {
    const pts = _coords(f.geometry);
    if (!pts.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of pts) {
      if (c[0] < minX) minX = c[0]; if (c[0] > maxX) maxX = c[0];
      if (c[1] < minY) minY = c[1]; if (c[1] > maxY) maxY = c[1];
    }
    return {minX, minY, maxX, maxY};
  }

  // Soglia: il viewport filter si attiva solo sopra questo numero di feature
  const VP_THRESHOLD = 500;
  const _vpIdx = {};   // { layerName: { tree, fidMap: Map<fid, idx> } }

  GEOSHEET.layers.forEach(function(ld) {
    const lyr = leafletLayers[ld.name];
    // Solo layer L.geoJSON (hanno addData); salta PruneCluster (ha RegisterMarker)
    if (!lyr || typeof lyr.addData !== 'function') return;
    const feats = ld.geojson.features || [];
    if (feats.length < VP_THRESHOLD) return;

    const tree  = rbush();
    const items = [];
    const fidMap = new Map();   // fid → indice nell'array feats

    feats.forEach(function(f, i) {
      const b = _bbox(f);
      if (!b) return;
      items.push({minX: b.minX, minY: b.minY, maxX: b.maxX, maxY: b.maxY, i});
      const fid = _featureFid(f);
      if (fid !== null && !fidMap.has(fid)) fidMap.set(fid, i);
    });
    if (!items.length) return;

    tree.load(items);
    _vpIdx[ld.name] = {tree, fidMap};
    console.info('[QGISWebExporter] Viewport filter attivo: ' + ld.name +
                 ' (' + feats.length + ' feature)');
  });

  if (!Object.keys(_vpIdx).length) return;

  let _vpTimer = null;

  function _anyLegendActive() {
    if (typeof _legendFilters === 'undefined') return false;
    return GEOSHEET.layers.some(function(ld) {
      const a = _legendFilters[ld.name];
      return a && a.size > 0;
    });
  }

  function _refreshViewport() {
    clearTimeout(_vpTimer);
    _vpTimer = setTimeout(function() {
      // Se un filtro legenda è attivo, sospende il viewport filter:
      // _applyLegendFilter gestisce già la visibilità per layer/feature.
      if (_anyLegendActive()) return;

      const b  = map.getBounds();
      const vp = {minX: b.getWest(), minY: b.getSouth(),
                  maxX: b.getEast(), maxY: b.getNorth()};

      GEOSHEET.layers.forEach(function(ld) {
        if (!_vpIdx[ld.name]) return;
        const lyr = leafletLayers[ld.name];
        if (!lyr || typeof lyr.eachLayer !== 'function') return;

        const {tree, fidMap} = _vpIdx[ld.name];
        const inVp = new Set(tree.search(vp).map(function(item) { return item.i; }));

        lyr.eachLayer(function(subLayer) {
          const f = subLayer.feature;
          if (!f) return;
          const fid = _featureFid(f);
          const idx = (fid !== null && fidMap.has(fid)) ? fidMap.get(fid) : null;
          // Feature non indicizzata (geometria nulla): lascia visibile
          const show = idx === null || inVp.has(idx);
          _setSubLayerVisibility(ld.name, subLayer, show);
        });
      });
    }, 200);
  }

  // Quando il filtro legenda viene azzerato, il prossimo moveend ripristina
  // automaticamente il viewport filter tramite _refreshViewport.
  map.on('moveend zoomend', _refreshViewport);
  // Prima esecuzione differita: lascia completare fitBounds
  setTimeout(_refreshViewport, 400);
})();

// Vista iniziale: usa homeBbox se catturato, altrimenti tutti i layer
if (MAP_CONFIG.homeBbox) {
  const hb = MAP_CONFIG.homeBbox;
  map.fitBounds([[hb[0], hb[1]], [hb[2], hb[3]]], { padding: [0, 0] });
} else if (allBounds.isValid()) {
  map.fitBounds(allBounds, { padding: [24, 24] });
} else {
  map.setView([41.9, 12.5], 6);
}
new L.Hash(map);
map.setMinZoom(MAP_CONFIG.minZoom);
map.setMaxZoom(MAP_CONFIG.maxZoom);
// Limiti massimi: usa limitBbox se catturato, altrimenti allBounds (se restrictExtent)
if (MAP_CONFIG.limitBbox) {
  const lb = MAP_CONFIG.limitBbox;
  map.setMaxBounds([[lb[0] - 0.5, lb[1] - 0.5], [lb[2] + 0.5, lb[3] + 0.5]]);
} else if (MAP_CONFIG.restrictExtent && allBounds.isValid()) {
  map.setMaxBounds(allBounds.pad(0.15));
}

// ── Controllo ZoomHome (+/⌂/−) ────────────────────────────────────
const _homeBounds = MAP_CONFIG.homeBbox
  ? L.latLngBounds([[MAP_CONFIG.homeBbox[0], MAP_CONFIG.homeBbox[1]],
                    [MAP_CONFIG.homeBbox[2], MAP_CONFIG.homeBbox[3]]])
  : (allBounds.isValid() ? allBounds : null);
const _homeView   = { center: map.getCenter(), zoom: map.getZoom() };

L.Control.ZoomHome = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    const _S = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;';
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    const aIn = L.DomUtil.create('a', '', container);
    aIn.href = '#'; aIn.title = 'Zoom avanti';
    aIn.style.cssText = _S + 'font-size:18px;font-weight:600;';
    aIn.innerHTML = '+';
    L.DomEvent.on(aIn, 'click', function(e) {
      L.DomEvent.preventDefault(e); map.zoomIn();
    });

    const aHome = L.DomUtil.create('a', '', container);
    aHome.href = '#'; aHome.title = 'Vista iniziale';
    aHome.style.cssText = _S;
    aHome.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
      <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
    </svg>`;
    L.DomEvent.on(aHome, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      if (_homeBounds) map.fitBounds(_homeBounds, { padding: [24, 24] });
      else map.setView(_homeView.center, _homeView.zoom);
    });

    const aOut = L.DomUtil.create('a', '', container);
    aOut.href = '#'; aOut.title = 'Zoom indietro';
    aOut.style.cssText = _S + 'font-size:18px;font-weight:600;';
    aOut.innerHTML = '&#8722;';
    L.DomEvent.on(aOut, 'click', function(e) {
      L.DomEvent.preventDefault(e); map.zoomOut();
    });

    return container;
  }
});
new L.Control.ZoomHome().addTo(map);

// ── Controllo Tabella ─────────────────────────────────────────────
L.Control.TableToggle = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.title = 'Apri tabella dati';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V7H1zm0-4h4V3H2a1 1 0 0 0-1 1zm5-3v3h4V3zm4 4H6v3h4z"/>
    </svg>`;
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      toggleTableModal();
    });
    return container;
  }
});
if (MAP_CONFIG.showTable) new L.Control.TableToggle({ position: 'topleft' }).addTo(map);

// ── Controllo Analisi mappa ───────────────────────────────────────
L.Control.MapAnalysis = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.title = 'Analisi della mappa';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
      <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.078.706.186 1.068.295.369.112.74.224 1.096.295.365.074.66.104.922.004.888-.33 1.232-1.812 1.232-2.839A7 7 0 1 0 8 15"/>
    </svg>`;
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      const panel = document.getElementById('map-analysis-panel');
      panel.classList.contains('open') ? closeMapAnalysis() : openMapAnalysis();
    });
    return container;
  }
});
if (MAP_CONFIG.showAnalysis) new L.Control.MapAnalysis({ position: 'topleft' }).addTo(map);

// ── Controllo attiva/disattiva heatmap ────────────────────────────
L.Control.HeatmapToggle = L.Control.extend({
  options: { position: 'topleft' },
  _active: false,
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.title = 'Attiva / disattiva heatmap';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;transition:color .2s,opacity .2s;';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
    </svg>`;
    this._btn = btn;
    this._updateStyle();
    L.DomEvent.on(btn, 'click', L.DomEvent.preventDefault);
    L.DomEvent.on(btn, 'click', function() {
      this._active = !this._active;
      this._updateStyle();
      const self = this;
      Object.keys(leafletLayers).forEach(function(k) {
        if (k.indexOf('__heat__') === 0) {
          self._active ? map.addLayer(leafletLayers[k]) : map.removeLayer(leafletLayers[k]);
        }
      });
    }, this);
    return container;
  },
  _updateStyle: function() {
    this._btn.style.color   = this._active ? '#e74c3c' : '#aaa';
    this._btn.style.opacity = this._active ? '1' : '0.5';
  }
});
(function() {
  if (!HEATMAP_CONFIG || !HEATMAP_CONFIG.layers) return;
  const hasActive = Object.keys(HEATMAP_CONFIG.layers).some(function(k) {
    return HEATMAP_CONFIG.layers[k].enabled;
  });
  if (hasActive) new L.Control.HeatmapToggle({ position: 'topleft' }).addTo(map);
})();

// ── Controllo attiva/disattiva clustering ─────────────────────────
L.Control.ClusterToggle = L.Control.extend({
  options: { position: 'topleft' },
  _active: true,
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.title = 'Attiva / disattiva raggruppamento marker';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;transition:color .2s,opacity .2s;';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
      <path d="M 7.5 1.0 A 6.5 6.5 0 0 1 13.13 10.75 L 10.53 9.25 A 3.5 3.5 0 0 0 7.5 4.0 Z" fill="#3388ff" stroke="white" stroke-width="0.6"/>
      <path d="M 13.13 10.75 A 6.5 6.5 0 0 1 1.87 10.75 L 4.47 9.25 A 3.5 3.5 0 0 0 10.53 9.25 Z" fill="#e67e22" stroke="white" stroke-width="0.6"/>
      <path d="M 1.87 10.75 A 6.5 6.5 0 0 1 7.5 1.0 L 7.5 4.0 A 3.5 3.5 0 0 0 4.47 9.25 Z" fill="#2ecc71" stroke="white" stroke-width="0.6"/>
    </svg>`;
    this._btn = btn;
    this._updateStyle();
    L.DomEvent.on(btn, 'click', L.DomEvent.preventDefault);
    L.DomEvent.on(btn, 'click', function() {
      this._active = !this._active;
      _clusterGlobalEnabled = this._active;
      this._updateStyle();
      const self = this;
      _clusterLayers.forEach(function(entry) {
        if (self._active) {
          // Riattiva cluster: sostituisce gjFallback con pruneCluster
          if (map.hasLayer(entry.gjFallback)) {
            map.removeLayer(entry.gjFallback);
            map.addLayer(entry.pruneCluster);
            leafletLayers[entry.name] = entry.pruneCluster;
          }
        } else {
          // Disattiva cluster: sostituisce pruneCluster con gjFallback
          if (map.hasLayer(entry.pruneCluster)) {
            map.removeLayer(entry.pruneCluster);
            entry.gjFallback.addTo(map);
            leafletLayers[entry.name] = entry.gjFallback;
          }
        }
      });
    }, this);
    return container;
  },
  _updateStyle: function() {
    this._btn.style.opacity = this._active ? '1' : '0.4';
    this._btn.style.filter  = this._active ? 'none' : 'grayscale(100%)';
  }
});
if (_clusterLayers.length > 0) new L.Control.ClusterToggle({ position: 'topleft' }).addTo(map);


// ── Controllo Schermo Intero ──────────────────────────────────────────
L.Control.Fullscreen = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.title = 'Schermo intero';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;';
    const svgEnter = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 1h4a.5.5 0 0 1 0 1H2v3.5a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5m9 0h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V2h-3.5a.5.5 0 0 1 0-1M1 10.5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5V14h3.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm14.5-.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1H15v-3.5a.5.5 0 0 1 .5-.5z"/></svg>`;
    const svgExit  = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z"/></svg>`;
    btn.innerHTML = svgEnter;
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
    document.addEventListener('fullscreenchange', () => {
      btn.innerHTML = document.fullscreenElement ? svgExit : svgEnter;
    });
    return container;
  }
});
new L.Control.Fullscreen().addTo(map);


// ── Controllo Geolocalizzazione ──────────────────────────────────────
L.Control.Geolocate = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.title = 'Mostra la mia posizione';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5.518V.5A.5.5 0 0 1 8 0m0 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2"/><path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6"/></svg>`;
    let _geoMarker = null;
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      map.locate({ setView: true, maxZoom: 16 });
    });
    map.on('locationfound', function(e) {
      if (_geoMarker) map.removeLayer(_geoMarker);
      _geoMarker = L.circleMarker(e.latlng, {
        radius: 8, fillColor: '#4285f4', color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.9
      }).addTo(map).bindPopup('Sei qui').openPopup();
    });
    map.on('locationerror', function() { alert('Impossibile determinare la posizione.'); });
    return container;
  }
});
new L.Control.Geolocate().addTo(map);


// ── Ricerca indirizzo (Nominatim) ─────────────────────────────────────
(function() {
  const ctrl = L.control({position:'topright'});
  ctrl.onAdd = function() {
    const div = L.DomUtil.create('div','');
    div.style.cssText='background:#fff;border-radius:4px;box-shadow:0 1px 5px rgba(0,0,0,.4);display:flex;align-items:center;padding:2px 4px;';
    const inp = L.DomUtil.create('input','',div);
    inp.type='text'; inp.placeholder='Cerca indirizzo…';
    inp.style.cssText='border:none;outline:none;padding:3px 5px;font-size:12px;width:175px;background:transparent;';
    const btn = L.DomUtil.create('button','',div);
    btn.title='Cerca'; btn.type='button';
    btn.style.cssText='border:none;background:none;cursor:pointer;padding:2px 3px;display:flex;align-items:center;';
    btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>`;
    let _gmk = null;
    function doSearch() {
      const q=inp.value.trim(); if(!q) return;
      fetch('https://nominatim.openstreetmap.org/search?format=json&q='+encodeURIComponent(q)+'&limit=1')
        .then(r=>r.json()).then(data=>{
          if(!data.length){alert('Nessun risultato trovato.');return;}
          const ll=L.latLng(+data[0].lat,+data[0].lon);
          map.setView(ll,14);
          if(_gmk) map.removeLayer(_gmk);
          _gmk=L.marker(ll).addTo(map).bindPopup(data[0].display_name).openPopup();
        }).catch(()=>alert('Errore nella ricerca.'));
    }
    L.DomEvent.on(btn,'click',L.DomEvent.stopPropagation);
    L.DomEvent.on(btn,'click',L.DomEvent.preventDefault);
    L.DomEvent.on(btn,'click',doSearch);
    L.DomEvent.on(inp,'keydown',function(e){if(e.key==='Enter'){L.DomEvent.preventDefault(e);doSearch();}});
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  ctrl.addTo(map);
})();


// ── Ricerca layer (base) ──────────────────────────────────────────────
(function() {
  const ctrl = L.control({position:'topright'});
  ctrl.onAdd = function() {
    const div = L.DomUtil.create('div','');
    div.style.cssText='background:#fff;border-radius:4px;box-shadow:0 1px 5px rgba(0,0,0,.4);display:flex;align-items:center;padding:2px 4px;margin-top:4px;';
    const inp = L.DomUtil.create('input','',div);
    inp.type='text'; inp.placeholder='Cerca nei layer…';
    inp.style.cssText='border:none;outline:none;padding:3px 5px;font-size:12px;width:175px;background:transparent;';
    const btn = L.DomUtil.create('button','',div);
    btn.title='Cerca'; btn.type='button';
    btn.style.cssText='border:none;background:none;cursor:pointer;padding:2px 3px;display:flex;align-items:center;';
    btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>`;
    let _prevHL = null, _prevHLName = null;
    function doSearch() {
      const q=inp.value.trim().toLowerCase(); if(!q) return;
      for(const name of Object.keys(leafletLayers)){
        const gl=leafletLayers[name]; let found=null;
        gl.eachLayer(function(layer){
          if(found) return;
          const props=(layer.feature&&layer.feature.properties)||{};
          if(Object.values(props).some(v=>String(v).toLowerCase().includes(q))) found=layer;
        });
        if(found){
          if(_prevHL&&_prevHL.setStyle) _prevHL.setStyle(getStyle(_prevHLName,_prevHL.feature||{}));
          _prevHL=found; _prevHLName=name;
          if(found.setStyle) found.setStyle({weight:4,color:'#f39c12',fillOpacity:0.9});
          if(found.getBounds) map.fitBounds(found.getBounds(),{padding:[40,40]});
          else if(found.getLatLng) map.setView(found.getLatLng(),14);
          if(found.openPopup) found.openPopup();
          return;
        }
      }
      alert('Nessun risultato trovato nei layer.');
    }
    L.DomEvent.on(btn,'click',L.DomEvent.stopPropagation);
    L.DomEvent.on(btn,'click',L.DomEvent.preventDefault);
    L.DomEvent.on(btn,'click',doSearch);
    L.DomEvent.on(inp,'keydown',function(e){if(e.key==='Enter'){L.DomEvent.preventDefault(e);doSearch();}});
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  ctrl.addTo(map);
})();


// ── Coordinate cursore (leaflet-coord-projection) ─────────────────
(function() {
  if (typeof L.control.coordProjection === 'function') {
    L.control.coordProjection({
      position: MAP_CONFIG.coordsPosition || 'bottomleft',
      numDigits: 5,
      lngFirst: false,
      prefix: ''
    }).addTo(map);
  } else {
    /* fallback inline se il plugin CDN non è disponibile */
    const ctrl = L.control({ position: MAP_CONFIG.coordsPosition || 'bottomleft' });
    ctrl.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-control-coordinates');
      div.style.cssText = 'background:rgba(255,255,255,.85);padding:2px 8px;border-radius:3px;'
        + 'font-size:11px;font-family:monospace;box-shadow:0 1px 3px rgba(0,0,0,.3);'
        + 'line-height:20px;white-space:nowrap;pointer-events:none;';
      div.innerHTML = '&mdash;';
      map.on('mousemove', function(e) {
        div.innerHTML = 'Lat&nbsp;' + e.latlng.lat.toFixed(5)
          + '&emsp;Lon&nbsp;' + e.latlng.lng.toFixed(5);
      });
      map.on('mouseout', function() { div.innerHTML = '&mdash;'; });
      return div;
    };
    ctrl.addTo(map);
  }
})();


// ── Scala grafica (leaflet-graphicscale) ─────────────────────────
(function() {
  if (typeof L.control.graphicScale === 'function') {
    L.control.graphicScale({
      position: MAP_CONFIG.scalePosition || 'bottomright',
      fill: 'hollow',
      doubleLine: false
    }).addTo(map);
  } else {
    /* fallback alla scala nativa di Leaflet */
    L.control.scale({
      position: MAP_CONFIG.scalePosition || 'bottomright',
      metric: true,
      imperial: false
    }).addTo(map);
  }
})();


// ── Controllo Condivisione Social ────────────────────────────────────
L.Control.ShareMap = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.title = 'Condividi vista';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/></svg>`;
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      gsOpenShareModal();
    });
    return container;
  }
});
new L.Control.ShareMap().addTo(map);

function gsOpenShareModal() {
  document.getElementById('share-url-input').value = window.location.href;
  document.getElementById('share-copy-feedback').textContent = '';
  document.getElementById('share-modal').classList.add('visible');
}

async function gsShareCopyUrl() {
  const input    = document.getElementById('share-url-input');
  const feedback = document.getElementById('share-copy-feedback');
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(input.value);
    } else {
      input.select();
      document.execCommand('copy');
    }
    feedback.textContent = '\u2713 Link copiato negli appunti!';
    setTimeout(function() { feedback.textContent = ''; }, 2500);
  } catch(err) {
    feedback.textContent = 'Seleziona e copia manualmente.';
  }
}

function gsShareVia(platform) {
  const url   = document.getElementById('share-url-input').value;
  const title = (GEOSHEET.meta && GEOSHEET.meta.title) ? GEOSHEET.meta.title : document.title;
  let target;
  if (platform === 'whatsapp') {
    target = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
  } else if (platform === 'telegram') {
    target = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
  } else if (platform === 'facebook') {
    target = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
  } else if (platform === 'twitter') {
    target = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
  } else if (platform === 'linkedin') {
    target = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
  } else if (platform === 'bluesky') {
    target = 'https://bsky.app/intent/compose?text=' + encodeURIComponent(title + ' ' + url);
  } else if (platform === 'mastodon') {
    target = 'https://mastodon.social/share?text=' + encodeURIComponent(title + ' ' + url);
  } else if (platform === 'email') {
    window.location.href = 'mailto:?subject=' + encodeURIComponent(title) +
      '&body=' + encodeURIComponent(title + '\n\n' + url);
    return;
  }
  if (target) window.open(target, '_blank');
}

document.addEventListener('click', function(e) {
  const modal = document.getElementById('share-modal');
  if (modal && e.target === modal) modal.classList.remove('visible');
});



// ── Controllo Street View ─────────────────────────────────────────
L.Control.StreetView = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const btn = L.DomUtil.create('a', '', container);
    btn.href  = '#';
    btn.id    = 'sv-control-btn';
    btn.title = 'Street View \u2014 clicca sulla mappa per aprire';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;';
    const svIcon = document.createElement('img');
    svIcon.src = 'img/street_view.png';
    svIcon.alt = 'Street View';
    svIcon.style.cssText = 'width:18px;height:18px;object-fit:contain;';
    btn.appendChild(svIcon);
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      toggleStreetViewMode();
    });
    return container;
  }
});
new L.Control.StreetView().addTo(map);


function toggleTableModal(forceOpen) {
  const modal = document.getElementById('table-modal');
  const open  = forceOpen !== undefined ? forceOpen : modal.classList.contains('collapsed');
  modal.classList.toggle('collapsed', !open);
}

// ── Controllo Credits ─────────────────────────────────────────────
L.Control.Credits = L.Control.extend({
  options: { position: 'bottomleft', image: '', text: '', link: '' },
  onAdd: function() {
    const wrap = L.DomUtil.create('div', 'leaflet-control-credits collapsed');

    // ── Logo (sempre visibile, funge da toggle) ────────────────────
    const logoEl = L.DomUtil.create('div', 'credits-logo', wrap);
    logoEl.title = this.options.text || 'Credits';
    if (this.options.image) {
      const img = L.DomUtil.create('img', '', logoEl);
      img.src   = this.options.image;
      img.alt   = this.options.text || 'credits';
      img.title = this.options.text || '';
    } else {
      const fb = L.DomUtil.create('span', 'credits-logo-fb', logoEl);
      fb.innerHTML = '&copy;';
    }

    // ── Pannello espandibile: testo + link ─────────────────────────
    const panel = L.DomUtil.create('div', 'credits-panel', wrap);
    if (this.options.text) {
      if (this.options.link) {
        const a = L.DomUtil.create('a', '', panel);
        a.href   = this.options.link;
        a.target = '_blank';
        a.rel    = 'noopener noreferrer';
        a.innerHTML = this.options.text;
      } else {
        panel.innerHTML = this.options.text;
      }
    }

    // Click sul logo: espandi / comprimi
    L.DomEvent.on(logoEl, 'click', function(e) {
      L.DomEvent.preventDefault(e);
      wrap.classList.toggle('collapsed');
    });

    L.DomEvent.disableClickPropagation(wrap);
    L.DomEvent.disableScrollPropagation(wrap);
    return wrap;
  }
});

(function initCredits() {
  const img  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADthJREFUeNrsnW+QU9UVwO+LCwUVNigW+8HZ6Mi/FkigM/ZLZ4hTP7TaGcICClbcrIBSC+yCgharZBERECGADH9W2UStCqiEabFf2jFU/cJMMYuMgDhOMpW24ALJLgv7N6/nJC9LEpLNe+/ed997yTszZxYWNvvuOb97zrl/3r2CKIrEksoVm2WCypaqSmjkG4fvdcEXe9a38v+ekaikGYksmfFtvJxtI5RLCpCcjOrIcvB0Rh+fQBiyAAnjV4AjagGgj7PRuW5JXQwdrQaMsARHGIAIWwBo28PR4V5Qp0EfMwNESAIiagFA53QM542gHtAaE0bYVlA/AmHUWsKQAIDjvZLjnaQMRLJwEDSw1GBpwjAA7Ej39ozjq0kZeT5PYqC+pZ5vAxYA6PhQyvE+0Lry9XnRegHTg3+ZR7/0oBsA20OpSh4d31AmI2qawtG3zHPWXzEAbA+N9ZVLqGdoPUwNjQ2es6GyBWBbaCwO4wImreh5yVGshQCEaNkAAI4vj3DPr6+k0kLDTO3TguYAbDtE3+vFCo8GjTO1iwaargb6D431gfM+Ba0RJUeq0UoUqe3TQSNbD431mCoCgOPtUq+fYfV2ZtK0fOZZn+EBAFpdkvOdls+YQ38YU8KKmWfjhgRAcn5Y7vBONJHlDTR3gOsL7hW138QNBcCWj1N5KiDP+YLV7ennDDwAQcQQAGz5eJwXvrRYIziugkNF9zOUEFAD8LoJnF/GQg0BFQDgfBzjf2r1eN0hcD1b+02UKwCbPx6nqOCzvK6ppArDZ2cpLwxV7Qre/NE4u5GcL5Y2Dj4r9hAMlfGVs4qHzNfSbctsKs1sQ3MRYy9cOaU2ujSPAK9dd75Rx/kxkrUvb+UsNsMlaLcZ9iQGob1erQHAoZ4RN2/glqsQGEDz5dRNH41zSCCgcl7ZLDmEXr5q1hm/JgBAw3Ws+IViBVBqVw00WpddNZs+Go828WkKgvLaZuqq2WciTAGAhjqkHMo3F4pkcMfPPmOI3bYbP+QAgrI06HpOhm1krwYCJyHQauSFq5Ib9DCoCxzvM4rzUcDYAakIazLA49RIMLKJAEA3bt/aaoDxrhcMHSIGlw0fjjfKgtj9z88+E6YCABqjT+jPFdwY4XneQD1eJgh6F8wxsJmDNgX4dXZ+EzTCbTbno8AzeyFn1RfKY5xSaM2rB8f7VEeADQfH47iX6VSvwoK2/o9zUrnV1PJq2o4hnTpSaqoY7BhVHAHAWT6arVwU27vwoWeWg/NRoB1haLsbNMHanjK0WiSCT3EEAGpxff8Q3+HrgPPdq+eciZAyk/UHJ+i5fnL36jmno7IjAFIDSmiUqNPGcnQ+CjggAp3Co2mPL14P+GRHACBVce5ntBBX/8Kc0wFS5vLKgQk4aaTHjOrdLzycGwVsRSZ9fEorTgb4BivB+SjghAA0OahDPdBYMgUAnThunC6nxzPUVjCKl1SWoDNaOf9O77oDE+yDAoCUcH5ZIzXDV2HOJ396+HRcabvZjAiIp1QK4O0MHxgjQipQsN3gkCa5RR2jcNtYFICXD0zwSJTwykmtYAQ/qWQRiR80VnSmkL3NnWv3p9J8gQggQnjgW5U0kgqXFx85HS805CbaqqcgAPCLPbRjfwV6FBofJpaQlx45haOCGMe+570BgLX7J7o5z1D5LNfrZg9n0/6JjhwANJ+hytWjQL3V+7NkDUSBQrUAa80qKt35KcDNoeDJqN9yeUHzBLTufPn+TgHg+2CiHYhwctreFVsz91TIcndBCWjT3wpqTgRwcWyk5fxiRcDcU1FpzyOPpfeaNR9MdNgkUtwc83/AcrU2HUSFL1xVnCNArGnuqYjl40GcKAo8i2NXJgI41K09C0rVqvxLyNp5X0dJel8/PwCIKDhBiWJVLhYA8kJ5mFM6dtheev+nDo3ySyG1ADBWR3FWiek7dnhI4uV0eNNc4r4a0TbyTkY5WTxF+rp+Wf3ciUscI0B0oNdpLJgC7Br2+GzlVvyJPZ0k2XGByWcJgjCRVA37PLFxym28nn/dvK/DvA67sIkicWm0xStfuVb/YncHSSb+A21JmhICXlvIbYRwG/9zf7NH7L0GEJwzKwQRPhGAnz/0ebWrr8eUEPBalud5dax+E0BmhECEQpBDWLZx2wAi6nw6qMkgwJEAnxqAz9qzMU5wM2k60LwG4LD2bBwxCQS8FudsPB/YgqCMI4DpxOgQiMSlKMWqVBvHGOW2IFBkXjuPTmdjeHqXVRNonA60mgeIcjK1i1QQBPG199xD6ezpN74sokkNIEQ5zQU4DF8TXIoREb6ygEAYPioSX3PXNDU/v+rdSXZeo4AqjlO0xr9ECiIARoKqhofAi0PoICBkBEn2Hem4UPezET8OKlpKxgU6bqOATY+djJQ4WoSZrnxnktsUEPT/gCtJDKxbdScRhn4OECitCXjZKSZtCeO3B80cY0SRHQQEagKFEOBuXU4pIJpZDo5y+oW8yG41OQRR7dDO3aSTmQcIc3LMDE6/x21mCDbPP9nI/Ayhwht9IpkIEOFVdT7zziSP1t4ftb4tblQIBFv1fvjDj0r9z9fnn8RjZoN0i3FZW/ILj8wimRogwvFQCC+PEGBUCESx64ErbcvfkwXB4ye94KSg+nMaB5ctj3+VBgB+Ec4FxDjNB8xY8fZke2VD0FkrFwJwEnaYoAbmwRPYc24NwzqA19HmeDSMjxcEl1ePdhMmF12lIfgsNpRcuko7M3ex9mLXvPeWP/j+o/CX7lIQLH97MmHsn1TdZ8v/BkVFqeqIEjNGgu/azpHo5Svk+/ZuKr3W01G79ZN5siLB1vxIQJ+KQzkAwPdCHBd3aoBo00KAawbxzv+R3r5u6uXZq90dtVuOyIcAfibI4PSwxNa6ryI5AMCHx+FfWrVce5ZzeLEZIECTJAGCywBBV28ndYfASCAXAn8dk5pg4BX0vFPCih9RooHUNAYnmxaCDAiJa20pCGgFIXhdAQSU8wSFAcgmg9fhxQ3ByQ4zQpDdKdoZQdClAIJt6iNBAn62MABA1sARJZwEj6XT5cAohADUpcqIKXpzX5Vvv3oRHHiVqHrNPku7uq/Ubjw8+5/N/1g2Rg4EoigEFZ7REMj+jBu3hIlCiLYRCnXGssAUL9FJAALFPalYRMN0cC2rJlCrvf3d97V1/DssB4Lt3hNKn98/KADbvCcCvO+2wYcCCBxmgqCYsEoHfcm+CT8ABHtlQiCzJjgK/zc6eAQoQAlLGeQY89DSwBS7GSAoZWgWkQClHyBokwnBDnmRIJD/DVuRBvq1igKDiFOvesAIkaCYvTKRYI9MCApGgvSwOwb/Lg8A+I9xwuA8PxWA1C0JTAnoDkFf8v3BJ4LkaeIqRIKeTuord/r7IRK0y4PgDYwE+auIaSk45LYN0ki8NyhBM9mjMkzULWnRF4Lqu/72qNFqglQ6kAtB/Q2RIAbfCygCAH4gqmNI1h+CnxzBdLCNRXRjNTpIpQOZEOysz6kJik64lbo51C/qc9tlKh38QX8IcNWynk0kuEg6u9sJ7WUP/cl+gOB7gKBBFgQiEZbvLNL7UUreHg5OKHJ1PLf3/VM3h++sb9Xt8ujEfx/C3jRwz1/zsR/Id5e6VX3WsCG3kJHDR1M/0022qtN3jLzLvfhX287TfI5NBkUQBYTWGzd2cIsE03HL2tMtTpeOkSCQEwkoGtMFRWE7FIcsagJMB7v/XjoSUAEgNdhLdMoD0kpkDeiXv9/n9OkMwUzCICViPZBgBMEFGCK+ePDB+9R+RskUkBHJ+GuI/oILOI27nmgN65QOXDu+OP/ZufbeW2k/C9NB9c2jWTxWB8DwwMtzPjmmGQASBBFinFe8sML1AQhR3r8Y7JC6BVxkcMcSawjWKYRAEQCL9zkdJH3aVzUxjqRA2M0ZhMUSBEQPCMQSEDwsHwJFAEgNz6mIqacK2Y4WArsXtHIbOj71lo4QlIgEr8iEQDEAUsNxgqiBGFPwLuKQ5JjQngXaDh/5QCCohODIMU0AkBqORlb4qpcuZwXGpHwdlRxF9i6IMC0gn3zLZdhIsL4EBKoBgEbbCZO99oaNIm4AJVLuEKgGwOgQiIwgaFYAwSIaCPIeeDjOGDKAQBBsHSOGjfrNqt/u+4I5AFKjcyEQyy8SNC9UAMGb7CLB0KphxH7zHehEzSCgBkBqdNmnA9YQyLV61U1DyW23jGEGwXN5EDABAGVh+UPgfXNhJKTAHswigZYQMAOgAiBAqQcIAmogEPWGIOsBksn+pzfM/esu5gBkZMGbLjQS2zeNjVNb1L+1SD4EC5r1jATFh91pCP6ySxMApIYX2UegOHAZcSRRv2/Rl7IheKJ5KnMIbAL9Od99yb5faHZjCPQS3EdwP2iC7kAJ3VahB5MWcKpXri0AFiwg3VItQee0/h5yqfN86uVUWgGIRml6ZQw0HKl3gB4uw3rAMBDQQK5ZCigQBjOnglQbN72rqwlaFKSDepbpwEaXDgCgX3O7NAp6gF86APFw/smkxNzaUr9XfiRowUiAR+eLEAkor+LphUhwUYoEalMctwiQLd69UzEUYq+pKachYuBJ+ZEAbMC0MLxdxRBRhAigCwBZRsCe4yfG2mBCI00AgY81BKJGEIg8U0AhwR6Dl1eDNun4/gFLXVO3d2pAQfvxgE53qbbLLQwvdJxLfVU0yNYzAuRLXToi+OhTg453FKbNGQw+ddwrv93TrkcCSndgBLj91jGpArH0o+qcAooaZM80rBG8SmYTDTiSCL6tAILH90xjVhPIhcCwAGQZxS6BgGq29YXUAhJAEDIqBIYHIM84DmkixSPyO3VcqcQkB4beUeD4bJnPEQJTAVDAUG4JCFSXTiMJdHgky+lRRm3TDAKxXADIl8fSEcIlqUNSejDEgXCOjo6S65tLI+8uPq7ZjuPHdmsfCcoKgBLGzACRETspfH0NOjnbqZo6WW8IKgYAM8vvNIBgiARBkug8EWRJafnz4uMQlQSoc4QE7eES2NkvXrlAepO9A9+zADAFBP+SNWMoR3HhqO3KedKT7OG7HGwJvTy66+f5tYxqGXLTUGHE8FGt/xdgAGTA4sW/Gzy5AAAAAElFTkSuQmCC";
  const text = "qgis.org";
  const link = "https://qgis.org/";
  const pos  = "bottomright";
  if (img || text) {
    new L.Control.Credits({ position: pos || 'bottomleft', image: img, text: text, link: link }).addTo(map);
  }
})();

// ── MiniMap ───────────────────────────────────────────────────────────────
(function() {
  if (!MINIMAP_CONFIG || !MINIMAP_CONFIG.enabled) return;
  if (typeof L.Control.MiniMap === 'undefined') { console.warn('Leaflet MiniMap non disponibile'); return; }
  const _mmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '', maxZoom: 19, subdomains: 'abc' });
  new L.Control.MiniMap(_mmLayer, {
    position:        MINIMAP_CONFIG.position      || 'bottomright',
    width:           MINIMAP_CONFIG.width         || 150,
    height:          MINIMAP_CONFIG.height        || 150,
    zoomLevelOffset: MINIMAP_CONFIG.zoomOffset    !== undefined ? MINIMAP_CONFIG.zoomOffset : -5,
    toggleDisplay:   MINIMAP_CONFIG.toggleDisplay !== false,
    minimized:       MINIMAP_CONFIG.minimized     || false,
    aimingRectOptions:  { color: '#ff7800', weight: 1, clickable: false },
    shadowRectOptions:  { color: '#000000', weight: 1, clickable: false, opacity: 0, fillOpacity: 0 },
  }).addTo(map);
})();

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR — LAYER LIST
// ═══════════════════════════════════════════════════════════════════
function buildLayersList() {
  const listEl  = document.getElementById('layers-list');
  const zoomEl  = document.getElementById('zoom-btns');

  listEl.innerHTML = GEOSHEET.layers.map(layerDef => {
    const styles = GEOSHEET.styles[layerDef.name] || {};
    const firstStyle = Object.values(styles)[0] || {};
    const color  = firstStyle.color || '#3388ff';
    const count  = (layerDef.geojson.features || []).length;
    return `
      <div class="layer-row">
        <input type="checkbox" id="chk-${layerDef.name}" checked
          onchange="toggleLayer('${layerDef.name}', this.checked)">
        <span class="layer-swatch" style="background:${color}"></span>
        <label class="layer-label" for="chk-${layerDef.name}">${layerDef.name}</label>
        <span class="layer-count">${count}</span>
      </div>`;
  }).join('');

  zoomEl.innerHTML = GEOSHEET.layers.map(layerDef => `
    <button onclick="zoomToLayer('${layerDef.name}')"
      style="font-size:11px;padding:3px 6px;border:1px solid #ccc;border-radius:3px;background:#fff;cursor:pointer;text-align:left;">
      🔍 Zoom su <b>${layerDef.name}</b>
    </button>`).join('');
}

function toggleLayer(name, visible) {
  const l = leafletLayers[name];
  if (l) { visible ? map.addLayer(l) : map.removeLayer(l); }
  // Sincronizza l'eventuale heatmap associata al layer
  const hl = leafletLayers['__heat__' + name];
  if (hl) { visible ? map.addLayer(hl) : map.removeLayer(hl); }
}

function zoomToLayer(name) {
  const l = leafletLayers[name];
  if (!l) return;
  try { map.fitBounds(l.getBounds(), { padding: [20, 20] }); } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR — LEGENDA
// ═══════════════════════════════════════════════════════════════════

// Genera un'anteprima SVG inline per il campione di legenda.
// Usa SVG <pattern> con angolo corretto per rispecchiare i pattern di campitura della mappa.
function _legendSwatchSvg(s, isLine) {
  const W = 22, H = 14;
  const col  = s.color  || '#3388ff';
  const op   = s.opacity != null ? s.opacity : 0.8;
  const pt   = s.pattern_tipo  || '';
  const pc   = s.pattern_colore  || '#333333';
  const pc2  = s.pattern_colore2 || pc;
  const ang  = s.pattern_angolo != null ? s.pattern_angolo : 45;
  const bdr  = 'border:1px solid #bbb;border-radius:2px;vertical-align:middle';
  const hasBg = op > 0.02;
  // Sfondo: se opacity=0 usa bianco (legenda su sfondo bianco della sidebar)
  const bgFill = hasBg ? col : '#ffffff';
  const bgOp   = hasBg ? op  : 1.0;

  if (isLine) {
    const w = s.size != null && s.size > 0 ? Math.min(s.size, 4) : 1.5;
    const da = s.dash_array ? ` stroke-dasharray="${s.dash_array}"` : '';
    return `<svg width="${W}" height="${H}" style="${bdr}">` +
      `<line x1="1" y1="${H/2}" x2="${W-1}" y2="${H/2}" stroke="${col}" stroke-width="${w}"${da} stroke-linecap="round"/>` +
      `</svg>`;
  }

  if (!pt) {
    // Solido semplice
    return `<svg width="${W}" height="${H}" style="${bdr}">` +
      `<rect width="${W}" height="${H}" fill="${col}" fill-opacity="${op}"/>` +
      `</svg>`;
  }

  // uid univoco per evitare collisioni tra id <pattern> nella pagina
  const uid  = 'ls' + Math.random().toString(36).slice(2, 8);
  const sp   = 5;   // spaziatura fissa nel swatch (piccolo campione: non scala con pattern_spacing)
  const lw   = Math.min(s.pattern_line_width || 0.5, 2);  // spessore reale, cap a 2 per leggibilità swatch
  const half = sp / 2;
  // Tratteggio: scala i valori al rapporto sp/pattern_spacing per adattarli al swatch
  let da = '';
  if (s.pattern_dash_array) {
    const realSp  = s.pattern_spacing || 8;
    const scale   = sp / realSp;
    const scaled  = s.pattern_dash_array.split(',').map(v => Math.max(0.5, parseFloat(v) * scale).toFixed(1));
    da = ` stroke-dasharray="${scaled.join(',')}"`;
  }

  if (pt === 'strisce' || pt === 'incroci') {
    const cross = pt === 'incroci';
    return `<svg width="${W}" height="${H}" style="${bdr}" overflow="hidden">` +
      `<defs>` +
      `<pattern id="${uid}" x="0" y="0" width="${sp}" height="${sp}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})">` +
      `<line x1="0" y1="${half}" x2="${sp}" y2="${half}" stroke="${pc}" stroke-width="${lw}" stroke-linecap="square"${da}/>` +
      (cross ? `<line x1="${half}" y1="0" x2="${half}" y2="${sp}" stroke="${pc}" stroke-width="${lw}" stroke-linecap="square"${da}/>` : '') +
      `</pattern>` +
      `</defs>` +
      `<rect width="${W}" height="${H}" fill="${bgFill}" fill-opacity="${bgOp}"/>` +
      `<rect width="${W}" height="${H}" fill="url(#${uid})"/>` +
      `</svg>`;
  }

  if (pt === 'punti') {
    return `<svg width="${W}" height="${H}" style="${bdr}">` +
      `<defs><pattern id="${uid}" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">` +
      `<circle cx="3" cy="3" r="1.5" fill="${pc}"/></pattern></defs>` +
      `<rect width="${W}" height="${H}" fill="${bgFill}" fill-opacity="${bgOp}"/>` +
      `<rect width="${W}" height="${H}" fill="url(#${uid})"/>` +
      `</svg>`;
  }

  if (pt === 'strisce+punti' || pt === 'incroci+punti') {
    const cross = pt.startsWith('incroci');
    return `<svg width="${W}" height="${H}" style="${bdr}" overflow="hidden">` +
      `<defs>` +
      `<pattern id="${uid}_h" x="0" y="0" width="${sp}" height="${sp}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})">` +
      `<line x1="0" y1="${half}" x2="${sp}" y2="${half}" stroke="${pc}" stroke-width="${lw}" stroke-linecap="square"${da}/>` +
      (cross ? `<line x1="${half}" y1="0" x2="${half}" y2="${sp}" stroke="${pc}" stroke-width="${lw}" stroke-linecap="square"${da}/>` : '') +
      `</pattern>` +
      `<pattern id="${uid}_d" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">` +
      `<circle cx="3" cy="3" r="1.5" fill="${pc2}"/></pattern>` +
      `</defs>` +
      `<rect width="${W}" height="${H}" fill="${bgFill}" fill-opacity="${bgOp}"/>` +
      `<rect width="${W}" height="${H}" fill="url(#${uid}_d)"/>` +
      `<rect width="${W}" height="${H}" fill="url(#${uid}_h)"/>` +
      `</svg>`;
  }

  // Fallback: rettangolo solido
  return `<svg width="${W}" height="${H}" style="${bdr}">` +
    `<rect width="${W}" height="${H}" fill="${col}" fill-opacity="${op}"/>` +
    `</svg>`;
}

// ── Stato filtri legenda: { layerName: Set<value> } vuoto = tutto visibile ──
const _legendFilters = {};

// Escape HTML per evitare XSS negli attributi data-* e nel testo
function _escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function buildLegend() {
  const el = document.getElementById('legend-content');
  const parts = [];

  // Titolo e descrizione della legenda (opzionali)
  if (GEOSHEET.meta.legend_title) {
    let hdr = '<div class="legend-header">';
    hdr += '<div class="legend-header-title">' + _escHtml(GEOSHEET.meta.legend_title) + '</div>';
    if (GEOSHEET.meta.legend_description) {
      hdr += '<div class="legend-header-desc">' + _escHtml(GEOSHEET.meta.legend_description) + '</div>';
    }
    hdr += '</div>';
    parts.push(hdr);
  }

  GEOSHEET.layers.forEach(layerDef => {
    const styles   = GEOSHEET.styles[layerDef.name] || {};
    const isLine   = layerDef.geom_type === 'LineString' || layerDef.geom_type === 'MultiLineString';
    const entries  = Object.entries(styles).filter(([k]) => k !== '__default__');
    if (entries.length === 0) {
      const def = styles['__default__'];
      if (def) {
        parts.push(
          '<div class="legend-group">' +
          '<div class="section-title">' + _escHtml(layerDef.name) + '</div>' +
          '<div class="legend-row" data-layer="' + _escHtml(layerDef.name) + '" data-val="__default__">' +
          _legendSwatchSvg(def, isLine) +
          '<span class="legend-lbl">' + _escHtml(def.label || layerDef.name) + '</span>' +
          '</div></div>'
        );
      }
      return;
    }
    const safeId = layerDef.name.replace(/[^a-z0-9]/gi, '_');
    let grp = '<div class="legend-group">';
    grp += '<div class="section-title">' + _escHtml(layerDef.name) + '</div>';
    if (entries.length > 1) {
      grp += '<div class="legend-filter-hint">Clicca per filtrare \u00b7 Ctrl+clic selezione multipla</div>';
    }
    entries.forEach(([val, s]) => {
      grp +=
        '<div class="legend-row" data-layer="' + _escHtml(layerDef.name) + '" data-val="' + _escHtml(val) + '">' +
        _legendSwatchSvg(s, isLine) +
        '<span class="legend-lbl">' + _escHtml(s.label || val) + '</span>' +
        '</div>';
    });
    grp += '<button class="legend-reset-btn" id="lf-reset-' + _escHtml(safeId) + '" data-layer="' + _escHtml(layerDef.name) + '">\u00d7 Mostra tutto</button>';
    grp += '</div>';
    parts.push(grp);
  });

  // eslint-disable-next-line no-unsanitized/property -- contenuto generato da dati QGIS, non input utente
  el.innerHTML = parts.length
    ? parts.join('')
    : '<p style="font-size:12px;color:#aaa;padding:4px 0">Nessuno stile categorizzato.</p>';

  // Attacca event listener (nessun onclick inline) ---
  el.querySelectorAll('.legend-row[data-layer]').forEach(row => {
    row.addEventListener('click', function(ev) {
      _toggleLegendFilter(this, this.dataset.layer, this.dataset.val, ev);
    });
  });
  el.querySelectorAll('.legend-reset-btn[data-layer]').forEach(btn => {
    btn.addEventListener('click', function() {
      _resetLegendFilter(this.dataset.layer);
    });
  });
}

// Attiva/disattiva un elemento della legenda come filtro.
// Ctrl+clic = selezione multipla; clic singolo = esclusivo (o deseleziona se unico attivo).
function _toggleLegendFilter(rowEl, layerName, val, event) {
  // Ignora clic su voci non disponibili per cross-filtro
  if (rowEl && rowEl.classList.contains('lf-cross-dimmed')) return;
  if (!_legendFilters[layerName]) _legendFilters[layerName] = new Set();
  const active = _legendFilters[layerName];
  const multi  = event && event.ctrlKey;

  if (multi) {
    if (active.has(val)) active.delete(val);
    else                  active.add(val);
  } else {
    if (active.size === 1 && active.has(val)) {
      active.clear();
    } else {
      active.clear();
      active.add(val);
    }
  }

  _applyLegendFilter(layerName);
  _updateLegendUI(layerName);
}

// Azzera tutti i filtri del layer e mostra tutto
function _resetLegendFilter(layerName) {
  if (_legendFilters[layerName]) _legendFilters[layerName].clear();
  _applyLegendFilter(layerName);
  _updateLegendUI(layerName);
}

// Aggiorna le classi CSS delle righe legenda per rispecchiare lo stato filtro
function _updateLegendUI(layerName) {
  const active = _legendFilters[layerName] || new Set();
  const rows   = document.querySelectorAll('.legend-row[data-layer="' + CSS.escape(layerName) + '"]');
  const hasFilter = active.size > 0;
  rows.forEach(row => {
    const val = row.dataset.val;
    row.classList.toggle('lf-active',  hasFilter && active.has(val));
    row.classList.toggle('lf-dimmed',  hasFilter && !active.has(val));
  });
  const safeId = layerName.replace(/[^a-z0-9]/gi, '_');
  const btn = document.getElementById('lf-reset-' + safeId);
  if (btn) btn.classList.toggle('lf-visible', hasFilter);
  _updateFilterBanner();
  _updateAllLegendCrossFilter();
}

// ── Filtro a cascata cross-layer ─────────────────────────────────────────────
// Restituisce il Set dei valori di style_field presenti in targetLayer che compaiono
// nelle feature la cui intersezione di fid soddisfa TUTTI gli altri filtri attivi.
// Restituisce null se nessun altro layer ha un filtro attivo (tutto disponibile).
function _computeCrossAvailableValues(targetLayerDef) {
  // Raccoglie i fid filtrati dagli ALTRI layer
  const otherFidSets = [];
  GEOSHEET.layers.forEach(ld => {
    if (ld.name === targetLayerDef.name) return;
    const active = _legendFilters[ld.name];
    if (!active || active.size === 0) return;
    const field = ld.style_field;
    const fids  = new Set();
    (ld.geojson.features || []).forEach(f => {
      const val = field ? String((f.properties || {})[field] ?? '') : '__default__';
      if (active.has(val)) {
        const fid = _featureFid(f);
        if (fid !== null) fids.add(fid);
      }
    });
    otherFidSets.push(fids);
  });

  if (otherFidSets.length === 0) return null; // nessun altro filtro attivo

  // Intersezione di tutti i fid set degli altri layer
  let intersected = new Set(otherFidSets[0]);
  for (let i = 1; i < otherFidSets.length; i++) {
    for (const fid of intersected) {
      if (!otherFidSets[i].has(fid)) intersected.delete(fid);
    }
  }

  // Raccoglie i valori di style_field del targetLayer presenti tra i fid intersecati
  const field    = targetLayerDef.style_field;
  const available = new Set();
  (targetLayerDef.geojson.features || []).forEach(f => {
    const fid = _featureFid(f);
    if (fid !== null && intersected.has(fid)) {
      const val = field ? String((f.properties || {})[field] ?? '') : '__default__';
      available.add(val);
    }
  });
  return available;
}

// Aggiorna la classe lf-cross-dimmed su tutti i layer in base ai filtri degli altri layer.
function _updateAllLegendCrossFilter() {
  GEOSHEET.layers.forEach(ld => {
    const available = _computeCrossAvailableValues(ld);
    const rows = document.querySelectorAll('.legend-row[data-layer="' + CSS.escape(ld.name) + '"]');
    rows.forEach(row => {
      const val = row.dataset.val;
      // cross-dimmed solo se: ci sono altri filtri attivi AND il valore non è disponibile
      const crossDimmed = available !== null && !available.has(val);
      row.classList.toggle('lf-cross-dimmed', crossDimmed);
    });
  });
}
// ── Fine filtro a cascata ────────────────────────────────────────────────────

// Calcola il conteggio delle feature visibili dopo l'intersezione dei filtri attivi.
// Riusa la stessa logica di _applyLegendFilter ma opera solo sui GeoJSON (niente DOM).
function _countFilteredFeatures() {
  const filteredFids = {};
  GEOSHEET.layers.forEach(ld => {
    const active = _legendFilters[ld.name];
    if (!active || active.size === 0) return;
    const field = ld.style_field;
    const fids  = new Set();
    (ld.geojson.features || []).forEach(f => {
      const val = field ? String((f.properties || {})[field] ?? '') : '__default__';
      if (active.has(val)) {
        const fid = _featureFid(f);
        if (fid !== null) fids.add(fid);
      }
    });
    filteredFids[ld.name] = fids;
  });

  const filteredNames = Object.keys(filteredFids);
  if (filteredNames.length === 0) return null;   // nessun filtro attivo

  // Intersezione
  let intersected = new Set(filteredFids[filteredNames[0]]);
  for (let i = 1; i < filteredNames.length; i++) {
    const other = filteredFids[filteredNames[i]];
    for (const fid of intersected) {
      if (!other.has(fid)) intersected.delete(fid);
    }
  }
  return intersected.size;
}

// Aggiorna il banner riepilogativo sopra la legenda
function _updateFilterBanner() {
  const banner = document.getElementById('legend-filter-banner');
  if (!banner) return;

  // Raccoglie tutte le label attive da tutti i layer
  const tags = [];
  GEOSHEET.layers.forEach(layerDef => {
    const active = _legendFilters[layerDef.name];
    if (!active || active.size === 0) return;
    const styles = GEOSHEET.styles[layerDef.name] || {};
    active.forEach(val => {
      const s = styles[val] || {};
      tags.push(s.label || val);
    });
  });

  if (tags.length === 0) {
    banner.style.display = 'none';
    banner.textContent = '';
    return;
  }

  const count = _countFilteredFeatures();

  // Costruisce il contenuto senza innerHTML con testo utente grezzo
  banner.style.display = 'flex';
  while (banner.firstChild) banner.removeChild(banner.firstChild);

  const labelEl = document.createElement('span');
  labelEl.className = 'lfb-label';
  labelEl.textContent = 'Filtro attivo:';
  banner.appendChild(labelEl);

  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'lfb-tags';
  tags.forEach(t => {
    const chip = document.createElement('span');
    chip.className = 'lfb-tag';
    chip.title = t;
    chip.textContent = t;
    tagsWrap.appendChild(chip);
  });
  banner.appendChild(tagsWrap);

  if (count !== null) {
    const countEl = document.createElement('span');
    countEl.className = 'lfb-count';
    countEl.textContent = count.toLocaleString() + ' elem.';
    banner.appendChild(countEl);
  }

  const zoomBtn = document.createElement('button');
  zoomBtn.className = 'lfb-zoom';
  zoomBtn.textContent = '\u26f6 Zoom';
  zoomBtn.title = 'Centra e zooma sugli oggetti filtrati';
  zoomBtn.addEventListener('click', _zoomToFilteredFeatures);
  banner.appendChild(zoomBtn);

  const clearBtn = document.createElement('button');
  clearBtn.className = 'lfb-clear';
  clearBtn.textContent = '\u00d7 Azzera tutto';
  clearBtn.addEventListener('click', function() {
    GEOSHEET.layers.forEach(ld => _resetLegendFilter(ld.name));
  });
  banner.appendChild(clearBtn);
}

// Centra e zooma la mappa sulle feature visibili dopo l'applicazione dei filtri legenda.
function _zoomToFilteredFeatures() {
  // Costruisce l'insieme dei fid visibili con la stessa logica di _applyLegendFilter
  const filteredFids = {};
  GEOSHEET.layers.forEach(ld => {
    const active = _legendFilters[ld.name];
    if (!active || active.size === 0) return;
    const field = ld.style_field;
    const fids  = new Set();
    (ld.geojson.features || []).forEach(f => {
      const val = field ? String((f.properties || {})[field] ?? '') : '__default__';
      if (active.has(val)) {
        const fid = _featureFid(f);
        if (fid !== null) fids.add(fid);
      }
    });
    filteredFids[ld.name] = fids;
  });

  const filteredNames = Object.keys(filteredFids);
  if (filteredNames.length === 0) return;

  let intersectedFids = new Set(filteredFids[filteredNames[0]]);
  for (let i = 1; i < filteredNames.length; i++) {
    const other = filteredFids[filteredNames[i]];
    for (const fid of intersectedFids) {
      if (!other.has(fid)) intersectedFids.delete(fid);
    }
  }
  if (intersectedFids.size === 0) return;

  // Raccoglie i bounds di tutti i sub-layer visibili
  let bounds = null;
  GEOSHEET.layers.forEach(ld => {
    const gjLayer = leafletLayers[ld.name];
    if (!gjLayer || typeof gjLayer.eachLayer !== 'function') return;
    const hasOwnFilter = !!filteredFids[ld.name];
    gjLayer.eachLayer(subLayer => {
      let include = false;
      if (hasOwnFilter) {
        const fid = _featureFid(subLayer.feature);
        include = fid !== null && intersectedFids.has(fid);
      }
      if (!include) return;
      try {
        let b;
        if (subLayer.getBounds) {
          b = subLayer.getBounds();
        } else if (subLayer.getLatLng) {
          const ll = subLayer.getLatLng();
          b = L.latLngBounds(ll, ll);
        }
        if (b && b.isValid()) {
          bounds = bounds ? bounds.extend(b) : L.latLngBounds(b);
        }
      } catch(e) {}
    });
  });

  if (bounds && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
  }
}

// Restituisce il fid della feature come stringa, o null se non disponibile.
// QgsJsonExporter mette l'ID QGIS come feature.id (top-level GeoJSON standard);
// come fallback cerca nei campi properties più comuni.
function _featureFid(feature) {
  if (!feature) return null;
  // 1. ID top-level GeoJSON (generato da QgsJsonExporter)
  if (feature.id != null) return String(feature.id);
  // 2. Campi nelle properties
  const p = feature.properties || {};
  const v = p.fid ?? p.FID ?? p.id ?? p.ID ?? p.objectid ?? p.OBJECTID;
  return v != null ? String(v) : null;
}

// Applica/rimuove la visibilità di un singolo sub-layer Leaflet.
function _setSubLayerVisibility(layerName, subLayer, show) {
  if (typeof subLayer.setStyle === 'function') {
    subLayer.setStyle(show
      ? getStyle(layerName, subLayer.feature)
      : { opacity: 0, fillOpacity: 0, stroke: false });
  } else {
    const domEl = subLayer.getElement ? subLayer.getElement() : null;
    if (domEl) domEl.style.visibility = show ? '' : 'hidden';
  }
}

// Ricalcola la visibilità di TUTTI i layer tenendo conto dell'intersezione tra filtri attivi.
// I layer che condividono gli stessi fid del dataset filtrato (es. due categorizzazioni
// dello stesso layer edifici) vengono anch'essi filtrati sulla mappa.
// I layer con dataset completamente diverso (fid non sovrapposti) mostrano sempre tutto.
function _applyLegendFilter(/* layerName — non usato, ricalcola tutto */) {
  // ── Costruisce, per ogni layer filtrato, l'insieme dei fid visibili ──
  const filteredFids = {};   // { layerName: Set<string> }
  GEOSHEET.layers.forEach(ld => {
    const active = _legendFilters[ld.name];
    if (!active || active.size === 0) return;
    const field = ld.style_field;
    const fids  = new Set();
    (ld.geojson.features || []).forEach(f => {
      const val = field ? String((f.properties || {})[field] ?? '') : '__default__';
      if (active.has(val)) {
        const fid = _featureFid(f);
        if (fid !== null) fids.add(fid);
      }
    });
    filteredFids[ld.name] = fids;
  });

  // ── Intersezione tra tutti i layer filtrati ──
  const filteredNames = Object.keys(filteredFids);
  let intersectedFids = null;
  if (filteredNames.length >= 2) {
    intersectedFids = new Set(filteredFids[filteredNames[0]]);
    for (let i = 1; i < filteredNames.length; i++) {
      const other = filteredFids[filteredNames[i]];
      for (const fid of intersectedFids) {
        if (!other.has(fid)) intersectedFids.delete(fid);
      }
    }
  } else if (filteredNames.length === 1) {
    intersectedFids = filteredFids[filteredNames[0]];
  }

  // ── Per i layer senza filtro proprio, determina se condividono fid con
  //    l'insieme intersecato (stesso dataset, categorizzazione diversa).
  //    Se sì, applica il cross-filter sulla mappa; altrimenti mostra tutto.
  const crossFilteredLayers = new Set(filteredNames);
  if (intersectedFids && intersectedFids.size > 0) {
    GEOSHEET.layers.forEach(ld => {
      if (crossFilteredLayers.has(ld.name)) return; // ha già filtro proprio
      const shares = (ld.geojson.features || []).some(f => {
        const fid = _featureFid(f);
        return fid !== null && intersectedFids.has(fid);
      });
      if (shares) crossFilteredLayers.add(ld.name);
    });
  }

  // ── Applica a ogni layer Leaflet ──
  GEOSHEET.layers.forEach(ld => {
    const gjLayer = leafletLayers[ld.name];
    if (!gjLayer || typeof gjLayer.eachLayer !== 'function') return;
    const participates = crossFilteredLayers.has(ld.name);

    gjLayer.eachLayer(subLayer => {
      let show;
      if (!intersectedFids) {
        // Nessun filtro attivo → tutto visibile
        show = true;
      } else if (participates) {
        // Layer filtrato (proprio o per fid condivisi): applica intersezione
        const fid = _featureFid(subLayer.feature);
        show = fid !== null ? intersectedFids.has(fid) : false;
      } else {
        // Layer con dataset diverso (fid non sovrapposti) → mostra tutto
        show = true;
      }
      _setSubLayerVisibility(ld.name, subLayer, show);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR — STATISTICHE
// ═══════════════════════════════════════════════════════════════════

// Popola tabella riepilogo e inizializza il builder al primo accesso
function buildStats() {
  const total = GEOSHEET.layers.reduce((s, l) => s + (l.geojson.features || []).length, 0);
  const tbl   = document.getElementById('stats-table');
  tbl.innerHTML = GEOSHEET.layers.map(ld => {
    const count = (ld.geojson.features || []).length;
    const pct   = total > 0 ? (count / total * 100).toFixed(1) : '0.0';
    return `<tr>
      <td><b>${ld.name}</b></td>
      <td style="text-align:right;color:#555">${count.toLocaleString()} feature</td>
      <td style="text-align:right;color:#888;font-size:11px">${pct}%</td>
      <td style="text-align:right;color:#aaa;font-size:10px">${ld.geom_type || ''}</td>
    </tr>`;
  }).join('');

  // Inizializza selettore layer (solo la prima volta)
  const layerSel = document.getElementById('chart-layer-sel');
  if (layerSel.options.length === 1) {
    GEOSHEET.layers.forEach(ld => {
      const o = document.createElement('option');
      o.value = ld.name;
      o.textContent = ld.name + '  (' + (ld.geojson.features || []).length + ')';
      layerSel.appendChild(o);
    });
  }

  // Genera grafici al primo accesso: preset configurati o uno di default
  if (_charts.length === 0) {
    if (_presetCharts && _presetCharts.length) {
      _presetCharts.forEach(pc => generateChartFromConfig(pc));
    } else {
      generateChart();
    }
  }
}

// Seleziona tipo grafico (highlight pulsante)
function selectChartType(type) {
  _chartType = type;
  document.querySelectorAll('.chart-type-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.type === type)
  );
  const isCombo = type === 'combo';
  document.getElementById('chart-field2-row').style.display = isCombo ? '' : 'none';
  if (isCombo) _syncField2Options();
}

// Restituisce '#333' o '#fff' in base alla luminosità percepita del colore hex
function _contrastColor(hex) {
  let h = (hex || '#888').replace('#', '');
  if (h.length === 8) h = h.slice(0, 6);          // rimuove alpha eventuale
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 >= 145 ? '#333' : '#fff';
}

// Sincronizza le opzioni del secondo selettore campo con il primo
function _syncField2Options() {
  const f1 = document.getElementById('chart-field-sel');
  const f2 = document.getElementById('chart-field-sel-2');
  const cur = f2.value;
  f2.innerHTML = f1.innerHTML;
  f2.value = cur;
  if (!f2.value) f2.selectedIndex = 0;
}

// Aggiorna il selettore campi in base al layer scelto
function onChartLayerChange() {
  const layerName = document.getElementById('chart-layer-sel').value;
  const fieldSel  = document.getElementById('chart-field-sel');
  fieldSel.innerHTML = '<option value="__count__">Conteggio feature</option>';
  document.getElementById('chart-title-input').value = '';
  if (layerName === '__all__') return;

  const layer = GEOSHEET.layers.find(l => l.name === layerName);
  if (!layer) return;

  // Analizza i tipi di campo dalle prime 100 feature
  const fieldTypes = {};
  (layer.geojson.features || []).slice(0, 100).forEach(f => {
    Object.entries(f.properties || {}).forEach(([k, v]) => {
      if (!(k in fieldTypes)) fieldTypes[k] = typeof v;
    });
  });

  const numFields = Object.entries(fieldTypes).filter(([, t]) => t === 'number');
  const catFields = Object.entries(fieldTypes).filter(([, t]) => t !== 'number' && t !== 'object');

  if (numFields.length) {
    const og = document.createElement('optgroup');
    og.label = 'Campi numerici (somma)';
    numFields.forEach(([k]) => {
      const o = document.createElement('option');
      o.value = 'num:' + k; o.textContent = k;
      og.appendChild(o);
    });
    fieldSel.appendChild(og);
  }
  if (catFields.length) {
    const og = document.createElement('optgroup');
    og.label = 'Campi categorici (conteggio)';
    catFields.forEach(([k]) => {
      const o = document.createElement('option');
      o.value = 'cat:' + k; o.textContent = k;
      og.appendChild(o);
    });
    fieldSel.appendChild(og);
  }
  if (_chartType === 'combo') _syncField2Options();
}

// Costruisce labels/data/colors in base alle selezioni correnti
// fieldOverride: se specificato, usa questo valore invece di leggere dal DOM
function _getChartData(fieldOverride) {
  const layerName = document.getElementById('chart-layer-sel').value;
  const field     = fieldOverride !== undefined ? fieldOverride
                  : document.getElementById('chart-field-sel').value;
  const palette   = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6',
                     '#1abc9c','#e67e22','#34495e','#95a5a6','#16a085',
                     '#d35400','#2980b9','#27ae60','#8e44ad','#c0392b'];

  function layerColor(l) {
    return (Object.values(GEOSHEET.styles[l.name] || {})[0] || {}).color || '#3388ff';
  }

  if (field === '__count__') {
    const layers = layerName === '__all__' ? GEOSHEET.layers
                                           : GEOSHEET.layers.filter(l => l.name === layerName);
    return {
      labels: layers.map(l => l.name),
      data:   layers.map(l => (l.geojson.features || []).length),
      colors: layers.map(layerColor),
      title:  'Conteggio feature',
    };
  }

  const [fType, fName] = field.split(':');

  if (fType === 'num') {
    const layers = layerName === '__all__' ? GEOSHEET.layers
                                           : GEOSHEET.layers.filter(l => l.name === layerName);
    if (layerName === '__all__') {
      // somma del campo per ciascun layer
      return {
        labels: layers.map(l => l.name),
        data:   layers.map(l => (l.geojson.features || [])
                  .reduce((s, f) => s + (Number(f.properties?.[fName]) || 0), 0)),
        colors: layers.map(layerColor),
        title:  fName,
      };
    } else {
      // valore per ciascuna feature
      const feats = (layers[0]?.geojson.features || []);
      return {
        labels: feats.map((f, i) => String(f.properties?.name || f.properties?.id || '#' + (i + 1))),
        data:   feats.map(f => Number(f.properties?.[fName]) || 0),
        colors: feats.map((_, i) => palette[i % palette.length]),
        title:  fName,
      };
    }
  }

  if (fType === 'cat') {
    const layers = layerName === '__all__' ? GEOSHEET.layers
                                           : GEOSHEET.layers.filter(l => l.name === layerName);
    const counts = {};
    layers.forEach(l => (l.geojson.features || []).forEach(f => {
      const val = String(f.properties?.[fName] ?? '—');
      counts[val] = (counts[val] || 0) + 1;
    }));
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return {
      labels: entries.map(([k]) => k),
      data:   entries.map(([, v]) => v),
      colors: entries.map((_, i) => palette[i % palette.length]),
      title:  fName,
    };
  }

  return null;
}

// Costruisce il titolo automatico dal contesto corrente
function _autoTitle() {
  const layerName = document.getElementById('chart-layer-sel').value;
  const field     = document.getElementById('chart-field-sel').value;
  const layerLbl  = layerName === '__all__' ? 'Tutti i layer' : layerName;
  if (_chartType === 'combo') {
    const field2 = document.getElementById('chart-field-sel-2').value;
    const lbl1 = field  === '__count__' ? 'Conteggio' : field.split(':')[1];
    const lbl2 = field2 === '__count__' ? 'Conteggio' : field2.split(':')[1];
    return lbl1 + ' (bar) / ' + lbl2 + ' (linea) — ' + layerLbl;
  }
  if (field === '__count__') return 'Conteggio feature — ' + layerLbl;
  const [fType, fName] = field.split(':');
  const agg = fType === 'num' ? 'Somma' : 'Distribuzione';
  return agg + ' ' + fName + ' — ' + layerLbl;
}

// Genera un grafico da una configurazione preset {title, type, layer, field}
function generateChartFromConfig(cfg) {
  if (!cfg) return;
  // Layer
  const layerSel = document.getElementById('chart-layer-sel');
  const wantLayer = cfg.layer || '__all__';
  for (let i = 0; i < layerSel.options.length; i++) {
    if (layerSel.options[i].value === wantLayer) { layerSel.selectedIndex = i; break; }
  }
  onChartLayerChange();
  // Field
  const fieldSel = document.getElementById('chart-field-sel');
  const wantField = cfg.field || '__count__';
  for (let i = 0; i < fieldSel.options.length; i++) {
    if (fieldSel.options[i].value === wantField) { fieldSel.selectedIndex = i; break; }
  }
  // Tipo
  selectChartType(cfg.type || 'bar');
  // Secondo campo (combo)
  if ((cfg.type === 'combo') && cfg.field2) {
    _syncField2Options();
    const f2 = document.getElementById('chart-field-sel-2');
    for (let i = 0; i < f2.options.length; i++) {
      if (f2.options[i].value === cfg.field2) { f2.selectedIndex = i; break; }
    }
  }
  // Titolo
  const titleInput = document.getElementById('chart-title-input');
  titleInput.value = cfg.title || '';
  generateChart();
}

// Aggiunge un grafico combo (Bar + Line) con doppio asse Y
function _generateComboChart() {
  const cd1 = _getChartData();
  const field2 = document.getElementById('chart-field-sel-2').value;
  const cd2    = _getChartData(field2);
  if (!cd1 || !cd1.data.length) return;

  const titleInput = document.getElementById('chart-title-input');
  const chartTitle = titleInput.value.trim() || _autoTitle();
  const uid        = ++_chartUid;
  const canvasId   = 'chart-canvas-' + uid;

  const card = document.createElement('div');
  card.className   = 'chart-card';
  card.dataset.uid = uid;
  card.innerHTML =
    '<div class="chart-card-header">' +
      '<span class="chart-card-title" title="' + chartTitle.replace(/"/g,'&quot;') + '">' + chartTitle + '</span>' +
      '<button class="chart-card-btn" onclick="saveChartCard(' + uid + ')" title="Salva PNG">&#11015;</button>' +
      '<button class="chart-card-btn del" onclick="removeChartCard(' + uid + ')" title="Rimuovi">&#10005;</button>' +
    '</div>' +
    '<canvas id="' + canvasId + '"></canvas>';

  document.getElementById('charts-list').appendChild(card);
  _updateChartsCount();

  const MAX_L  = 14;
  const short  = cd1.labels.map(l => String(l).length > MAX_L ? String(l).slice(0, MAX_L-1) + '\u2026' : String(l));
  const color1 = cd1.colors[0] || '#3388ff';
  const color2 = (cd2 && cd2.colors[0]) || '#e74c3c';

  const datasets = [
    {
      type: 'bar',
      label: cd1.title,
      data: cd1.data,
      backgroundColor: color1 + 'bb',
      borderColor: color1,
      borderWidth: 1,
      borderRadius: 3,
      yAxisID: 'y',
      datalabels: { display: true, anchor: 'center', align: 'center', color: _contrastColor(color1), font: { size: 10, weight: '700' }, textShadowBlur: 2, textShadowColor: 'rgba(0,0,0,.4)', formatter: v => v > 0 ? Number(v).toLocaleString() : '' },
    },
  ];
  if (cd2 && cd2.data.length) {
    datasets.push({
      type: 'line',
      label: cd2.title,
      data: cd2.data,
      borderColor: color2,
      backgroundColor: color2 + '22',
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointBackgroundColor: color2,
      pointRadius: 4,
      pointHoverRadius: 6,
      yAxisID: 'y2',
      datalabels: { display: true, anchor: 'end', align: 'top', color: '#333', font: { size: 10, weight: '700' }, textShadowBlur: 0, formatter: v => v > 0 ? Number(v).toLocaleString() : '' },
    });
  }

  const ctx = document.getElementById(canvasId).getContext('2d');
  const instance = new Chart(ctx, {
    type: 'bar',
    data: { labels: short, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      layout: { padding: { top: 4 } },
      plugins: {
        title: { display: false },
        legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 8, boxWidth: 12 } },
        tooltip: { callbacks: { title: items => cd1.labels[items[0].dataIndex] } },
        datalabels: { display: true, font: { size: 10, weight: '700' }, formatter: v => v > 0 ? Number(v).toLocaleString() : '' },
      },
      scales: {
        x:  { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 40, color: '#555' } },
        y:  { beginAtZero: true, position: 'left',  ticks: { font: { size: 11 }, color: color1 },
               title: { display: true, text: cd1.title, font: { size: 10 }, color: color1 } },
        y2: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false },
               ticks: { font: { size: 11 }, color: color2 },
               title: { display: cd2 && !!cd2.title, text: cd2 ? cd2.title : '', font: { size: 10 }, color: color2 } },
      }
    }
  });
  _charts.push({ uid, instance });
}

// Aggiunge un nuovo grafico come card in fondo alla lista
function generateChart() {
  if (_chartType === 'combo') { _generateComboChart(); return; }
  const cd = _getChartData();
  if (!cd || !cd.data.length) return;

  // Titolo: usa quello inserito dall'utente oppure quello automatico
  const titleInput = document.getElementById('chart-title-input');
  const chartTitle = titleInput.value.trim() || _autoTitle();

  const uid      = ++_chartUid;
  const canvasId = 'chart-canvas-' + uid;

  // Crea la card
  const card = document.createElement('div');
  card.className  = 'chart-card';
  card.dataset.uid = uid;
  card.innerHTML =
    '<div class="chart-card-header">' +
      '<span class="chart-card-title" title="' + chartTitle.replace(/"/g,'&quot;') + '">' + chartTitle + '</span>' +
      '<button class="chart-card-btn" onclick="saveChartCard(' + uid + ')" title="Salva PNG">&#11015;</button>' +
      '<button class="chart-card-btn del" onclick="removeChartCard(' + uid + ')" title="Rimuovi">&#10005;</button>' +
    '</div>' +
    '<canvas id="' + canvasId + '"></canvas>';

  document.getElementById('charts-list').appendChild(card);
  _updateChartsCount();

  const ctx   = document.getElementById(canvasId).getContext('2d');
  const total = cd.data.reduce((s, v) => s + v, 0);
  const MAX_L = 14;
  const short = cd.labels.map(l => String(l).length > MAX_L ? String(l).slice(0, MAX_L - 1) + '\u2026' : String(l));

  const isCircular = ['doughnut', 'pie', 'polarArea'].includes(_chartType);
  const isBar      = _chartType === 'bar';
  const isLine     = _chartType === 'line';
  const isRadar    = _chartType === 'radar';

  const _dlFmt  = v => v > 0 ? Number(v).toLocaleString() : '';
  const _dlWHIT = { display: true, color: '#fff', font: { size: 11, weight: '700' }, textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,.65)', formatter: _dlFmt };
  const _dlDARK = { display: true, color: '#333', font: { size: 11, weight: '700' }, textShadowBlur: 0, formatter: _dlFmt };

  const datasets = [{
    label:           cd.title,
    data:            cd.data,
    backgroundColor: cd.colors.map(c => c + (isLine ? '33' : isBar ? 'cc' : 'dd')),
    borderColor:     isLine ? (cd.colors[0] || '#3388ff') : cd.colors,
    borderWidth:     isLine ? 2 : 1,
    borderRadius:    isBar  ? 3 : undefined,
    fill:            isLine ? false : undefined,
    tension:         isLine ? 0.3  : undefined,
    pointBackgroundColor: isLine ? cd.colors[0] : undefined,
  }];

  const instance = new Chart(ctx, {
    type: _chartType,
    data: { labels: (isBar || isLine || isRadar) ? short : cd.labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      layout: { padding: { top: (isBar || isLine) ? 24 : 4 } },
      plugins: {
        title: { display: false },
        legend: {
          display: isCircular || isRadar,
          position: 'bottom',
          labels: { font: { size: 11 }, padding: 8, boxWidth: 12 }
        },
        tooltip: {
          callbacks: {
            title: items => cd.labels[items[0].dataIndex],
            label: c => {
              const v = isCircular ? c.parsed : c.parsed.y ?? c.parsed;
              const pct = total > 0 ? (v / total * 100).toFixed(1) : '0.0';
              return '  ' + Number(v).toLocaleString() + ' (' + pct + '%)';
            }
          }
        },
        datalabels: isCircular ? {
          // dentro il segmento colorato → contrasto automatico; nascondi fette < 4%
          ..._dlWHIT, anchor: 'center', align: 'center',
          display: c => c.dataset.data[c.dataIndex] / total > 0.04,
          color: c => _contrastColor(cd.colors[c.dataIndex]),
        } : isBar ? {
          // centro della barra → contrasto automatico sul colore del layer
          ..._dlWHIT, anchor: 'center', align: 'center',
          color: c => _contrastColor(cd.colors[c.dataIndex]),
        } : isLine ? {
          // sopra ogni punto → sfondo chiaro
          ..._dlDARK, anchor: 'end', align: 'top',
        } : {
          // radar / polarArea → vertici su sfondo chiaro
          ..._dlDARK, anchor: 'end', align: 'end',
        },
      },
      scales: (isCircular || isRadar) ? {} : {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, maxRotation: 40, color: '#555' }
        },
        y: {
          display: isBar || isLine,
          beginAtZero: true,
          ...(isBar ? { max: Math.ceil(Math.max(...cd.data) * 1.2) } : {}),
          ticks: { font: { size: 11 }, color: '#555' }
        }
      }
    }
  });

  _charts.push({ uid, instance });
}

// Scarica come PNG la card con uid dato (minimo 768 px, titolo incluso)
function saveChartCard(uid) {
  const entry = _charts.find(c => c.uid === uid);
  if (!entry) return;
  const card = document.querySelector('.chart-card[data-uid="' + uid + '"]');
  const src  = card ? card.querySelector('canvas') : null;
  if (!src) return;

  // Testo titolo (attributo title = testo completo non troncato)
  const titleEl  = card.querySelector('.chart-card-title');
  const title    = titleEl ? (titleEl.getAttribute('title') || titleEl.textContent.trim()) : '';

  const minW   = 768;
  const scale  = src.width < minW ? minW / src.width : 1;
  const outW   = Math.round(src.width  * scale);
  const outH   = Math.round(src.height * scale);
  const fSize  = Math.max(13, Math.round(14 * scale));
  const titleH = fSize + 24;   // padding verticale intorno al testo

  const off  = document.createElement('canvas');
  off.width  = outW;
  off.height = outH + titleH;
  const octx = off.getContext('2d');

  // Sfondo bianco
  octx.fillStyle = '#ffffff';
  octx.fillRect(0, 0, outW, off.height);

  // Titolo centrato
  octx.fillStyle    = '#333333';
  octx.font         = 'bold ' + fSize + 'px sans-serif';
  octx.textAlign    = 'center';
  octx.textBaseline = 'middle';
  octx.fillText(title, outW / 2, titleH / 2, outW - 32);

  // Linea separatrice sottile
  octx.strokeStyle = '#e0e0e0';
  octx.lineWidth   = 1;
  octx.beginPath();
  octx.moveTo(16, titleH - 1);
  octx.lineTo(outW - 16, titleH - 1);
  octx.stroke();

  // Grafico
  octx.drawImage(src, 0, titleH, outW, outH);

  const a = document.createElement('a');
  a.download = 'grafico_' + new Date().toISOString().slice(0, 10) + '_' + uid + '.png';
  a.href = off.toDataURL('image/png');
  a.click();
}

// Rimuove la card con uid dato e distrugge l'istanza Chart.js
function removeChartCard(uid) {
  const idx = _charts.findIndex(c => c.uid === uid);
  if (idx >= 0) { _charts[idx].instance.destroy(); _charts.splice(idx, 1); }
  const card = document.querySelector('.chart-card[data-uid="' + uid + '"]');
  if (card) card.remove();
  _updateChartsCount();
}

function _updateChartsCount() {
  const badge = document.getElementById('charts-count');
  if (!badge) return;
  const n = _charts.length;
  if (n === 0) { badge.style.display = 'none'; }
  else { badge.textContent = n; badge.style.display = ''; }
}

// ═══════════════════════════════════════════════════════════════════
// TABELLA DATI
// ═══════════════════════════════════════════════════════════════════
function _esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let _tblCurrentLayer = null;
let _tblHiddenCols   = new Set();   // nomi colonne nascoste
let _tblAllKeys      = [];          // tutti i campi del layer corrente

function initTableTab() {
  const sel = document.getElementById('table-layer-sel');
  GEOSHEET.layers.forEach(l => {
    const opt = document.createElement('option');
    opt.value       = l.name;
    opt.textContent = l.name + '  (' + (l.geojson.features || []).length + ' feature)';
    sel.appendChild(opt);
  });
  if (GEOSHEET.layers.length) buildTable(GEOSHEET.layers[0].name);
}

function _tableKeys(features) {
  const keys = [];
  features.forEach(f => {
    if (f.properties) Object.keys(f.properties).forEach(k => { if (!keys.includes(k)) keys.push(k); });
  });
  return keys;
}

// Restituisce i campi attualmente visibili
function _visibleKeys() {
  return _tblAllKeys.filter(k => !_tblHiddenCols.has(k));
}

// Restituisce le feature selezionate (righe con checkbox spuntata), o tutte se nessuna spuntata
function _selectedFeatures() {
  const layer = GEOSHEET.layers.find(l => l.name === _tblCurrentLayer);
  if (!layer) return [];
  const allFeatures = layer.geojson.features || [];
  const checked = document.querySelectorAll('#data-table tbody tr.row-checked');
  if (checked.length === 0) return allFeatures;
  return Array.from(checked).map(tr => allFeatures[parseInt(tr.dataset.idx, 10)]).filter(Boolean);
}

// Aggiorna il badge con il conteggio selezione attiva
function _updateSelBadge() {
  const badge = document.getElementById('tbl-sel-badge');
  if (!badge) return;
  const checkedRows = document.querySelectorAll('#data-table tbody tr.row-checked').length;
  const visCol = _visibleKeys().length;
  const totCol = _tblAllKeys.length;
  const parts  = [];
  if (checkedRows > 0)   parts.push(checkedRows + ' righe');
  if (visCol < totCol)   parts.push(visCol + '/' + totCol + ' colonne');
  if (parts.length) {
    badge.textContent    = '✓ ' + parts.join(' · ');
    badge.style.display  = '';
  } else {
    badge.style.display  = 'none';
  }
}

// Costruisce il pannello di selezione colonne con DOM API
function _buildColSelector(keys) {
  const bar = document.getElementById('col-selector-bar');
  if (!bar) return;
  while (bar.firstChild) bar.removeChild(bar.firstChild);
  if (!keys.length) return;

  const lbl = document.createElement('strong');
  lbl.style.cssText = 'font-size:11px;color:#555;margin-right:4px';
  lbl.textContent = 'Colonne:';
  bar.appendChild(lbl);

  [['Tutte', true], ['Nessuna', false]].forEach(([txt, show], i) => {
    const btn = document.createElement('button');
    btn.textContent = txt;
    btn.style.cssText = 'font-size:11px;padding:2px 7px;border:1px solid var(--sb-border);border-radius:3px;background:#fff;cursor:pointer;color:#333;' + (i ? 'margin-left:2px' : '');
    btn.addEventListener('click', () => toggleAllCols(show));
    bar.appendChild(btn);
  });

  const sep = document.createElement('span');
  sep.style.cssText = 'width:1px;background:var(--sb-border);align-self:stretch;margin:0 4px';
  bar.appendChild(sep);

  keys.forEach(k => {
    const label = document.createElement('label');
    const chk   = document.createElement('input');
    chk.type        = 'checkbox';
    chk.checked     = !_tblHiddenCols.has(k);
    chk.dataset.col = k;
    chk.addEventListener('change', () => toggleColumn(chk));
    label.appendChild(chk);
    label.appendChild(document.createTextNode('\u00a0' + k));
    bar.appendChild(label);
  });
}

// Costruisce la tabella con DOM API (textContent per i dati — nessun rischio XSS)
function _renderTable(features, layerName) {
  const wrap = document.getElementById('table-wrap');
  while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

  const table  = document.createElement('table');
  table.className = 'data-tbl';
  table.id = 'data-table';

  // ── Intestazione ──────────────────────────────────────────────────
  const thead     = table.createTHead();
  const headerRow = thead.insertRow();

  // Checkbox "seleziona tutto"
  const thChk = document.createElement('th');
  thChk.className = 'chk-col';
  thChk.title = 'Seleziona/deseleziona tutte le righe visibili';
  const masterChk = document.createElement('input');
  masterChk.type  = 'checkbox';
  masterChk.id    = 'chk-all-rows';
  masterChk.title = 'Seleziona tutte';
  masterChk.addEventListener('change', () => toggleAllRows(masterChk.checked));
  thChk.appendChild(masterChk);
  headerRow.appendChild(thChk);

  // Colonna indice
  const thIdx = document.createElement('th');
  thIdx.style.width = '40px';
  thIdx.title = 'Indice';
  thIdx.textContent = '#';
  headerRow.appendChild(thIdx);

  // Colonne dati
  _tblAllKeys.forEach(k => {
    const th = document.createElement('th');
    th.dataset.col    = k;
    th.style.width    = _tblHiddenCols.has(k) ? '' : '120px';
    th.style.display  = _tblHiddenCols.has(k) ? 'none' : '';
    th.textContent    = k;
    headerRow.appendChild(th);
  });

  // ── Corpo ─────────────────────────────────────────────────────────
  const tbody = table.createTBody();
  features.forEach((f, i) => {
    const tr = tbody.insertRow();
    tr.dataset.idx   = i;
    tr.dataset.layer = layerName;

    // Cella checkbox riga
    const tdChk = tr.insertCell();
    tdChk.className = 'chk-col';
    const rowChk    = document.createElement('input');
    rowChk.type      = 'checkbox';
    rowChk.className = 'row-chk';
    rowChk.addEventListener('change', () => onRowCheck(rowChk));
    tdChk.addEventListener('click', e => e.stopPropagation());
    tdChk.appendChild(rowChk);

    // Cella indice
    const tdIdx = tr.insertCell();
    tdIdx.style.cssText = 'color:#aaa;width:40px';
    tdIdx.title = 'Zoom alla feature';
    tdIdx.textContent = String(i + 1);
    tdIdx.addEventListener('click', () => zoomToFeatureRow(tr));

    // Celle dati
    _tblAllKeys.forEach(k => {
      const td = tr.insertCell();
      td.dataset.col   = k;
      td.style.display = _tblHiddenCols.has(k) ? 'none' : '';
      td.title = 'Zoom alla feature';
      td.textContent = String(f.properties != null && f.properties[k] != null ? f.properties[k] : '');
      td.addEventListener('click', () => zoomToFeatureRow(tr));
    });
  });

  wrap.appendChild(table);
  _addColResizers(table);
  _updateSelBadge();
}

function buildTable(layerName) {
  _tblCurrentLayer = layerName;
  _tblHiddenCols   = new Set();
  const search = document.getElementById('table-search');
  if (search) search.value = '';
  const wrap  = document.getElementById('table-wrap');
  const layer = GEOSHEET.layers.find(l => l.name === layerName);
  const features = layer && layer.geojson && layer.geojson.features;
  if (!features || features.length === 0) {
    while (wrap.firstChild) wrap.removeChild(wrap.firstChild);
    const p = document.createElement('p');
    p.style.cssText = 'color:#aaa;padding:10px;font-size:12px';
    p.textContent = 'Nessuna feature disponibile.';
    wrap.appendChild(p);
    _tblAllKeys = [];
    _buildColSelector([]);
    _updateSelBadge();
    return;
  }
  _tblAllKeys = _tableKeys(features);
  _buildColSelector(_tblAllKeys);
  _renderTable(features, layerName);
}

// Mostra/nasconde il pannello selezione colonne
function toggleColSelector() {
  const bar = document.getElementById('col-selector-bar');
  const btn = document.getElementById('btn-col-sel');
  if (!bar) return;
  bar.classList.toggle('open');
  if (btn) btn.classList.toggle('active', bar.classList.contains('open'));
}

// Attiva/disattiva una singola colonna tramite il pannello
function toggleColumn(chk) {
  const col = chk.dataset.col;
  if (chk.checked) _tblHiddenCols.delete(col);
  else             _tblHiddenCols.add(col);
  document.querySelectorAll('#data-table [data-col="' + col + '"]').forEach(el => {
    el.style.display = chk.checked ? '' : 'none';
  });
  _updateSelBadge();
}

// Spunta/deseleziona tutte le colonne
function toggleAllCols(show) {
  _tblHiddenCols = show ? new Set() : new Set(_tblAllKeys);
  document.querySelectorAll('#col-selector-bar input[data-col]').forEach(chk => {
    chk.checked = show;
  });
  _tblAllKeys.forEach(k => {
    document.querySelectorAll('#data-table [data-col="' + k + '"]').forEach(el => {
      el.style.display = show ? '' : 'none';
    });
  });
  _updateSelBadge();
}

// Callback checkbox singola riga
function onRowCheck(chk) {
  const tr = chk.closest('tr');
  tr.classList.toggle('row-checked', chk.checked);
  const all       = document.querySelectorAll('#data-table tbody .row-chk');
  const allChecked = Array.from(all).every(c => c.checked);
  const master     = document.getElementById('chk-all-rows');
  if (master) master.checked = allChecked;
  _updateSelBadge();
}

// Seleziona/deseleziona tutte le righe visibili
function toggleAllRows(checked) {
  document.querySelectorAll('#data-table tbody tr').forEach(tr => {
    if (tr.style.display === 'none') return;
    const chk = tr.querySelector('.row-chk');
    if (chk) { chk.checked = checked; tr.classList.toggle('row-checked', checked); }
  });
  _updateSelBadge();
}

function filterTable(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll('#data-table tbody tr').forEach(row => {
    row.style.display = (!q || row.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
  // Se il master checkbox era spuntato e alcune righe sono sparite, resettalo
  const master = document.getElementById('chk-all-rows');
  if (master && master.checked) master.checked = false;
  _updateSelBadge();
}

function zoomToFeatureRow(row) {
  const layerName = row.dataset.layer;
  const idx       = parseInt(row.dataset.idx, 10);
  const gjLayer   = leafletLayers[layerName];
  if (!gjLayer) return;
  const subs = gjLayer.getLayers();
  const sub  = subs[idx];
  if (!sub) return;
  try {
    if (sub.getBounds)      map.fitBounds(sub.getBounds(), { padding: [40, 40], maxZoom: 17 });
    else if (sub.getLatLng) map.setView(sub.getLatLng(), 16);
  } catch(e) {}
  if (sub.openPopup) sub.openPopup();
  document.querySelectorAll('#data-table tbody tr').forEach(r => r.classList.remove('row-selected'));
  row.classList.add('row-selected');
}

// ── Ridimensionamento colonne ──────────────────────────────────────
function _addColResizers(table) {
  if (!table) return;
  table.querySelectorAll('thead th').forEach(th => {
    if (th.classList.contains('chk-col')) return;
    const handle = document.createElement('div');
    handle.className = 'col-resizer';
    th.appendChild(handle);
    let startX, startW;
    handle.addEventListener('mousedown', function(e) {
      startX = e.pageX;
      startW = th.offsetWidth;
      handle.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      function onMove(e) {
        const w = Math.max(30, startW + e.pageX - startX);
        th.style.width = w + 'px';
        th.style.minWidth = w + 'px';
      }
      function onUp() {
        handle.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

// ── Download ───────────────────────────────────────────────────────
function _triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadTableCSV() {
  if (!_tblCurrentLayer) return;
  const features = _selectedFeatures();
  if (!features.length) return;
  const keys = _visibleKeys();
  if (!keys.length) return;
  const q = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
  const rows = [keys.map(q).join(',')];
  features.forEach(f => {
    rows.push(keys.map(k => q(f.properties != null && f.properties[k] != null ? f.properties[k] : '')).join(','));
  });
  _triggerDownload(new Blob(['\ufeff' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' }), _tblCurrentLayer + '.csv');
}

function downloadTableJSON() {
  if (!_tblCurrentLayer) return;
  const layer = GEOSHEET.layers.find(l => l.name === _tblCurrentLayer);
  if (!layer) return;
  const features = _selectedFeatures();
  const keys     = _visibleKeys();
  const filtered = features.map(f => {
    const props = {};
    keys.forEach(k => { props[k] = f.properties != null ? (f.properties[k] ?? null) : null; });
    return { type: 'Feature', geometry: f.geometry, properties: props };
  });
  _triggerDownload(
    new Blob([JSON.stringify({ type: 'FeatureCollection', features: filtered }, null, 2)], { type: 'application/json' }),
    _tblCurrentLayer + '.geojson'
  );
}

// ═══════════════════════════════════════════════════════════════════
// ANALISI DELLA MAPPA
// ═══════════════════════════════════════════════════════════════════

// Palette ramp 5-step: verde → giallo → rosso (numerici)
const _MA_RAMP = ['#1a9850','#91cf60','#fee08b','#fc8d59','#d73027'];
// Palette 12 colori per categorici
const _MA_CAT  = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6',
                  '#1abc9c','#e67e22','#34495e','#16a085','#c0392b',
                  '#2980b9','#8e44ad'];

let _maFields       = [];    // [{label, field, layerName, type}]
let _maDropOpen     = false;
let _maLayerSnapshot = null; // visibilità layer prima dell'analisi

// Scopre tutti i campi analizzabili dai layer abilitati all'analisi
function _buildMaFields() {
  _maFields = [];
  const _alFilter = GEOSHEET.analysisLayers && GEOSHEET.analysisLayers.length
    ? new Set(GEOSHEET.analysisLayers)
    : null;
  GEOSHEET.layers.filter(ld => !_alFilter || _alFilter.has(ld.name)).forEach(ld => {
    const sample = {};
    (ld.geojson.features || []).slice(0, 50).forEach(f =>
      Object.entries(f.properties || {}).forEach(([k, v]) => {
        if (!(k in sample)) sample[k] = typeof v;
      })
    );
    Object.entries(sample).forEach(([field, vtype]) => {
      if (vtype === 'object') return;          // salta null/array
      const type = vtype === 'number' ? 'numeric' : 'category';
      _maFields.push({ label: field, field, layerName: ld.name, type });
    });
  });
}

function openMapAnalysis() {
  _buildMaFields();
  _renderMaOptions();
  document.getElementById('map-analysis-panel').classList.add('open');
}

function closeMapAnalysis() {
  document.getElementById('map-analysis-panel').classList.remove('open');
  _closeMaDropdown();
  _resetAnalysisColors();
  document.getElementById('maSelectLabel').textContent = 'Seleziona attributo...';
  document.getElementById('maClearBtn').style.display = 'none';
  document.getElementById('maLegend').style.display = 'none';
  document.querySelectorAll('.ma-option').forEach(el => el.classList.remove('selected'));
}

function toggleMapAnalysisDropdown() {
  const dd = document.getElementById('maDropdown');
  if (_maDropOpen) { _closeMaDropdown(); return; }
  // Direzione dinamica: apre verso l'alto se spazio sotto insufficiente
  const wrap    = document.querySelector('.ma-select-wrap');
  const wrapRect = wrap.getBoundingClientRect();
  const mapRect  = document.getElementById('map').getBoundingClientRect();
  const spaceBelow = mapRect.bottom - wrapRect.bottom;
  if (spaceBelow < 240) {
    dd.style.top = 'auto'; dd.style.bottom = 'calc(100% + 4px)';
  } else {
    dd.style.top = 'calc(100% + 4px)'; dd.style.bottom = 'auto';
  }
  dd.classList.add('open');
  document.getElementById('maChevron').classList.add('rotated');
  document.getElementById('maSearchInput').value = '';
  filterMapAnalysisOptions();
  document.getElementById('maSearchInput').focus();
  _maDropOpen = true;
}

function _closeMaDropdown() {
  document.getElementById('maDropdown').classList.remove('open');
  document.getElementById('maChevron').classList.remove('rotated');
  _maDropOpen = false;
}

function _renderMaOptions() {
  const list = document.getElementById('maOptionsList');
  // Raggruppa per layer
  const byLayer = {};
  _maFields.forEach((f, i) => {
    if (!byLayer[f.layerName]) byLayer[f.layerName] = [];
    byLayer[f.layerName].push({ ...f, idx: i });
  });
  let html = '';
  Object.entries(byLayer).forEach(([lname, fields]) => {
    html += `<div class="ma-optgroup-lbl">${lname}</div>`;
    fields.forEach(f => {
      html += `<div class="ma-option" data-idx="${f.idx}"
        onclick="selectMapAnalysisOption(${f.idx})">${f.label}
        <span style="float:right;color:#bbb;font-size:10px;">${f.type === 'numeric' ? '123' : 'ABC'}</span>
      </div>`;
    });
  });
  list.innerHTML = html || '<div style="padding:8px 12px;font-size:12px;color:#aaa;">Nessun campo trovato</div>';
}

function filterMapAnalysisOptions() {
  const q = document.getElementById('maSearchInput').value.toLowerCase();
  document.querySelectorAll('.ma-option').forEach(el =>
    el.classList.toggle('hidden', !el.textContent.toLowerCase().includes(q))
  );
  document.querySelectorAll('.ma-optgroup-lbl').forEach(el => {
    // nascondi il gruppo se tutti i suoi elementi sono hidden
    let next = el.nextElementSibling;
    let allHidden = true;
    while (next && next.classList.contains('ma-option')) {
      if (!next.classList.contains('hidden')) allHidden = false;
      next = next.nextElementSibling;
    }
    el.style.display = allHidden ? 'none' : '';
  });
}

function selectMapAnalysisOption(idx) {
  const fd = _maFields[idx];
  document.getElementById('maSelectLabel').textContent = fd.layerName + ' › ' + fd.label;
  document.getElementById('maClearBtn').style.display = 'inline';
  document.querySelectorAll('.ma-option').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.ma-option[data-idx="${idx}"]`)?.classList.add('selected');
  _closeMaDropdown();
  _applyMapAnalysis(fd);
}

function clearMapAnalysis(e) {
  e.stopPropagation();
  document.getElementById('maSelectLabel').textContent = 'Seleziona attributo...';
  document.getElementById('maClearBtn').style.display = 'none';
  document.getElementById('maLegend').style.display = 'none';
  document.querySelectorAll('.ma-option').forEach(el => el.classList.remove('selected'));
  _resetAnalysisColors();
}

// Interpola colore tra 5 stop della ramp in base a [0,1]
function _rampColor(t) {
  const n = _MA_RAMP.length - 1;
  const i = Math.min(Math.floor(t * n), n - 1);
  const f = t * n - i;
  function hx(c) { return [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]; }
  const [r1,g1,b1] = hx(_MA_RAMP[i]);
  const [r2,g2,b2] = hx(_MA_RAMP[i+1]);
  const r = Math.round(r1 + (r2-r1)*f).toString(16).padStart(2,'0');
  const g = Math.round(g1 + (g2-g1)*f).toString(16).padStart(2,'0');
  const b = Math.round(b1 + (b2-b1)*f).toString(16).padStart(2,'0');
  return '#'+r+g+b;
}

// Helper: genera il blocco SVG ciambella riutilizzato da stile-originale e analisi
function _buildDonutIcon(catColors, cluster) {
  const n      = cluster.population;
  const stats  = cluster.stats || [];
  const total  = stats.reduce(function(s, v) { return s + (v || 0); }, 0) || n;
  const SZ = 44, CX = 22, CY = 22, OR = 20, IR = 11;
  let paths = '';
  const nonEmpty = stats.filter(function(v) { return v > 0; });
  if (nonEmpty.length > 1) {
    let angle = -Math.PI / 2;
    stats.forEach(function(count, idx) {
      if (!count) return;
      const sweep = (count / total) * 2 * Math.PI;
      const end   = angle + sweep;
      const large = sweep > Math.PI ? 1 : 0;
      const cos0 = Math.cos(angle), sin0 = Math.sin(angle);
      const cos1 = Math.cos(end),   sin1 = Math.sin(end);
      const color = catColors[idx] || '#3388ff';
      paths += '<path d="'
        + 'M '  + (CX + OR * cos0).toFixed(2) + ' ' + (CY + OR * sin0).toFixed(2)
        + ' A ' + OR + ' ' + OR + ' 0 ' + large + ' 1 '
                + (CX + OR * cos1).toFixed(2) + ' ' + (CY + OR * sin1).toFixed(2)
        + ' L ' + (CX + IR * cos1).toFixed(2) + ' ' + (CY + IR * sin1).toFixed(2)
        + ' A ' + IR + ' ' + IR + ' 0 ' + large + ' 0 '
                + (CX + IR * cos0).toFixed(2) + ' ' + (CY + IR * sin0).toFixed(2)
        + ' Z" fill="' + color + '" stroke="#fff" stroke-width="0.8"/>';
      angle = end;
    });
  } else {
    const idx   = stats.findIndex(function(v) { return v > 0; });
    const color = catColors[idx >= 0 ? idx : 0] || '#3388ff';
    paths = '<circle cx="' + CX + '" cy="' + CY + '" r="' + OR + '" fill="' + color + '"/>'
          + '<circle cx="' + CX + '" cy="' + CY + '" r="' + IR + '" fill="white"/>';
  }
  const label = '<text x="' + CX + '" y="' + (CY + 4) + '" '
    + 'text-anchor="middle" font-family="Arial,sans-serif" '
    + 'font-size="' + (n > 99 ? 8 : 10) + '" font-weight="bold" fill="#333">'
    + n + '</text>';
  return L.divIcon({
    html: '<svg width="' + SZ + '" height="' + SZ + '" viewBox="0 0 ' + SZ + ' ' + SZ
        + '" xmlns="http://www.w3.org/2000/svg">' + paths + label + '</svg>',
    className: 'gs-donut-cluster', iconSize: L.point(SZ, SZ), iconAnchor: L.point(SZ/2, SZ/2),
  });
}

// Helper: genera HTML tooltip per ciambella cluster (colore + nome + count + %)
function _clusterTooltipHtml(cluster, catColors, catToVal) {
  const n     = cluster.population;
  const stats = cluster.stats || [];
  if (!stats.some(function(v) { return v > 0; })) return null;
  let rows = '';
  stats.forEach(function(count, idx) {
    if (!count) return;
    const name  = catToVal[idx] !== undefined ? catToVal[idx] : ('cat. ' + idx);
    const color = catColors[idx] || '#888';
    const pct   = Math.round(count / n * 100);
    rows += '<tr>'
      + '<td><span style="display:inline-block;width:9px;height:9px;border-radius:50%;'
      + 'background:' + color + ';margin-right:5px;vertical-align:middle;"></span></td>'
      + '<td style="padding-right:10px;white-space:nowrap;">' + name + '</td>'
      + '<td style="text-align:right;font-weight:600;">' + count + '</td>'
      + '<td style="color:#999;padding-left:5px;">(' + pct + '%)</td>'
      + '</tr>';
  });
  return '<div style="font-size:11px;line-height:1.7;">'
    + '<div style="font-weight:700;margin-bottom:3px;padding-bottom:3px;'
    + 'border-bottom:1px solid #eee;">' + n + ' elementi</div>'
    + '<table style="border-collapse:collapse;">' + rows + '</table>'
    + '</div>';
}

function _applyMapAnalysis(fd) {
  const gjLayer = leafletLayers[fd.layerName];
  if (!gjLayer) return;

  // Salva visibilità corrente (solo la prima volta per questa sessione analisi)
  if (!_maLayerSnapshot) {
    _maLayerSnapshot = {};
    GEOSHEET.layers.forEach(ld => {
      _maLayerSnapshot[ld.name] = map.hasLayer(leafletLayers[ld.name]);
    });
  }

  // Mostra solo il layer in analisi, nasconde gli altri
  GEOSHEET.layers.forEach(ld => {
    const gl = leafletLayers[ld.name];
    if (!gl) return;
    if (ld.name === fd.layerName) {
      if (!map.hasLayer(gl)) map.addLayer(gl);
    } else {
      if (map.hasLayer(gl)) map.removeLayer(gl);
    }
  });
  _syncLayerCheckboxes(fd.layerName);

  const features = GEOSHEET.layers.find(l => l.name === fd.layerName)?.geojson.features || [];

  // ── PruneCluster: analisi nativa — aggiorna categorie e ridisegna ciambelle ──
  if (gjLayer._pcMarkers) {
    const pc = gjLayer;
    let aCatColors; const aCatToVal = {};
    if (fd.type === 'numeric') {
      const vals  = features.map(f => Number(f.properties?.[fd.field]) || 0);
      const mn    = Math.min(...vals), mx = Math.max(...vals);
      const range = mx - mn || 1;
      const N     = _MA_RAMP.length;
      pc._pcMarkers.forEach(function(pm) {
        const v = Number((pm.data.feature?.properties || {})[fd.field] || 0);
        const t = (v - mn) / range;
        pm.category = Math.min(N - 1, Math.floor(t * N));
        pm.data._analysisColor = _rampColor(t);
      });
      aCatColors = _MA_RAMP.slice();
      const _fmtN = function(v) { return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(2); };
      for (let i = 0; i < N; i++) {
        aCatToVal[i] = _fmtN(mn + range * (i / N)) + ' – ' + _fmtN(mn + range * ((i + 1) / N));
      }
      _buildNumericLegend(fd, mn, mx);
    } else {
      const catPalette = {}, catOrder = [];
      features.forEach(function(f) {
        const v = String(f.properties?.[fd.field] ?? '—');
        if (!catPalette[v]) { catPalette[v] = _MA_CAT[catOrder.length % _MA_CAT.length]; catOrder.push(v); }
      });
      const valToCat = {}, counts = {};
      catOrder.forEach(function(v, i) { valToCat[v] = Math.min(i, 7); });
      catOrder.forEach(function(v, i) { aCatToVal[Math.min(i, 7)] = v; });
      pc._pcMarkers.forEach(function(pm) {
        const v = String((pm.data.feature?.properties || {})[fd.field] ?? '—');
        pm.category = valToCat[v] !== undefined ? valToCat[v] : 0;
        pm.data._analysisColor = catPalette[v] || '#888';
        counts[v] = (counts[v] || 0) + 1;
      });
      aCatColors = catOrder.map(function(v) { return catPalette[v]; });
      _buildCategoryLegend(fd, catPalette, counts);
    }
    // Marker singolo: colore analisi uniforme (dimensione dal campo stile originale)
    pc.PrepareLeafletMarker = function(leafletMarker, data) {
      if (!data.feature) return;
      if (leafletMarker._gsFeature !== data.feature) {
        leafletMarker._gsFeature = data.feature;
        const color = data._analysisColor || '#888';
        const _sm  = GEOSHEET.styles[data.layerName] || {};
        const _ld  = GEOSHEET.layers.find(function(l) { return l.name === data.layerName; });
        const _fld = _ld ? _ld.style_field : null;
        const _val = _fld ? String((data.feature.properties || {})[_fld] ?? '') : '__default__';
        const _s   = _sm[_val] || _sm['__default__'] || {};
        const _r   = _s.size != null ? Math.max(4, _s.size) : 8;
        const _d   = _r * 2;
        leafletMarker.setIcon(L.divIcon({
          html: '<svg width="' + _d + '" height="' + _d + '" viewBox="0 0 ' + _d + ' ' + _d
              + '" xmlns="http://www.w3.org/2000/svg">'
              + '<circle cx="' + _r + '" cy="' + _r + '" r="' + (_r-1) + '" '
              + 'fill="' + color + '" fill-opacity="0.85" stroke="' + color + '" stroke-width="1"/></svg>',
          className: '', iconSize: [_d,_d], iconAnchor: [_r,_r], popupAnchor: [0,-_r],
        }));
        leafletMarker.off();
        _bindFeatureInteraction(data.layerName, data.feature, leafletMarker);
      }
    };
    // Ciambella cluster con colori analisi
    pc.BuildLeafletClusterIcon = function(cluster) { return _buildDonutIcon(aCatColors, cluster); };
    // Tooltip con etichette analisi
    pc.BuildLeafletCluster = function(cluster, position) {
      const m    = pc._styleBuildCluster(cluster, position);
      const html = _clusterTooltipHtml(cluster, aCatColors, aCatToVal);
      if (html && m && m.bindTooltip) {
        m.bindTooltip(html, { className: 'gs-cluster-tt', direction: 'top', sticky: false, opacity: 1 });
      }
      return m;
    };
    // Forza ri-rendering
    map.removeLayer(pc);
    map.addLayer(pc);
    return;
  }

  // ── Layer geoJSON standard ───────────────────────────────────────────────
  if (fd.type === 'numeric') {
    const vals = features.map(f => Number(f.properties?.[fd.field]) || 0);
    const mn = Math.min(...vals), mx = Math.max(...vals);
    const range = mx - mn || 1;
    gjLayer.eachLayer(sub => {
      const v   = Number(sub.feature?.properties?.[fd.field]) || 0;
      const col = _rampColor((v - mn) / range);
      try { sub.setStyle({ fillColor: col, color: col, fillOpacity: 0.8, weight: 1 }); } catch(_) {}
    });
    _buildNumericLegend(fd, mn, mx);
  } else {
    const catPalette = {};
    const catOrder   = [];
    features.forEach(f => {
      const v = String(f.properties?.[fd.field] ?? '—');
      if (!catPalette[v]) { catPalette[v] = _MA_CAT[catOrder.length % _MA_CAT.length]; catOrder.push(v); }
    });
    const counts = {};
    gjLayer.eachLayer(sub => {
      const v   = String(sub.feature?.properties?.[fd.field] ?? '—');
      const col = catPalette[v] || '#888';
      counts[v] = (counts[v] || 0) + 1;
      try { sub.setStyle({ fillColor: col, color: col, fillOpacity: 0.8, weight: 1 }); } catch(_) {}
    });
    _buildCategoryLegend(fd, catPalette, counts);
  }
}

function _buildNumericLegend(fd, mn, mx) {
  const steps = 5;
  let html = `<div class="ma-legend-title">${fd.label}</div>`;
  for (let i = 0; i < steps; i++) {
    const t  = i / (steps - 1);
    const lo = mn + (mx - mn) * (i / steps);
    const hi = mn + (mx - mn) * ((i + 1) / steps);
    const fmt = v => Number.isInteger(v) ? v.toLocaleString() : v.toFixed(2);
    html += `<div class="ma-legend-item">
      <div class="ma-legend-dot" style="background:${_rampColor(t)};border-radius:2px;width:16px;height:10px;"></div>
      <span>${fmt(lo)} – ${fmt(hi)}</span>
    </div>`;
  }
  const leg = document.getElementById('maLegend');
  leg.innerHTML = html; leg.style.display = 'flex';
}

function _buildCategoryLegend(fd, palette, counts) {
  let html = `<div class="ma-legend-title">${fd.label}</div>`;
  Object.entries(palette).forEach(([v, col]) => {
    html += `<div class="ma-legend-item">
      <div class="ma-legend-dot" style="background:${col};"></div>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${v}</span>
      <span class="ma-legend-count">${counts[v] || 0}</span>
    </div>`;
  });
  const leg = document.getElementById('maLegend');
  leg.innerHTML = html; leg.style.display = 'flex';
}

function _resetAnalysisColors() {
  // Ripristina colori originali
  GEOSHEET.layers.forEach(ld => {
    const gjLayer = leafletLayers[ld.name];
    if (!gjLayer) return;
    // PruneCluster: ripristina categorie e funzioni originali, forza ri-rendering
    if (gjLayer._pcMarkers) {
      const pc = gjLayer;
      pc._pcMarkers.forEach(function(pm) {
        const fld = pc._styleField;
        const val = fld ? String((pm.data.feature?.properties || {})[fld] ?? '') : '__default__';
        pm.category = pc._valToCat[val] !== undefined ? pc._valToCat[val] : 0;
        delete pm.data._analysisColor;
      });
      pc.BuildLeafletClusterIcon = pc._origBuildIcon;
      pc.PrepareLeafletMarker    = pc._origPrepareMarker;
      pc.BuildLeafletCluster     = pc._styleBuildCluster;
      if (map.hasLayer(pc)) { map.removeLayer(pc); map.addLayer(pc); }
      return;
    }
    // Layer geoJSON standard: ripristina stile
    if (gjLayer.eachLayer) {
      gjLayer.eachLayer(sub => {
        try { sub.setStyle(getStyle(ld.name, sub.feature)); } catch(_) {}
      });
    }
  });

  // Ripristina visibilità salvata
  if (_maLayerSnapshot) {
    GEOSHEET.layers.forEach(ld => {
      const gl = leafletLayers[ld.name];
      if (!gl) return;
      const wasVisible = _maLayerSnapshot[ld.name];
      if (wasVisible && !map.hasLayer(gl))  map.addLayer(gl);
      if (!wasVisible && map.hasLayer(gl))  map.removeLayer(gl);
    });
    _maLayerSnapshot = null;
  }
  // Risincronizza checkbox
  _syncLayerCheckboxes(null);
}

// Aggiorna le checkbox nel pannello layer in base allo stato corrente
function _syncLayerCheckboxes() {
  GEOSHEET.layers.forEach(ld => {
    const cb = document.getElementById('chk-' + ld.name);
    const gl = leafletLayers[ld.name];
    if (cb && gl) cb.checked = map.hasLayer(gl);
  });
}

// Chiudi dropdown cliccando fuori dal pannello
document.addEventListener('click', function(e) {
  const panel = document.getElementById('map-analysis-panel');
  if (panel && !panel.contains(e.target)) _closeMaDropdown();
});

// Blocca propagazione eventi al map Leaflet (altrimenti il pannello sposta la mappa)
(function() {
  const panel = document.getElementById('map-analysis-panel');
  L.DomEvent.disableClickPropagation(panel);
  L.DomEvent.disableScrollPropagation(panel);
  // blocca anche mousedown così Leaflet non inizia il drag della mappa
  panel.addEventListener('mousedown', function(e) { e.stopPropagation(); });
})();

// Drag del pannello dall'header
(function initMaPanelDrag() {
  const panel  = document.getElementById('map-analysis-panel');
  const header = panel.querySelector('.ma-header');
  let dragging = false, startX, startY, startL, startT;

  header.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('ma-close-btn')) return;
    const mapRect   = document.getElementById('map').getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    startL = panelRect.left - mapRect.left;
    startT = panelRect.top  - mapRect.top;
    panel.style.bottom = 'auto'; panel.style.right = 'auto';
    panel.style.left   = startL + 'px';
    panel.style.top    = startT + 'px';
    startX = e.clientX; startY = e.clientY;
    dragging = true;
    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    const mapRect = document.getElementById('map').getBoundingClientRect();
    const maxL = mapRect.width  - panel.offsetWidth;
    const maxT = mapRect.height - panel.offsetHeight;
    panel.style.left = Math.min(Math.max(0, startL + e.clientX - startX), maxL) + 'px';
    panel.style.top  = Math.min(Math.max(0, startT + e.clientY - startY), maxT) + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = '';
  });
})();

// ═══════════════════════════════════════════════════════════════════
// TAB SWITCHING
// ═══════════════════════════════════════════════════════════════════
function showTab(name) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('pane-' + name).classList.add('active');
  document.querySelector('.tab-btn[data-tab="' + name + '"]').classList.add('active');
  if (name === 'stats') { buildStats(); }
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR TOGGLE
// ═══════════════════════════════════════════════════════════════════
const _isRight = document.body.classList.contains('sidebar-right');

function toggleSidebar() {
  const wrap = document.getElementById('sidebar-wrap');
  const btn  = document.getElementById('sidebar-toggle');
  const collapsed = wrap.classList.toggle('collapsed');
  // freccia: ‹ = chiudi (sinistra) / › = apri (sinistra); specchio per destra
  if (_isRight) {
    btn.innerHTML = collapsed ? '&#8250;' : '&#8249;';
  } else {
    btn.innerHTML = collapsed ? '&#8250;' : '&#8249;';
  }
  setTimeout(() => map.invalidateSize(), 260);
}

// ── Street View ───────────────────────────────────────────────────
(function initStreetView() {
  let _svMode = false;

  function _setSvMode(active) {
    _svMode = active;
    const btn  = document.getElementById('sv-control-btn');
    const hint = document.getElementById('sv-mode-hint');
    if (btn)  btn.classList.toggle('sv-active', active);
    if (hint) hint.classList.toggle('visible', active);
    map.getContainer().style.cursor = active ? 'crosshair' : '';
  }

  window.toggleStreetViewMode = function() {
    const wrap = document.getElementById('streetview-wrap');
    if (!_svMode) {
      // Apre il pannello e attiva modalita' click
      wrap.classList.add('sv-open');
      _setSvMode(true);
    } else {
      _setSvMode(false);
    }
  };

  window.closeStreetView = function() {
    _setSvMode(false);
    const wrap   = document.getElementById('streetview-wrap');
    const iframe = document.getElementById('streetview-iframe');
    const ph     = document.getElementById('streetview-placeholder');
    const coords = document.getElementById('streetview-coords');
    wrap.classList.remove('sv-open');
    iframe.src = 'about:blank';
    iframe.style.display = 'none';
    if (ph)     ph.style.display = 'flex';
    if (coords) coords.textContent = '';
  };

  // Helper: bearing geodetico A→B (0=N, 90=E, 180=S, 270=O)
  function _svBearing(lat1, lng1, lat2, lng2) {
    var f1 = lat1 * Math.PI / 180, f2 = lat2 * Math.PI / 180;
    var dl = (lng2 - lng1) * Math.PI / 180;
    var y  = Math.sin(dl) * Math.cos(f2);
    var x  = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }
  function _svCompass(deg) {
    var dirs = ['N','NE','E','SE','S','SO','O','NO'];
    return dirs[Math.round(deg / 45) % 8] + '\u00a0' + Math.round(deg) + '\u00b0';
  }

  // Click+Drag: mousedown = posizione, trascina = direzione
  map.on('mousedown', function(e) {
    if (!_svMode) return;
    if (e.originalEvent.button !== 0) return;

    var startLL  = e.latlng;
    var _svPin   = L.circleMarker(startLL, {
      radius: 9, fillColor: '#4285f4', color: '#fff',
      weight: 2.5, opacity: 1, fillOpacity: 0.9
    }).addTo(map);
    var _svLine  = null;
    var _svArrow = null;
    var _svHdg   = 0;
    var _svMoved = false;

    map.dragging.disable();
    L.DomEvent.preventDefault(e.originalEvent);

    function _updateDrag(endLL) {
      _svMoved = true;
      _svHdg   = _svBearing(startLL.lat, startLL.lng, endLL.lat, endLL.lng);
      if (_svLine)  { map.removeLayer(_svLine);  _svLine  = null; }
      if (_svArrow) { map.removeLayer(_svArrow); _svArrow = null; }
      _svLine = L.polyline([startLL, endLL], {
        color: '#4285f4', weight: 2, dashArray: '7,5', opacity: 0.9
      }).addTo(map);
      _svArrow = L.marker(endLL, {
        icon: L.divIcon({
          html: '<div style="width:0;height:0;'
              + 'border-left:7px solid transparent;'
              + 'border-right:7px solid transparent;'
              + 'border-bottom:18px solid #4285f4;'
              + 'transform:rotate(' + _svHdg + 'deg);'
              + 'transform-origin:50% 100%;'
              + 'filter:drop-shadow(0 1px 3px rgba(0,0,0,.45))'
              + '"></div>',
          iconSize: [14, 18], iconAnchor: [7, 18], className: ''
        }),
        interactive: false
      }).addTo(map);
      var hint = document.getElementById('sv-mode-hint');
      if (hint) hint.textContent = '\ud83e\uddad\u00a0Direzione: ' + _svCompass(_svHdg) + ' \u2014 rilascia per aprire';
    }

    function onMove(ev) { _updateDrag(ev.latlng); }

    function onUp() {
      map.off('mousemove', onMove);
      map.off('mouseup',   onUp);
      map.dragging.enable();
      if (_svPin)   { map.removeLayer(_svPin);   _svPin   = null; }
      if (_svLine)  { map.removeLayer(_svLine);  _svLine  = null; }
      if (_svArrow) { map.removeLayer(_svArrow); _svArrow = null; }
      var hint = document.getElementById('sv-mode-hint');
      if (hint) hint.textContent = '\ud83d\udcf7\u00a0Clicca sulla mappa per aprire Street View';

      var wrap   = document.getElementById('streetview-wrap');
      var iframe = document.getElementById('streetview-iframe');
      var ph     = document.getElementById('streetview-placeholder');
      var coords = document.getElementById('streetview-coords');
      var lat    = startLL.lat.toFixed(6);
      var lng    = startLL.lng.toFixed(6);
      var hdg    = Math.round(_svHdg);
      if (!wrap.classList.contains('sv-open')) wrap.classList.add('sv-open');
      iframe.src = 'streetview.html?lat=' + lat + '&lng=' + lng + '&heading=' + hdg;
      iframe.style.display = 'block';
      if (ph)     ph.style.display = 'none';
      if (coords) coords.textContent = lat + ', ' + lng + '\u2002\u2192\u2002' + _svCompass(hdg);
    }

    map.on('mousemove', onMove);
    map.on('mouseup',   onUp);
  });

  // Resize pannello StreetView
  (function() {
    const resizer = document.getElementById('streetview-resizer');
    const wrap    = document.getElementById('streetview-wrap');
    if (!resizer || !wrap) return;
    resizer.addEventListener('mousedown', function(e) {
      if (!wrap.classList.contains('sv-open')) return;
      e.preventDefault();
      wrap.style.transition = 'none';
      resizer.classList.add('is-resizing');
      document.body.style.cursor     = 'col-resize';
      document.body.style.userSelect = 'none';
      const startX = e.pageX;
      const startW = wrap.offsetWidth;
      function onMove(ev) {
        const w = Math.min(900, Math.max(200, startW - (ev.pageX - startX)));
        wrap.style.width = w + 'px';
      }
      function onUp() {
        wrap.style.transition          = '';
        resizer.classList.remove('is-resizing');
        document.body.style.cursor     = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
        map.invalidateSize();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onUp);
    });
  })();

  // ESC: disattiva modalità e/o chiude il pannello
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    const wrap = document.getElementById('streetview-wrap');
    if (_svMode) {
      _setSvMode(false);
    } else if (wrap && wrap.classList.contains('sv-open')) {
      window.closeStreetView();
    }
  });
})();

// ── Ridimensionamento sidebar ──────────────────────────────────────
(function initSidebarResize() {
  const wrap    = document.getElementById('sidebar-wrap');
  const sidebar = document.getElementById('sidebar');
  const handle  = document.getElementById('sidebar-resizer');
  const MIN_W = 180, MAX_W = 600;

  handle.addEventListener('mousedown', function(e) {
    if (wrap.classList.contains('collapsed')) return;
    e.preventDefault();
    wrap.style.transition = 'none';
    handle.classList.add('is-resizing');
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';

    const startX = e.pageX;
    const startW = wrap.offsetWidth;

    function onMove(e) {
      const diff = _isRight ? startX - e.pageX : e.pageX - startX;
      const w    = Math.min(MAX_W, Math.max(MIN_W, startW + diff));
      wrap.style.width    = w + 'px';
      sidebar.style.width = w + 'px';
    }
    function onUp() {
      wrap.style.transition          = '';
      handle.classList.remove('is-resizing');
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      map.invalidateSize();
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });
})();

// ── Ridimensionamento sezioni Layer / Legenda ──────────────────────
(function initLayersPanelResize() {
  const handle = document.getElementById('layers-resizer');
  const top    = document.getElementById('layers-top');
  const pane   = document.getElementById('pane-layers');
  if (!handle || !top || !pane) return;
  const MIN_H = 60;

  handle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    handle.classList.add('is-resizing');
    document.body.style.cursor     = 'row-resize';
    document.body.style.userSelect = 'none';

    const startY = e.pageY;
    const startH = top.getBoundingClientRect().height;

    function onMove(e) {
      const paneH  = pane.getBoundingClientRect().height;
      const newH   = Math.min(paneH - MIN_H - 6, Math.max(MIN_H, startH + e.pageY - startY));
      top.style.flex = '0 0 ' + newH + 'px';
    }
    function onUp() {
      handle.classList.remove('is-resizing');
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });
})();

// ═══════════════════════════════════════════════════════════════════
// TAB PERSONALIZZATO
// ═══════════════════════════════════════════════════════════════════
(function initCustomTabs() {
  const _customTabs = [{"id": "custom0", "content": "Disclaimer: I contenuti presenti in questa sezione, compresi testi ed elementi grafici, hanno carattere puramente informativo e divulgativo. \nNon sono presenti dati personali o sensibili. Si precisa che questi materiali non costituiscono documenti ufficiali né hanno alcun valore legale.\nPer consultare la documentazione ufficiale e legalmente vincolante, si prega di fare riferimento agli atti definitivi allegati alle relative deliberazioni degli organi competenti.\n\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Cras congue mi id pharetra ornare. Sed laoreet congue mauris, nec dictum mi auctor ullamcorper. Proin dolor mauris, facilisis at nisl non, pellentesque ultricies sem. Quisque ac quam ac libero tempor fermentum. In efficitur ligula vitae accumsan consectetur. Nam et eleifend est, non lacinia mauris. Donec dolor dui, dapibus vel dignissim non, malesuada consectetur ante. Aliquam erat volutpat. Phasellus enim nisi, rhoncus in nunc dapibus, ultrices iaculis est. In hac habitasse platea dictumst. Mauris eget massa quis elit tincidunt varius. Sed vulputate arcu nisi, vitae consequat mi faucibus in. Sed non dui at lacus molestie semper. Nam ultrices ex id nunc porta fermentum.\n\nMauris egestas quam at lacinia mattis. Maecenas tempor, dui ultricies pharetra tempor, purus risus euismod libero, id consectetur turpis ligula sed lacus. Maecenas molestie varius ante, sit amet varius nisl semper sed. Vestibulum non dui lacinia, maximus risus sed, posuere diam. In et suscipit nibh. Aliquam venenatis nec diam eget fringilla. Cras aliquet tempor dignissim. Sed aliquet quis ligula vel blandit. Vestibulum a sapien feugiat, ullamcorper orci sit amet, mattis massa. Donec quis pellentesque libero."}, {"id": "custom1", "content": "Disclaimer: I contenuti presenti in questa sezione, compresi testi ed elementi grafici, hanno carattere puramente informativo e divulgativo. \nNon sono presenti dati personali o sensibili. Si precisa che questi materiali non costituiscono documenti ufficiali né hanno alcun valore legale.\nPer consultare la documentazione ufficiale e legalmente vincolante, si prega di fare riferimento agli atti definitivi allegati alle relative deliberazioni degli organi competenti.\n\nEtiam mollis mauris ut magna pharetra blandit. Proin libero justo, posuere ac mi in, luctus vehicula ex. Praesent blandit non nisl id suscipit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec volutpat laoreet tortor, eu varius ligula molestie sit amet. Aliquam suscipit molestie nulla. Quisque sit amet sollicitudin massa. Sed dapibus ipsum ante, et tristique dolor accumsan eget. In venenatis, nisi nec sodales fringilla, metus felis blandit libero, vitae auctor felis orci ut tortor. Nunc egestas odio at sapien consequat porttitor. Integer molestie ac lacus sed ultrices. Praesent iaculis justo eu velit aliquet, ut egestas nisi aliquet.\n\nNulla facilisi. Praesent non magna vitae purus malesuada sodales. Donec id feugiat est, nec vulputate tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut ullamcorper neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed dignissim varius arcu, a mollis massa blandit a. Nullam tincidunt dolor et ante fermentum, in semper elit mattis. Sed porta et ipsum eu mollis.\n\nMauris lorem urna, sagittis vel tempus ac, condimentum sed sapien. Praesent scelerisque sollicitudin malesuada. Etiam aliquam vulputate felis, id interdum erat. Duis tincidunt, erat quis varius euismod, mi justo blandit ipsum, ac pulvinar dolor augue non odio. Ut commodo, orci nec fermentum scelerisque, enim metus porta risus, id blandit elit neque at odio. Nulla quam massa, faucibus vitae elementum id, ultrices vel tellus. Etiam faucibus imperdiet ex, nec convallis metus fermentum ut. Proin placerat nulla sit amet lectus fringilla, id euismod leo rutrum. Nullam id vulputate urna. Aliquam fermentum, ipsum et pharetra pretium, quam metus porta sapien, vel porta mi velit eu justo. Quisque est eros, tempor in metus eget, iaculis porta dolor."}];
  if (!_customTabs || !_customTabs.length) return;
  _customTabs.forEach(function(t) {
    const el = document.getElementById('pane-' + t.id);
    if (!el || !t.content) return;
    const div = document.createElement('div');
    const isHTML = t.content.trimStart().startsWith('<');
    if (isHTML) {
      div.className = 'custom-content';
      div.innerHTML = t.content;
    } else if (typeof marked !== 'undefined') {
      div.className = 'custom-content markdown';
      div.innerHTML = marked.parse(t.content);
    } else {
      div.className = 'custom-content';
      div.textContent = t.content;
    }
    el.appendChild(div);
  });
})();

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
buildLayersList();
buildLegend();
initTableTab();
// ═══════════════════════════════════════════════════════════════════
// LAYER ESTERNI — aggiunta dinamica da browser
// ═══════════════════════════════════════════════════════════════════
var _extLayersCounter = 0;
var _extLayersMap = {};  // id -> {layer, name, type}

function openAddLayerModal() {
  document.getElementById('alm-type').value = '';
  document.getElementById('alm-label').value = '';
  document.getElementById('alm-url').value = '';
  document.getElementById('alm-wms-layers').value = '';
  document.getElementById('alm-attr').value = '';
  document.getElementById('alm-opacity').value = 1;
  document.getElementById('alm-opacity-val').textContent = '1.00';
  var fi = document.getElementById('alm-file'); if (fi) fi.value = '';
  document.getElementById('alm-url-row').style.display  = 'flex';
  document.getElementById('alm-file-row').style.display = 'none';
  document.getElementById('alm-wms-rows').style.display = 'none';
  document.getElementById('add-layer-modal-overlay').classList.add('open');
}

function closeAddLayerModal() {
  document.getElementById('add-layer-modal-overlay').classList.remove('open');
}

function onAlmTypeChange() {
  var t = document.getElementById('alm-type').value;
  document.getElementById('alm-url-row').style.display  = (t === 'geojson_file') ? 'none' : 'flex';
  document.getElementById('alm-file-row').style.display = (t === 'geojson_file') ? 'flex' : 'none';
  document.getElementById('alm-wms-rows').style.display = (t === 'wms')          ? 'block' : 'none';
}

function _almPopupFn(f, l) {
  if (!f.properties || !Object.keys(f.properties).length) return;
  var rows = Object.entries(f.properties).map(function(kv) {
    return '<tr><th style="text-align:left;padding:2px 8px 2px 0;color:#555;white-space:nowrap">'
      + String(kv[0]) + '</th><td>' + (kv[1] === null ? '<em>null</em>' : String(kv[1])) + '</td></tr>';
  }).join('');
  l.bindPopup('<table style="font-size:12px;border-collapse:collapse">' + rows + '</table>');
}

function doAddExtLayer() {
  var t       = document.getElementById('alm-type').value;
  var label   = document.getElementById('alm-label').value.trim();
  var url     = document.getElementById('alm-url').value.trim();
  var opacity = parseFloat(document.getElementById('alm-opacity').value) || 1;
  var attr    = document.getElementById('alm-attr').value.trim();

  if (!t)     { alert('Seleziona una tipologia di layer.'); return; }
  if (!label) { alert('Inserisci un nome / etichetta.'); return; }

  if (t === 'wms') {
    if (!url) { alert('Inserisci l\'URL del servizio WMS.'); return; }
    var wmsLayers = document.getElementById('alm-wms-layers').value.trim();
    var wmsFormat = document.getElementById('alm-wms-format').value;
    var lyr = L.tileLayer.wms(url, {
      layers: wmsLayers, format: wmsFormat,
      transparent: true, attribution: attr, opacity: opacity,
    });
    _registerExtLayer(lyr, label, 'WMS');

  } else if (t === 'geojson_url') {
    if (!url) { alert('Inserisci l\'URL del file GeoJSON.'); return; }
    var lyr = L.geoJSON(null, {
      attribution: attr,
      style: function() { return { opacity: opacity, fillOpacity: Math.min(opacity * 0.5, 0.7) }; },
      onEachFeature: _almPopupFn,
    });
    fetch(url)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + r.statusText);
        return r.json();
      })
      .then(function(data) { lyr.addData(data); })
      .catch(function(e) { alert('Errore nel caricamento GeoJSON:\n' + e.message); });
    _registerExtLayer(lyr, label, 'GeoJSON');

  } else if (t === 'geojson_file') {
    var fileInput = document.getElementById('alm-file');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      alert('Seleziona un file GeoJSON.'); return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        var lyr = L.geoJSON(data, {
          attribution: attr,
          style: function() { return { opacity: opacity, fillOpacity: Math.min(opacity * 0.5, 0.7) }; },
          onEachFeature: _almPopupFn,
        });
        _registerExtLayer(lyr, label, 'File');
      } catch(err) {
        alert('File GeoJSON non valido:\n' + err.message);
      }
    };
    reader.readAsText(fileInput.files[0]);
    closeAddLayerModal();
    return;  // chiudiamo subito, il layer viene aggiunto nel callback
  }
  closeAddLayerModal();
}

function _registerExtLayer(lyr, label, typeLabel) {
  var id = 'ext_' + (++_extLayersCounter);
  lyr.addTo(map);
  _extLayersMap[id] = { layer: lyr, name: label, type: typeLabel };
  leafletLayers['__ext__' + id] = lyr;

  var sec = document.getElementById('ext-layers-list');
  var row = document.createElement('div');
  row.className = 'ext-layer-row';
  row.id = 'ext-row-' + id;
  row.innerHTML =
    '<input class="ext-layer-toggle" type="checkbox" checked title="Mostra/nascondi"' +
    ' onchange="toggleExtLayer(\'' + id + '\',this.checked)">' +
    '<span class="ext-layer-name" title="' + label + '">' + label + '</span>' +
    '<span class="ext-layer-badge">' + typeLabel + '</span>' +
    '<button class="ext-layer-rm" title="Rimuovi layer" onclick="removeExtLayer(\'' + id + '\')">&#215;</button>';
  sec.appendChild(row);
}

function toggleExtLayer(id, visible) {
  var entry = _extLayersMap[id];
  if (!entry) return;
  if (visible) map.addLayer(entry.layer);
  else         map.removeLayer(entry.layer);
}

function removeExtLayer(id) {
  var entry = _extLayersMap[id];
  if (!entry) return;
  map.removeLayer(entry.layer);
  delete _extLayersMap[id];
  delete leafletLayers['__ext__' + id];
  var row = document.getElementById('ext-row-' + id);
  if (row) row.remove();
}