<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

	var_dump($_FILES);
	$target_dir = __DIR__ . "/../data/";

	if (isset($_FILES["promo_pic"])) {
		echo("PROMO");
		$target_promo = $target_dir . basename($_FILES["promo_pic"]["name"]);

		// Check if file already exists
		if (file_exists($target_promo)) {
		    echo "Sorry, profile already exists. It will be deleted." . "\n";
		    unlink($target_promo);
		}
		// Uploading files
		if (move_uploaded_file($_FILES["promo_pic"]["tmp_name"], $target_promo)) {
		    echo "The file ". basename( $_FILES["promo_pic"]["name"]). " has been uploaded." . "\n";
		} else {
		    echo "Sorry, there was an error uploading your file." . "\n";
		}
		
	}

	if (isset($_FILES["profile_pic"]) && isset($_FILES["cover_pic"])) {
		echo("TEAM");
		$target_profile = $target_dir . basename($_FILES["profile_pic"]["name"]);
		$target_cover = $target_dir . basename($_FILES["cover_pic"]["name"]);

		// Check if file already exists
		if (file_exists($target_profile)) {
		    echo "Sorry, profile already exists. It will be replaced." . "\n";
		    unlink($target_profile);
		}
		if (file_exists($target_cover)) {
		    echo "Sorry, cover already exists. It will be replaced." . "\n";
		    unlink($target_cover);
		}
		// Uploading files
		if (move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $target_profile)) {
		    echo "The file ". basename( $_FILES["profile_pic"]["name"]). " has been uploaded." . "\n";
		} else {
		    echo "Sorry, there was an error uploading your file." . "\n";
		}
		if (move_uploaded_file($_FILES["cover_pic"]["tmp_name"], $target_cover)) {
		    echo "The file ". basename( $_FILES["cover_pic"]["name"]). " has been uploaded." . "\n";
		} else {
		    echo "Sorry, there was an error uploading your file." . "\n";
		}
	}

	if (isset($_FILES["corsi_pdf"])) {
		echo("CORSI-PDF");
		$target_pdf = $target_dir . "corsi.pdf";

		// Check if file already exists
		if (file_exists($target_pdf)) {
		    echo "Sorry, pdf already exists. It will be replaced." . "\n";
		    unlink($target_pdf);
		}
		// Uploading files
		if (move_uploaded_file($_FILES["corsi_pdf"]["tmp_name"], $target_pdf)) {
		    echo "The file ". basename( $_FILES["corsi_pdf"]["name"]). " has been uploaded." . "\n";
		} else {
		    echo "Sorry, there was an error uploading your file." . "\n";
		}
	}

	if (isset($_FILES["scheda_pdf"])) {
		echo("SCHEDA-PDF");
		$trim_name = strtolower(str_replace(" ", "", $_FILES["scheda_pdf"]["name"]));
		$target_pdf = $target_dir . basename($trim_name);

		// Check if file already exists
		if (file_exists($target_pdf)) {
		    echo "Sorry, profile already exists. It will be replaced." . "\n";
		    unlink($target_pdf);
		}
		// Uploading files
		if (move_uploaded_file($_FILES["scheda_pdf"]["tmp_name"], $target_pdf)) {
		    echo "The file ". basename($trim_name). " has been uploaded." . "\n";
		} else {
		    echo "Sorry, there was an error uploading your file." . "\n";
		}
	}
?>