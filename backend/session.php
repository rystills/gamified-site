<?php
	include('dbconfig.php');
	session_start();
	///redirect user to login page if they are not in an active session
	if(!isset($_SESSION['username'])){
	header("location:login.html");   
	}
	
	//query for desired user stats and stick them into session data (username is already there as it doesn't change after login)
	$user_check = $_SESSION['login_user'];
	$sql = "SELECT score FROM `users` where `username` = '$user_check'";
	$result = mysqli_query($conn, $sql);
	$row = $result->fetch_assoc();
	$_SESSION['score'] = $row["score"];
	mysqli_close($con);
?>