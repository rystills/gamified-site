<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
session_start();
//redirect user to login page if they are not in an active session
if(!isset($_SESSION['username'])){
	header("location:login.html");   
}

$uname = $_SESSION['username'];
$game = $_POST['game_name'];
$lname = $_POST['level_name'];
$ldata =  $_POST['level_data'];

$sql = "INSERT INTO levels(
creator,
level_name,
game_type,
content
) 
VALUES (
'".$uname."', '".$lname."', '".$game."', '".$ldata."'
)";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: Unable to Submit Level";
}

$conn->close();
?>