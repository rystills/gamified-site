<?php
	include('dbconfig.php');
	session_start();
	///redirect user to login page if they are not in an active session
	if(!isset($_SESSION['username'])){
		header("Location: http://".$_SERVER['HTTP_HOST'].'/login.html');
	}
	
	//query for desired user stats and stick them into session data (username is already there as it doesn't change after login)
	$user_check = $conn->real_escape_string($_SESSION['username']);
	$sql = "SELECT score FROM `users` where `username` = '$user_check'";
	$result = mysqli_query($conn, $sql);
	$row = $result->fetch_assoc();
	$_SESSION['score'] = $row["score"];
	mysqli_close($con);
?>