<?php
echo json_encode([
    "success" => true,
    "message" => "API test OK",
    "method" => $_SERVER['REQUEST_METHOD'],
    "input" => $_POST
]);
?>
