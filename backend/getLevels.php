<?php 
require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");

$query = "SELECT level_name,creator,id,game_type FROM levels"; // Query to select the fields in each row

$result = mysqli_query($conn, $query);
while($row = $result->fetch_assoc()) {
    echo "<a onClick='loadLevel(".$row['id'].", ".'"'.$row['game_type'].'"'.");' style='cursor: pointer; cursor: hand;'>".$row['level_name']."<br /></a>"; // Write an anchor with the url as href, and text as value/content
    //echo "<a href='asdf'>".$row['level_name']." - created by ".$row['creator']."<br /></a>"; // Write an anchor with the url as href, and text as value/content
}

$conn->close();
?>

  <!DOCTYPE html>
  <html lang="en">
  <head>
   <!-- jQuery library -->
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      </head>
    <script type="text/javascript">
    function loadLevel(levelId,gameType) {
     window.location.href = '../../../../../games/' + gameType + '.php?levelId=' + levelId;

    }
    </script>
  </html>