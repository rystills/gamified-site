<?php
//db settings
$servername = "insert_server_name_here";
$username = "insert_user_name_here";
$password = "insert_password_here";	
$dbname = "insert_database_name_here";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset("utf8");
?>
