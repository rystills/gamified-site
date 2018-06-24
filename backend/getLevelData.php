<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");

$levelId = $_POST['level_id'];
$query = "SELECT content FROM levels WHERE id = ".'"'.$levelId.'";'; // Query to get data from desired level id

$result = mysqli_query($conn, $query);
$row = $result->fetch_assoc();
echo $row['content'];

$conn->close();
?>