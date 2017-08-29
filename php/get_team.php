<?php
	$team = file_get_contents(__DIR__ . '/../data/team.json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	header('Content-Type: application/json');
	echo $team;
?>