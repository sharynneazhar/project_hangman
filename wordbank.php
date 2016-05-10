<?php

    //=========== SET TIMEZONE =======================
    date_default_timezone_set('America/Chicago');

    //=========== PHP ERROR REPORTING ================
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    //========== BEGIN POST =========================
    if(!isset($_POST)) { // Make sure that something was sent from the javascript
    	return; // If nothing was sent then stop everything
    }

    $word = $_POST['word'];

    // write to file
    $filename = "customWordBank.txt";
    $file = fopen($filename, 'a');
    fwrite($file, $word . ',');
    fclose($file);

	echo $word;

?>
