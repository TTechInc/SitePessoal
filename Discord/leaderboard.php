<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';

$conn = new mysqli(
    $db_host,
    $db_user,
    $db_pass,
    $db_name,
    3306
);

if ($conn->connect_error) {
    die(json_encode([
        "error" => $conn->connect_error
    ]));
}

$allowedColumns = [
    "XP",
    "NIVEL",
    "NumProjetos",
    "Bumps"
];

$sort = $_GET["sort"] ?? "NIVEL";

if (!in_array($sort, $allowedColumns)) {
    $sort = "XP";
}

$page = intval($_GET["page"] ?? 1);

if ($page < 1) {
    $page = 1;
}

$limit = 25;
$offset = ($page - 1) * $limit;

$sql = "
SELECT
    Nome,
    XP,
    NIVEL,
    NumProjetos,
    Bumps
FROM users
ORDER BY $sort DESC
LIMIT $limit OFFSET $offset
";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();