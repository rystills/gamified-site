<?php
include($_SERVER["DOCUMENT_ROOT"] . '/backend/session.php');
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<!-- Bootstrap core CSS -->
	<link href="../../bootstrap.min.css" rel="stylesheet">
	<!-- Custom styles for this template -->
	<link href="../../instructions.css" rel="stylesheet">

	<title>Target Test</title>
	</head>
<body style="background-color:#9666c6">
	<div id="canvasDiv" align="center">
		<canvas id="cnv" width="800" height="600"></canvas><canvas 
		id="uicnv" width=320" height="600"></canvas>
	</div>
	<div class="unselectable">
		<font color="white"><h2 style="padding-left: 400px; line-height: 0px;">Instructions:</h2>
		<p style="font-size:0px"><br><bp>ont>
		<h4 style="padding-left: 400px;"> 
		&nbsp> Left click to interact with buttons and shoot<br>
		&nbsp> Right click to stop currently active tool<br>
		&nbsp> A/D to move left/right respectively</h4></font>
	</div>
	<script src="targetTest_main.js"></script>
</body>
</html>