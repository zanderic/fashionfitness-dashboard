<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	$file_name = 'team.json';
	$team = $_POST['json'];
	// if (json_decode($team) != null) {
	$file = fopen(__DIR__ . '/../data/' . $file_name, 'w') or die('Cannot open file: '.$file_name);
	fwrite($file, $team);
	fclose($file);
?>