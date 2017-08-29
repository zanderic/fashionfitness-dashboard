<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

	var_dump($_POST);
	$target_dir = __DIR__ . "/../data/";

	$profile = $_POST['profile'];
	$cover = $_POST['cover'];
	$target_profile = $target_dir . $profile;
	$target_cover = $target_dir . $cover;

	unlink($target_profile);
	unlink($target_cover);
?>