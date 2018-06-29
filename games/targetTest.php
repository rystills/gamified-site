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
	<div class="unselectable" style="text-align:center">
		<font color="white"><h2 style="margin-left:-958px; line-height: 0px;">Instructions:</h2>
		<p style="font-size:0px"><br><bp>ont>
		<h4 style="margin-left:-749px;line-height: 10px"> 
		> Left click to interact with buttons and shoot<br></h4>
		<h4 style="margin-left:-787px;line-height: 10px"> 
		> Right click to stop currently active tool<br></h4>
		<h4 style="margin-left:-820px;line-height: 10px">
		> A/D to move left/right respectively</h4></font>
	</div>
	<script src="targetTest_main.js"></script>
</body>
</html>