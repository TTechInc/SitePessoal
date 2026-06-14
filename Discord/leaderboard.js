let paginaAtual = 1;
let ordenacaoAtual = "NIVEL";

const tbody = document.querySelector("#leaderboard-body");

async function carregarLeaderboard(reset = false) {

    const response = await fetch(
        `leaderboard.php?sort=${ordenacaoAtual}&page=${paginaAtual}`
    );

    const dados = await response.json();

    if (reset) {
        tbody.innerHTML = "";
    }

    dados.forEach((user, index) => {

        const posicao = ((paginaAtual - 1) * 25) + index + 1;

        let ranking = posicao;

        if (posicao === 1) ranking = "🥇";
        else if (posicao === 2) ranking = "🥈";
        else if (posicao === 3) ranking = "🥉";

        tbody.innerHTML += `
        <tr>

            <td class="rank-medal">
                ${ranking}
            </td>

            <td>${user.ID}</td>

            <td>${user.NIVEL ?? 0}</td>
            <td>${Number(user.XP ?? 0).toLocaleString("pt-PT")}</td>
            <td>${user.NumProjetos ?? 0}</td>
            <td>${user.Bumps ?? 0}</td>

        </tr>
        `;
    });

    atualizarCabecalho();
}

function atualizarCabecalho() {

    document
        .querySelectorAll(".leaderboard-table th")
        .forEach(el => el.classList.remove("leaderboard-active"));

    if (ordenacaoAtual === "NIVEL")
        document.getElementById("sort-nivel")
            .classList.add("leaderboard-active");

    if (ordenacaoAtual === "XP")
        document.getElementById("sort-xp")
            .classList.add("leaderboard-active");

    if (ordenacaoAtual === "NumProjetos")
        document.getElementById("sort-projetos")
            .classList.add("leaderboard-active");

    if (ordenacaoAtual === "Bumps")
        document.getElementById("sort-bumps")
            .classList.add("leaderboard-active");
}

function ordenar(coluna) {

    ordenacaoAtual = coluna;

    paginaAtual = 1;

    carregarLeaderboard(true);
}

function carregarMais() {

    paginaAtual++;

    carregarLeaderboard();
}

carregarLeaderboard();