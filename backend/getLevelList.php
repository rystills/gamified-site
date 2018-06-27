<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
session_start();
//redirect user to login page if they are not in an active session
if(!isset($_SESSION['username'])){
	header("location:login.html");   
}
$gameType = $_POST['game_name'];

$query = "SELECT level_name,creator,id FROM levels WHERE game_type = ".'"'.$gameType.'" ORDER BY id;'; // Query to select the fields in each row

$result = mysqli_query($conn, $query);
$levelListString = "";
while($row = $result->fetch_assoc()) {
	$levelListString = $levelListString. $row['id']."\n".$row['level_name']."\n".$row['creator']."\n";
}
echo $levelListString;
$conn->close();
?>