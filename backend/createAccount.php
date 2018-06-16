<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
$name = $_POST['username'];
$pass = $_POST['password'];

//verify that credentials meet requirements
if (strlen($pass) < 6) {
	die("Error: password must be at least 6 characters long");
	
}

$sql = "INSERT INTO users( username, 
PASSWORD ) 
VALUES (
'".$name."', '".$pass."'
)";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: username already taken";
}

$conn->close();
?>