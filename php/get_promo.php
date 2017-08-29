<?php
	$promo = file_get_contents(__DIR__ . '/../data/promo.json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	header('Content-Type: application/json');
	echo $promo;
?>