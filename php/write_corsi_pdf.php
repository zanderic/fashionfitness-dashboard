<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	$file_name = 'corsi.pdf';
	$corsi_pdf = $_POST['data'];
	var_dump($_POST);
	if (json_decode($corsi_pdf) != null) {
    	$file = fopen(__DIR__ . '/../data/' . $file_name, 'w') or die('Cannot open file: '.$file_name);
    	fwrite($file, $corsi_pdf);
    	fclose($file);
    } else {
    	echo "Invalid JSON";
	}
?>