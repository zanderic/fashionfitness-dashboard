<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

	var_dump($_POST);
	$target_dir = __DIR__ . "/../data/";

	$pdf = $_POST['file_name'];
	$target_pdf = $target_dir . $pdf;

	unlink($target_pdf);
?>