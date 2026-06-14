<?php

header('Content-Type: application/json');

$conn = new mysqli(
    "db-ash-06.apollopanel.com",
    "u218139_VJCw0gZmfO",
    "zTZ9K50JND-b~u6vKTZ0~ZYV",
    "s218139_users_data",
    3306
);

if ($conn->connect_error) {
    die(json_encode([
        "error" => $conn->connect_error
    ]));
}

$sql = "
SELECT
    ID,
    XP,
    NIVEL,
    NumProjetos,
    Bumps
FROM users
ORDER BY XP DESC
";

$result = $conn->query($sql);

$users = [];

while($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);

$conn->close();
?>