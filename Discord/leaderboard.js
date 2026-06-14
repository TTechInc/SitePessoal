async function carregarLeaderboard() {

    const response = await fetch("leaderboard.php");
    const dados = await response.json();

    const tbody = document.querySelector("#leaderboard-body");

    tbody.innerHTML = "";

    dados.forEach((user, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.ID}</td>
                <td>${user.XP}</td>
                <td>${user.NIVEL}</td>
                <td>${user.NumProjetos}</td>
                <td>${user.Bumps}</td>
            </tr>
        `;
    });
}

carregarLeaderboard();