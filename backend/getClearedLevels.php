<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
session_start();
//redirect user to login page if they are not in an active session
if(!isset($_SESSION['username'])){
	header("location:login.html");   
}
$uname = $conn->real_escape_string($_SESSION['username']);
$query = "SELECT clearedLevels FROM users WHERE username = ".'"'.$uname.'"'; // Query to select the fields in each row
$result = mysqli_query($conn, $query);
$row = $result->fetch_assoc();
echo $row['clearedLevels'];
$conn->close();
?>