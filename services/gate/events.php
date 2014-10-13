<?php

if(isset($_REQUEST['submit_form']) && $_REQUEST['submit_form'] == "Yes") {
	
	$name = $_REQUEST['name'];
	$event = $_REQUEST['event'];
	$company = $_REQUEST['company'];
	$email = $_REQUEST['email'];
	$phone = $_REQUEST['phone'];
	
	//START Send Email to selected recipient						
	ini_set("SMTP", "10.1.2.74");
	ini_set("smtp_port", "25");
	
	$from = 'support@terrapass.com';
  $recipient  = 'nbsales@terrapass.com' . ', ';
  $recipient .= 'kristi@terrapass.com';
	$subject = 'TerraPass Events Calculator Lead Generation Form Submission';
	
	$message = '
	<html>
	Name: '.$name.'<br>
	Event: '.$event.'<br>
	Company: '.$company.'<br>
	Email: '.$email.'<br>
	Phone: '.$phone.'
	</html>
	';
	
	$headers = 'From: '.$from."\n".'Reply-To: '.$from. "\r\n" .'X-Mailer: PHP/' . phpversion();
	$headers .= 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	//$headers .= 'Cc: '."jed@swirl.net". "\r\n";
	
	// In case any of our lines are larger than 70 characters, we should use wordwrap()
	$message = wordwrap($message, 70);
	
	//echo $message;
	//exit;
			
	// Send
	mail($recipient, $subject, $message, $headers);
	
	header("Location: ".$_SERVER['PHP_SELF']."?submitted=yes");

}
?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Untitled Document</title>

<link href="css/style.css" rel="stylesheet" type="text/css" />

<script src="js/jquery-1.11.1.min.js"></script>
<script src="js/functions.js"></script>

</head>

<body>

	<div id="main_container">
    
		<div id="main_content" style="display: <?php if(!isset($_REQUEST['submitted'])) { echo "block"; } else { echo "none"; } ?>">
            
            <form name="form_submit" id="form_submit" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" onSubmit="return validateForm_event();">
            
                <label>Name:</label><input type="text" name="name" id="name">
                <div class="clear"></div>
                <label>Event:</label><input type="text" name="event" id="event">
                <div class="clear"></div>
                <label>Company/Organization Name:</label><input type="text" name="company" id="company">
                <div class="clear"></div>
                <label>Email Address:</label><input type="text" name="email" id="email">
                <div class="clear"></div>
                <label>Phone Number:</label><input type="text" name="phone" id="phone" maxlength="12">
                <br><br>
                <input type="hidden" name="submit_form" id="submit_form" value="Yes">
                <input type="submit" name="btn_submit" id="btn_submit" value="Submit">
        
            </form>
            
        </div><!-- END main_content -->
        
        <div id="confirmation" style="display: <?php if(isset($_REQUEST['submitted'])) { echo "block"; } else { echo "none"; } ?>">
        
        	You're submission has been completed succesfully!
            
        </div><!-- END confirmation -->
        
	</div><!-- END main_container -->
    
</body>
</html>