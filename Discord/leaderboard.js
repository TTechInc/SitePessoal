/* Leaderboard do servidor de Discord
   Pede os dados a leaderboard.php?sort=<coluna>&page=<n> (25 por página)
   e espera um array JSON com: Nome, NIVEL, XP, NumProjetos, Bumps. */

const POR_PAGINA = 25;
const COLUNAS = ["NIVEL", "XP", "NumProjetos", "Bumps"];

let paginaAtual = 1;
let ordenacaoAtual = "NIVEL";
let pedidoAtual = 0; // ignora respostas antigas se o utilizador mudar a ordenação a meio
let aCarregar = false;

const tbody = document.querySelector("#leaderboard-body");
const botaoMais = document.getElementById("loadMoreBtn");
const estado = document.getElementById("leaderboard-status");

function linhaEstado(texto, erro = false) {
    const tr = document.createElement("tr");
    tr.className = "state-row" + (erro ? " error" : "");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = texto;
    tr.appendChild(td);
    return tr;
}

function celula(texto, classe) {
    const td = document.createElement("td");
    td.textContent = texto; // textContent: nomes do Discord nunca são interpretados como HTML
    if (classe) td.className = classe;
    return td;
}

function criarLinha(user, posicao) {
    const medalhas = { 1: "🥇", 2: "🥈", 3: "🥉" };
    const tr = document.createElement("tr");
    if (posicao <= 3 && ordenacaoAtual) tr.className = `top-${posicao}`;

    const marcado = (coluna) => (coluna === ordenacaoAtual ? " is-sorted" : "");

    tr.appendChild(celula(medalhas[posicao] || posicao, "rank-medal"));
    tr.appendChild(celula(user.Nome || "Utilizador Desconhecido", "name"));
    tr.appendChild(celula(user.NIVEL ?? 0, marcado("NIVEL").trim()));
    tr.appendChild(celula(Number(user.XP ?? 0).toLocaleString("pt-PT"), marcado("XP").trim()));
    tr.appendChild(celula(user.NumProjetos ?? 0, marcado("NumProjetos").trim()));
    tr.appendChild(celula(user.Bumps ?? 0, marcado("Bumps").trim()));
    return tr;
}

async function carregarLeaderboard(reset = false) {
    if (aCarregar && !reset) return;

    const pedido = ++pedidoAtual;
    aCarregar = true;
    botaoMais.disabled = true;
    estado.textContent = "";

    if (reset) {
        tbody.replaceChildren(linhaEstado("A carregar…"));
        botaoMais.hidden = true;
    }

    try {
        const resposta = await fetch(
            `leaderboard.php?sort=${encodeURIComponent(ordenacaoAtual)}&page=${paginaAtual}`
        );
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

        const dados = await resposta.json();
        if (!Array.isArray(dados)) throw new Error("Resposta inválida");

        if (pedido !== pedidoAtual) return; // chegou tarde, já há um pedido mais recente

        if (reset) tbody.replaceChildren();

        if (paginaAtual === 1 && dados.length === 0) {
            tbody.replaceChildren(linhaEstado("Ainda não há membros no ranking."));
        }

        const fragmento = document.createDocumentFragment();
        dados.forEach((user, index) => {
            fragmento.appendChild(criarLinha(user, (paginaAtual - 1) * POR_PAGINA + index + 1));
        });
        tbody.appendChild(fragmento);

        // só mostra "Carregar mais" se a página veio cheia
        botaoMais.hidden = dados.length < POR_PAGINA;
        if (dados.length < POR_PAGINA && paginaAtual > 1) {
            estado.textContent = "Chegou ao fim do ranking.";
        }
    } catch (erro) {
        if (pedido !== pedidoAtual) return;
        console.error("Leaderboard:", erro);

        if (reset || paginaAtual === 1) {
            tbody.replaceChildren(linhaEstado("Não foi possível carregar o ranking. Tente novamente mais tarde.", true));
            botaoMais.hidden = true;
        } else {
            paginaAtual--; // permite tentar de novo a mesma página
            estado.textContent = "Não foi possível carregar mais resultados. Tente novamente.";
            botaoMais.hidden = false;
        }
    } finally {
        if (pedido === pedidoAtual) {
            aCarregar = false;
            botaoMais.disabled = false;
        }
        atualizarCabecalho();
    }
}

function atualizarCabecalho() {
    document.querySelectorAll(".leaderboard-table th[data-sort]").forEach((th) => {
        th.setAttribute(
            "aria-sort",
            th.dataset.sort === ordenacaoAtual ? "descending" : "none"
        );
    });
}

function ordenar(coluna) {
    if (!COLUNAS.includes(coluna)) return;
    ordenacaoAtual = coluna;
    paginaAtual = 1;
    aCarregar = false;
    atualizarCabecalho();
    carregarLeaderboard(true);
}

function carregarMais() {
    if (aCarregar) return;
    paginaAtual++;
    carregarLeaderboard();
}

document.querySelectorAll(".leaderboard-table th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => ordenar(th.dataset.sort));
});
botaoMais.addEventListener("click", carregarMais);

carregarLeaderboard(true);
