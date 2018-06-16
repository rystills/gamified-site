<?php 
//db settings
$servername = "localhost";
$username = "rising64_admin";
$password = "admin";
$dbname = "rising64_data";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$name = $_POST['username'];
$pass = $_POST['password'];

$sql = "INSERT INTO users( username, 
PASSWORD ) 
VALUES (
'".$name."', '".$pass."'
)";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>