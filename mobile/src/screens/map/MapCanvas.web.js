import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { CT_CENTER, raioOf } from '../../theme';

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export default function MapCanvasWeb({
  rows,
  onSelect,
  userPos,
  fitSignal = 0,
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handler = (event) => {
      const data = event.data;
      if (data && data.source === 'verde-map' && data.key) {
        onSelect?.(data.key);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onSelect]);

  const html = useMemo(() => {
    const payload = rows.map((row) => ({
      key: row.key,
      lat: row.lat,
      lng: row.lng,
      color: row.color,
      raio: raioOf(row.status, row.raio),
      poligono: row.poligono
        ? row.poligono.map((p) => [p.latitude, p.longitude])
        : null,
      dash: !(row.kind === 'area' && row.status === 'reflorestada'),
      label: row.kind === 'denuncia' ? '!' : '',
    }));

    const user = userPos
      ? { lat: userPos.lat, lng: userPos.lng }
      : null;
    const fit = fitSignal > 0;

    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; background: #E8E6DF; }
    .pin {
      width: 26px; height: 26px; border-radius: 50%; border: 3px solid #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,.4); display: flex; align-items: center;
      justify-content: center; color: #fff; font-weight: 800; font-size: 13px;
      font-family: -apple-system, system-ui, sans-serif; box-sizing: border-box;
    }
    .user {
      width: 18px; height: 18px; border-radius: 50%; background: #2563EB;
      border: 3px solid #fff; box-sizing: border-box;
      box-shadow: 0 0 0 6px rgba(37,99,235,.25), 0 2px 10px rgba(0,0,0,.35);
    }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    (function () {
      var rows = ${safeJson(payload)};
      var user = ${safeJson(user)};
      var fit = ${fit ? 'true' : 'false'};

      var map = L.map('map', { zoomControl: false, attributionControl: false })
        .setView([${CT_CENTER.latitude}, ${CT_CENTER.longitude}], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      function pick(key) {
        window.parent.postMessage({ source: 'verde-map', key: key }, '*');
      }

      rows.forEach(function (r) {
        var opts = {
          color: r.color,
          weight: 2,
          opacity: 0.95,
          fillColor: r.color,
          fillOpacity: 0.22
        };
        if (r.dash) opts.dashArray = '6 4';

        var layer = r.poligono
          ? L.polygon(r.poligono, opts)
          : L.circle([r.lat, r.lng], Object.assign({ radius: r.raio || 180 }, opts));

        layer.on('click', function () { pick(r.key); });
        layer.addTo(map);

        var icon = L.divIcon({
          className: '',
          html: '<div class="pin" style="background:' + r.color + '">' + r.label + '</div>',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        L.marker([r.lat, r.lng], { icon: icon })
          .on('click', function () { pick(r.key); })
          .addTo(map);
      });

      if (user) {
        L.circle([user.lat, user.lng], {
          radius: 1800,
          color: '#2563EB',
          weight: 1.5,
          opacity: 0.8,
          fillColor: '#2563EB',
          fillOpacity: 0.08
        }).addTo(map);

        L.marker([user.lat, user.lng], {
          icon: L.divIcon({
            className: '',
            html: '<div class="user"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          })
        }).addTo(map);
      }

      var pts = rows.map(function (r) { return [r.lat, r.lng]; });
      if (user) pts.push([user.lat, user.lng]);

      if (fit && pts.length) {
        map.fitBounds(L.latLngBounds(pts).pad(0.25));
      } else if (user) {
        map.setView([user.lat, user.lng], 14);
      }
    })();
  </script>
</body>
</html>`;
  }, [rows, userPos, fitSignal]);

  return (
    <iframe
      title="Mapa Ambiental"
      srcDoc={html}
      style={styles.iframe}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}

const styles = {
  iframe: {
    flex: 1,
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
  },
};

const sheet = StyleSheet.create({});
export { sheet };
