// --- CARGA DEL CSV DESDE RAW GITHUB (ARCHIVOS GRANDES) ---
const CSV_URL = "https://raw.githubusercontent.com/csampedr/MadridLocal/main/data/negocios_scored.csv";

// --- MANEJO DEL FORMULARIO ---
document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;
            filtrarLocales(data);
        }
    });
});

// --- FILTRADO ---
function filtrarLocales(data) {
    const tipo = document.getElementById("tipo_negocio").value;
    const publico = document.getElementById("publico_objetivo").value;
    const terraza = document.getElementById("terraza").value;
    const nocturno = document.getElementById("horario_nocturno").value;
    const presupuesto = parseFloat(document.getElementById("presupuesto").value);
    const metros = parseFloat(document.getElementById("metros").value);

    const filtrados = data.filter(l => 
        l.desc_epigrafe === tipo &&
        parseFloat(l[`score_${publico}_real`]) > 0 &&
        l.terraza == terraza &&
        l.horario_nocturno == nocturno &&
        parseFloat(l.precio_estimado) <= presupuesto &&
        parseFloat(l.superficie_m2) >= metros
    );

    mostrarLocales(filtrados);
    mostrarMapa(filtrados);
    mostrarHeatmap(filtrados);
}

// --- LISTA DE LOCALES ---
function mostrarLocales(locales) {
    const lista = document.getElementById("lista_locales");
    lista.innerHTML = "";

    locales.forEach(l => {
        const li = document.createElement("li");
        li.textContent = `${l.desc_barrio_local} — ${l.desc_epigrafe} — ${l.lat}, ${l.lon}`;
        lista.appendChild(li);
    });
}

// --- MAPA PRINCIPAL ---
function mostrarMapa(locales) {
    // Si ya existe un mapa, destruirlo
    if (window.map) {
        window.map.remove();
    }

    window.map = L.map("map").setView([40.4168, -3.7038], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(window.map);

    locales.forEach(l => {
        if (l.lat && l.lon) {
            L.marker([l.lat, l.lon]).addTo(window.map);
        }
    });
}

// --- HEATMAP ---
function mostrarHeatmap(locales) {
    // Si ya existe un heatmap, destruirlo
    if (window.heat) {
        window.heat.remove();
    }

    window.heat = L.map("heatmap").setView([40.4168, -3.7038], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(window.heat);

    const puntos = locales
        .filter(l => l.lat && l.lon)
        .map(l => [parseFloat(l.lat), parseFloat(l.lon), 0.5]);

    L.heatLayer(puntos, { radius: 25 }).addTo(window.heat);
}



