<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
$name = $_POST['username'];
$pass = $_POST['password'];

//verify that credentials meet requirements
if (strlen($pass) < 6) {
	die("Error: password must be at least 6 characters long");
}

$hashed_password = password_hash($pass, PASSWORD_DEFAULT);

$sql = "INSERT INTO users( username, 
PASSWORD ) 
VALUES (
'".$name."', '".$hashed_password."'
)";

if ($conn->query($sql) === TRUE) {
	echo "Success";
} else {
    echo "Error: username already taken";
}

$conn->close();
?>