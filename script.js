// MAPA DE LOCALES
var map = L.map('map').setView([40.4168, -3.7038], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

if (locales) {
    locales.forEach(l => {
        L.marker([l.lat, l.lon]).addTo(map)
            .bindPopup(`${l.desc_barrio_local} - ${l.desc_epigrafe}`);
    });
}

// MAPA DE CALOR (ejemplo usando lat/lon de todos los locales)
var heat = L.map('heatmap').setView([40.4168, -3.7038], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(heat);

var heatData = locales ? locales.map(l => [l.lat, l.lon, 0.5]) : [];
L.heatLayer(heatData, {radius: 25}).addTo(heat);
