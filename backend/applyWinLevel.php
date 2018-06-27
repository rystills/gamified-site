<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
session_start();
//redirect user to login page if they are not in an active session
if(!isset($_SESSION['username'])){
	header("location:login.html");   
}

$uname = $_SESSION['username'];
$level_id = $_POST['level_id'];

$query = "SELECT score, clearedLevels FROM users WHERE username = ".'"'.$uname.'";';
$result = mysqli_query($conn, $query);
$row = $result->fetch_assoc();
$clearedLevelString = $row['clearedLevels'];

$curWonLevels = explode(',',$clearedLevelString);
if (in_array($level_id, $curWonLevels)) {
	echo "Level has already been cleared; no additional points awarded";
}
else {
	$newWonLevelsString = $clearedLevelString . ($clearedLevelString == "" ? '' : ',') . $level_id;
	$newScore = $row['score'] + 1;
	$inQuery = "UPDATE users
	SET clearedLevels = ".'"'.$newWonLevelsString.'"'."
	, score = ".'"'.$newScore.'"'."
	WHERE username = ".'"'.$uname.'";';
	
	if ($conn->query($inQuery) === TRUE) {
		echo "Success";
	} 
	else {
		echo "Error: Unable to update score";
	}
}

//echo "Error: Unable to access server. Could not update score.";


$conn->close();
?>