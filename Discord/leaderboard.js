let paginaAtual = 1;
let ordenacaoAtual = "XP";

const tbody = document.querySelector("#leaderboard-body");

async function carregarLeaderboard(reset = false) {

    const response = await fetch(
        `leaderboard.php?sort=${ordenacaoAtual}&page=${paginaAtual}`
    );

    const dados = await response.json();

    if(reset){
        tbody.innerHTML = "";
    }

    dados.forEach((user, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${((paginaAtual - 1) * 25) + index + 1}</td>
                <td>${user.ID}</td>
                <td>${user.XP}</td>
                <td>${user.NIVEL}</td>
                <td>${user.NumProjetos}</td>
                <td>${user.Bumps}</td>
            </tr>
        `;
    });

}

function ordenar(coluna){

    ordenacaoAtual = coluna;
    paginaAtual = 1;

    carregarLeaderboard(true);

}

function carregarMais(){

    paginaAtual++;
    carregarLeaderboard();

}

carregarLeaderboard();