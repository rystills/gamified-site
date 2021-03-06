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
	<link href="../../navbar.css" rel="stylesheet">
	<title>Target Test</title>
	</head>
<body style="background-color:#9666c6">
<ul class="unselectable">
  <li><a href="../../index.php"><h4>Home</h4></a></li>
</ul>
	<div id="canvasDiv" align="center">
		<canvas id="cnv" width="800" height="600"></canvas><canvas 
		id="uicnv" width=320" height="600"></canvas>
	</div>
	<div class="unselectable" style="display:table; margin:auto;">
		<font color="white"><h2 style="margin-left:-560px; line-height: 0px;padding-bottom: 4px;">Instructions:</h2>
		<h4 style="margin-left:-550px;line-height: 20px;"> 
		> Left click to interact with buttons and shoot<br>
		> Right click to stop currently active tool<br>
		> A/D to move left/right respectively</h4></font>
	</div>
	<script src="targetTest_main.js"></script>
</body>
</html>