<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
session_start();
//redirect user to login page if they are not in an active session
if(!isset($_SESSION['username'])){
	header("location:login.html");   
}

$uname = $conn->real_escape_string($_SESSION['username']);
$level_id = $conn->real_escape_string($_POST['level_id']);
$creator_name = $conn->real_escape_string($_POST['creator_name']);

$query = "SELECT score, clearedLevels FROM users WHERE username = ".'"'.$uname.'";';
$result = mysqli_query($conn, $query);
$row = $result->fetch_assoc();
$clearedLevelString = $row['clearedLevels'];

$curWonLevels = explode(',',$clearedLevelString);
if (in_array($level_id, $curWonLevels)) {
	echo "Level has already been cleared; no additional points awarded";
}
else {
	//this is our first time clearing this level; award points to us
	$newWonLevelsString = $clearedLevelString . ($clearedLevelString == "" ? '' : ',') . $level_id;
	$newScore = $row['score'] + 1;
	$inQuery = "UPDATE users
	SET clearedLevels = ".'"'.$newWonLevelsString.'"'."
	, score = ".'"'.$newScore.'"'."
	WHERE username = ".'"'.$uname.'";';
	
	if ($conn->query($inQuery) === TRUE) {
		//now award points to the level creator
		$creatorQuery = "SELECT score FROM users WHERE username = ".'"'.$creator_name.'";';
		$result = mysqli_query($conn, $creatorQuery);
		$row = $result->fetch_assoc();
		$creatorNewScore = $row['score'] + 1;
		$creatorInQuery = "UPDATE users
		SET score = ".'"'.$creatorNewScore.'"'."
		WHERE username = ".'"'.$creator_name.'";';
		if ($conn->query($creatorInQuery) === TRUE) {
			echo "Success";
		}
		else {
			echo "Error: user score updated successfully, but failed to update creator score";
		}
		

	} 
	else {
		echo "Error: Unable to update score";
	}
}

//echo "Error: Unable to access server. Could not update score.";


$conn->close();
?>