<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
session_start();
//redirect user to login page if they are not in an active session
if(!isset($_SESSION['username'])){
	header("location:login.html");   
}

//remove newline characters as we use these as separators when listing levels (barring level data, which utilizes newlines separately)
$uname = $conn->real_escape_string(str_replace("\n", '', $_SESSION['username']));
$game = $conn->real_escape_string(str_replace("\n", '', $_POST['game_name']));
$lname = $conn->real_escape_string(str_replace("\n", '', $_POST['level_name']));
$ldata =  $conn->real_escape_string($_POST['level_data']);

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