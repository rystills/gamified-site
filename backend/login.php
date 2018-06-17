<?php
   require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
   session_start();
   
   if($_SERVER["REQUEST_METHOD"] == "POST") {
      // username and password sent from form 
      
      $myusername = mysqli_real_escape_string($conn,$_POST['username']);
      $mypassword = mysqli_real_escape_string($conn,$_POST['password']); 
      
      $sql = "SELECT id FROM users WHERE username = '$myusername' and password = '$mypassword'";
      $result = mysqli_query($conn,$sql);
      $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
      $active = $row['active'];
      
      $count = mysqli_num_rows($result);
      mysqli_close($con);
      
      // If result matched $myusername and $mypassword, table row must be 1 row
		
      if($count == 1) {
         //add username to session data
         $_SESSION['username'] = $myusername;
         echo "Success";
         exit;
      }else {
         echo "Error: Invalid Username or Password";
      }
   }
?>