<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
session_start();
//redirect user to login page if they are not in an active session
if(!isset($_SESSION['username'])){
	header("location:login.html");   
}

$levelId = $conn->real_escape_string($_POST['level_id']);
$query = "SELECT content FROM levels WHERE id = ".'"'.$levelId.'";'; // Query to get data from desired level id

$result = mysqli_query($conn, $query);
$row = $result->fetch_assoc();
echo $row['content'];

$conn->close();
?>