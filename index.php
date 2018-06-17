<?php
   include('backend/session.php');
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <!-- Bootstrap core CSS -->
    <link href="../../bootstrap.min.css" rel="stylesheet">
    <!-- Custom styles for this template -->
    <link href="../../signin.css" rel="stylesheet">
    
    <title>Welcome Back to imryans.com</title>
  </head>
  <body>
    <div class="container">
      <form class="form-signin">
        <h2 class="form-signin-heading">Welcome Back, <?php echo $_SESSION['username'];?></h2>
        <h2 class="form-signin-heading">Current Score: <?php echo $_SESSION['score'];?></h2>
        <div class="etc-login-form">
		<p>Not you? <a onClick="logout();" style="cursor: pointer; cursor: hand;">Click here to log out</a></p>
	</div>
      </form>
    </div>
  </body>
  <script type="text/javascript">
	function logout() { 
		$.ajax({
			type: "POST",
			url: 'backend/logout.php',
			data: {},
			success: function(data){
				location.reload();
			}
		});
	}
  </script>
</html>