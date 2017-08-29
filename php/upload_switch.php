<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	echo "im here";
	var_dump($_FILES);
	//$images = array();
	$target_dir = "";

	if (isset($_FILES["promo_pic"])) { 
		$images[0] = $target_dir . basename($_FILES["promo_pic"]["name"]);
		$images[1] = $_FILES["promo_pic"]["tmp_name"];
		$images[2] = basename($_FILES["promo_pic"]["name"]);
	} else if (isset($_FILES["profile_pic"]) && isset($_FILES["cover_pic"])) {
		$images[0] = $target_dir . basename($_FILES["profile_pic"]["name"]);
		$images[1] = $_FILES["profile_pic"]["tmp_name"];
		$images[2] = basename($_FILES["profile_pic"]["name"]);
		$images[3] = $target_dir . basename($_FILES["cover_pic"]["name"]);
		$images[4] = $_FILES["cover_pic"]["tmp_name"];
		$images[5] = basename($_FILES["cover_pic"]["name"]);
	}

	for ($i = 0; $i <= count($images) - 2; $i + 3) { 
		// Check if file already exists
		if (file_exists($images[$i])) {
		    echo "Sorry, profile already exists. It will be deleted." . "\n";
		    unlink($images[$i]);
		}
		// Uploading files
		if (move_uploaded_file($images[$i + 1], $images[$i])) {
		    echo "The file " . $images[$i + 2] .  " has been uploaded." . "\n";
		} else {
		    echo "Sorry, there was an error uploading your file." . "\n";
		}
	}
?>