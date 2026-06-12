const dados = [
    { id: 301, transportadora: "RotaMax", regiao: "Sudeste", prazo: 3, reais: 7 },
    { id: 302, transportadora: "ViaCargo", regiao: "Sul", prazo: 5, reais: 5 },
    { id: 303, transportadora: "FlashLog", regiao: "Nordeste", prazo: 4, reais: 9 },
    { id: 304, transportadora: "RotaMax", regiao: "Norte", prazo: 6, reais: 4 },
    { id: 305, transportadora: "ViaCargo", regiao: "Centro-Oeste", prazo: 2, reais: 6 },
    { id: 306, transportadora: "FlashLog", regiao: "Sul", prazo: 5, reais: 12 },
    { id: 307, transportadora: "RotaMax", regiao: "Sul", prazo: 6, reais: 9 },
    { id: 308, transportadora: "ViaCargo", regiao: "Sudeste", prazo: 3, reais: 4 },
    { id: 309, transportadora: "FlashLog", regiao: "Norte", prazo: 5, reais: 5 },
    { id: 310, transportadora: "ViaCargo", regiao: "Nordeste", prazo: 4, reais: 8 }
];
let grafico1;
let grafico2;
function carregar(lista) {
    let tbody = document.getElementById("tabela");
    tbody.innerHTML = "";
    let atrasadas = 0;
    let maior = 0;
    lista.forEach(e => {
        let status = "No prazo";
        let classe = "ok";
        if (e.reais > e.prazo) {
            status = "Atrasada";
            classe = "atrasado";
            atrasadas++;
            if ((e.reais - e.prazo) > maior) {
                maior = e.reais - e.prazo;
            }
        }
    tbody.innerHTML += `

        <tr class="${classe}">
            <td>${e.id}</td>
            <td>${e.transportadora}</td>
            <td>${e.regiao}</td>
            <td>${e.prazo}</td>
            <td>${e.reais}</td>
            <td>${status}</td>
        </tr>
    
    `;

    });

    document.getElementById("total").innerHTML = lista.length;
    document.getElementById("atrasadas").innerHTML = atrasadas;
    document.getElementById("prazo").innerHTML = lista.length - atrasadas;
    document.getElementById("percentual").innerHTML = ((atrasadas / lista.length) * 100).toFixed(0) + "%";
    document.getElementById("maior").innerHTML = maior + " dias";
    ranking(lista);
    graficos(lista);
    alerta(lista);
}
function ranking(lista) {
    let atrasadas = lista.filter(x => x.reais > x.prazo);
    atrasadas.sort((a, b) => (b.reais - b.prazo) - (a.reais - a.prazo));
    let html = "";
    atrasadas.forEach(x => {
    html += `
        <tr>
            <td>${x.id}</td>
            <td>${x.transportadora}</td>
            <td>${x.regiao}</td>
            <td>${x.reais - x.prazo} dias</td>
        </tr>
    
    `;

    });
    document.getElementById("ranking").innerHTML = html;
}

function graficos(lista) {
    let t = {};
    let r = {};
    lista.forEach(x => {
        if (x.reais > x.prazo) {
            t[x.transportadora] = (t[x.transportadora] || 0) + 1;
            r[x.regiao] = (r[x.regiao] || 0) + 1;
        }
    });
    if (grafico1) grafico1.destroy();
    if (grafico2) grafico2.destroy();
    grafico1 = new Chart(document.getElementById("graficoTransportadora"), {
        type: "bar",
        data: {
            labels: Object.keys(t),
            datasets: [{
                label: "Atrasos",
                data: Object.values(t)
            }]
        }
    });

    grafico2 = new Chart(document.getElementById("graficoRegiao"), {
        type: "pie",
        data: {
            labels: Object.keys(r),
            datasets: [{
                data: Object.values(r)
            }]
        }
    });
}

function alerta(lista) {
    let pior = lista.filter(x => x.reais > x.prazo);
    pior.sort((a, b) => (b.reais - b.prazo) - (a.reais - a.prazo));
    document.getElementById("alerta").innerHTML =
        "ALERTA: Entrega " + pior[0].id +
        " possui o maior atraso (" +
        (pior[0].reais - pior[0].prazo) + " dias).";
}
function filtrar() {
    let t = document.getElementById("filtroTransportadora").value;
    let r = document.getElementById("filtroRegiao").value;
    let lista = dados.filter(x =>
        (t == "Todas" || x.transportadora == t) &&
        (r == "Todas" || x.regiao == r)
    );
    carregar(lista);
}

carregar(dados);