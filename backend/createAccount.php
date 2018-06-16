<?php 
//db settings
$servername = "localhost";
$username = "rising64_admin";
$password = "admin";
$dbname = "rising64_data";

$name = $_POST['username'];
$pass = $_POST['password'];

//verify that credentials meet requirements
if (strlen($pass) < 6) {
	die("Error: password must be at least 6 characters long");
	
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
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