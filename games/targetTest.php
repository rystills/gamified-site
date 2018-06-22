<?php
include($_SERVER["DOCUMENT_ROOT"] . '/backend/session.php');
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	</head>
<body style="background-color:#9666c6">
	<div id="canvasDiv" align="center">
		<canvas id="cnv" width="800" height="600"></canvas><canvas 
		id="uicnv" width=320" height="600"></canvas>
	</div>
	<script src="main.js"></script>
</body>
</html>