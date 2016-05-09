<?php

////////////////////////////////////////////////
// CUSTOM WORD BANK STORAGE BY LEVI CLARK
///////////////////////////////////////////////

date_default_timezone_set('America/Chicago');

error_reporting(E_ALL)
ini_set("display_errors", 1);

if(!isset($_POST)) {
	return;
}

$topic = $_POST['topic'];
$word = $_POST['word'];

$wordBank = $topic . ',' . $word;

$filename = "customWordBank.txt";
$file = fopen($filename, 'a');
fwrite($file, $wordBank);
fwrite($file, PHP_EOL);
fclose($file);

?>
