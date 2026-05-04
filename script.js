document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();

    Papa.parse("https://raw.githubusercontent.com/csampedr/MadridLocal/main/data/negocios_scored.csv", {
    download: true,
    header: true,
    complete: function(results) {
        filtrarLocales(results.data);
    }
});
});

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

function mostrarLocales(locales) {
    const lista = document.getElementById("lista_locales");
    lista.innerHTML = "";

    locales.forEach(l => {
        const li = document.createElement("li");
        li.textContent = `${l.desc_barrio_local} — ${l.desc_epigrafe} — ${l.lat}, ${l.lon}`;
        lista.appendChild(li);
    });
}

function mostrarMapa(locales) {
    const map = L.map("map").setView([40.4168, -3.7038], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    locales.forEach(l => {
        L.marker([l.lat, l.lon]).addTo(map);
    });
}

function mostrarHeatmap(locales) {
    const heat = L.map("heatmap").setView([40.4168, -3.7038], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(heat);

    const puntos = locales.map(l => [l.lat, l.lon, 0.5]);
    L.heatLayer(puntos, { radius: 25 }).addTo(heat);
}


