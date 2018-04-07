<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	$file_name = 'schede.json';
	$schede = $_POST['json'];

	$file = fopen(__DIR__ . '/../data/' . $file_name, 'w') or die('Cannot open file: '.$file_name);
	fwrite($file, $schede);
	fclose($file);
?>