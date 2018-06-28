<?php
   require_once( $_SERVER["DOCUMENT_ROOT"] . "/backend/dbconfig.php");
   session_start();
   
   if($_SERVER["REQUEST_METHOD"] == "POST") {
      // username and password sent from form 
      
      $myusername = mysqli_real_escape_string($conn,$_POST['username']);
      $mypassword = mysqli_real_escape_string($conn,$_POST['password']); 
      
      $sql = "SELECT password FROM users WHERE username = '$myusername'";
      $result = mysqli_query($conn,$sql);
      $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
      $count = mysqli_num_rows($result);
      mysqli_close($con);
      if($count == 1) {
          $hashed_password = $row['password'];
          if(password_verify($mypassword, $hashed_password)) {
            //add username to session data
            $_SESSION['username'] = $myusername;
            echo "Success";
            exit;
          }
          else {
              echo "Error: invalid password";
          }
      }else {
         echo "Error: User does not exist";
      }
   }
?>