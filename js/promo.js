$(document).ready(function() {
	/**
	 * Clear modal and prepare it for input
	 */
	$("#promo-modal").on("show.bs.modal", function(event) {
		var modal = $(this);
		modal.find("#promo-name").val("");
		modal.find("#promo-image").val("");
		modal.find("#promo-active").prop('checked', false);
		resetErrors(); // Reset all previous errors or warnings
	});

	/**
	 * Confirm button for creating a new promo.
	 * The script will upload new image with uploadMedia(), then will call uploadPromo() to update promo.json
	 */
	$("#confirm-action-promo").click(function() {
		resetErrors();
		var type = $(this).text();
		var name = document.getElementById("promo-name").value.trim(); // New name
		var image = document.getElementById("promo-image").files[0]; // New image
		var active = document.getElementById("promo-active").checked;
		
		if (name !== "" && image != undefined) {
			// New promo object
			var promo = new Object();
			promo.name = name;
			promo.image = server + 'data/' + image.name;
			promo.active = active;
			if (checkImagePromo(image)) {
				// Update file promo.json on server with a new promo
				uploadMediaPromo(image, promo);
			}
		} else {
			// Manage message error in input fields
			if (name === "") {
				$("#promo-name").parent(".form-group").addClass("has-error has-feedback");
				$("#promo-name").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Inserire il titolo per la promo.</span>');
			} else {
				$("#promo-name").parent(".form-group").addClass("has-success has-feedback");
				$("#promo-name").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (image === undefined) {
				$("#promo-profile").parent(".form-group").addClass("has-error has-feedback");
				$("#promo-profile").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire immagine.</span>');	
			} else {
				$("#promo-profile").parent(".form-group").addClass("has-success has-feedback");
				$("#promo-profile").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
		}
	});
});

/**
 * Array promo declaration and creation of the datasbase schema
 */
var promozioni = [];
var server = "http://www.auronzovacanze.com/dashboard/";

/**
 * Get promozioni list from file promo.json on server and run displayPromo()
 */
function getPromo() {
	console.log("getPromo()");
	promozioni = [];
	var script_url = server + "php/get_promo.php";
	$.ajax({
		type: "GET",
		datatype: "application/json",
		url: script_url,
		success: function(data) {
			$.each(data, function(index, element) {
				// Create array of objects promo
				var promo = new Object();
				promo.name = element.name;
				promo.image = element.image;
				promo.active = element.active;
				promozioni.push(promo);
			});
			displayPromo();
		},
		error: function() {
			alert("Errore in getPromo()");
		}
	});
}

/**
 * Clear and update promo list and badge
 */
function displayPromo() {
	console.log("displayPromo()");
	$("#badge-promo").text(promozioni.length);
	$("#lista-promo").empty();
	for (var i = 0; i < promozioni.length; i++) {
		console.log(promozioni[i]);
		// Badge new corso definition
		var badge = '<span class="badge badge-text">Attiva</span>';
		var deActivateButton = '<a role="button" class="btn btn-warning" onclick="deActivatePromo(' + i + ')"><i class="fa fa-ban fa-lg"></i> Disattiva</a>';
		if (!promozioni[i].active) {
			badge = '';
			deActivateButton = '<a role="button" class="btn btn-success" onclick="deActivatePromo(' + i + ')"><i class="fa fa-check fa-lg" aria-hidden="true"></i> Attiva</a>';
		}
		// Append a new promo panel in the list
		$("#lista-promo").append('<div class="panel panel-default">' + 
		    '<div class="panel-heading panel-personal" role="tab" id="promo-heading' + i + '">' +
		    	'<h4 class="panel-title">' +
			        '<a role="button" class="btn-panel" data-toggle="collapse" data-parent="#lista-promo" href="#promo-content' + i + '" aria-expanded="true" aria-controls="promo-content' + i + '">' +
						promozioni[i].name + badge +
			        '</a>' +
		    	'</h4>' +
		    '</div>' +
		    '<div id="promo-content' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="promo-heading' + i + '">' +
		    	'<div class="panel-body">' +
		    		'<div class="row text-center">' +
		    			'<img class="img-thumbnail img-promo" src="' + promozioni[i].image + '" alt="image-promo">' +
		    		'</div>' +
		    		'<div class="btn-group pull-right" role="group" aria-label="activate-deactivate">' +
		    			deActivateButton +
		    			'<a role="button" class="btn btn-danger" data-toggle="modal" data-target="#confirm-delete-modal" data-index="' + i + '" data-name="' + promozioni[i].name + '"' + 
		    				'data-type="promo"><i class="fa fa-trash fa-lg" aria-hidden="true"></i> Elimina</a>' +
		    		'</div>' +
		     	'</div>' +
		    '</div>' +
		'</div>');
	}
	waitingDialog.hide();
}

/**
 * Check image restrinctions.
 * Limitations:
 * - Only jpg, jpeg and png extensions
 * - Maximum size 500k
 * - Name must be unique. The server will replace old file with the same name
 */
function checkImagePromo(image) {
	console.log("checkImagePromo()");
	var imageName = image.name;
	console.log(imageName);
	var imageType = image.type;
	console.log(imageType);
	var imageSize = image.size;
	console.log(imageSize);
	var error = "";
	var uploadOk = true;
	// Extension check
	if (imageType != "image/png" && imageType != "image/jpeg") {
		uploadOk = false;
		error = error + "Il file selezionato non è un'immagine.<br>";
	}
	// Size check
	if (imageSize > 500000) {
		uploadOk = false;
		error = error + "Il file selezionato è troppo pesante. Il limite supportato è di 500 KB.<br>";
	}
	// Name check - it cannot be already in use, otherwise it will be deleted by the server
	for (var i = 0; i < promozioni.length; i++) {
		console.log(promozioni[i].image.replace(server + 'data/', ''));
		if (imageName == promozioni[i].image.replace(server + 'data/', '')) {
			uploadOk = false;
			error = error + "Nome per l'immagine già utilizzato, cambiare nome al file.<br>" + '\n';
		}
	}

	if (!uploadOk) {
		error = error + "Il caricamento non è andato a buon fine!";
		$(".alert-photo-promo").append('<div class="alert alert-danger alert-dismissable fade in">' + 
			'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + error +
			'</div>');
	}
	console.log(uploadOk);
	return uploadOk;

}

/**
 * Upload promo image on server, then call updatePromo(promo). More than one promo can be active.
 */ 
function uploadMediaPromo(image, promo) {
	console.log("uploadMediaPromo()");
	$("#promo-modal").modal("hide"); // Hide active modal
	waitingDialog.show("Salvataggio in corso...", {progressType: "primary"}); // Show waiting dialog

	// FormData Object to pass to XMLHTTP request
	var formData = new FormData();
	formData.append("promo_pic", image);

	var link = server + "php/upload.php";
	var request = new XMLHttpRequest();
	request.open("POST", link, true);
	request.onload = function() {
	    if (request.status == 200) {
	    	// // If the promo is active all others have to be inactive
	    	// if (promo.active) {
	    	// 	for (var i = 0; i < promozioni.length; i++) {
		    // 		promozioni[i].active = false;
		    // 	}
	    	// }
	    	console.log("request ok");
	    	// Uploading images ok, update promozioni.json also with image path
	    	promozioni.push(promo); // promo parameter
	    	updatePromo(promozioni);
	    } else {
	    	waitingDialog.hide();
	    	alert("Error " + request.status + " occurred when trying to upload your file.");
	    }
  	};
	request.send(formData);
}

/**
 * Update file promo.json on server. Called by uploadMedia()
 */
function updatePromo(promozioni) {
	console.log("updatePromo()");
	console.log(promozioni);
	// Sort promozioni in alphabetical order by name
	promozioni.sort(function compare(a, b) {
		if (a.name < b.name)
	    	return -1;
		if (a.name > b.name)
	    	return 1;
		return 0;
	});

	$.ajax({
        url: server + "php/write_promo.php",
        type: 'POST',
        datatype: "application/json",
        data: {
            json: JSON.stringify(promozioni)
        },
        success: function() {
        	waitingDialog.show("Scaricamento dati...", {progressType: "primary"}); // Show waiting dialog
        	getPromo();
        	showMessage("promo");
        },
        error: function() {
        	alert("Errore in updatePromo()");
        }
    });
}

function deActivatePromo(index) {
	// Switch value of the selected promo
	if (promozioni[index].active) {
		promozioni[index].active = false;
	} else {
		promozioni[index].active = true;
	}
	updatePromo(promozioni);
}

/**
 * Delete a promo in array promozioni and update file on the server.
 * To delete linked image, just cut link from selected promo object
 * @param  {int} index position in the array
 */
function deletePromo(index) {
	console.log("deletepromo()");
	console.log(index);
	console.log(promozioni);
	var image = promozioni[index].image.replace(server + 'data/', '');

	$.ajax({
		url: server + 'php/delete.php',
		type: 'POST',
		datatype: 'text',
		data: { profile: image},
		success: function() {
			promozioni.splice(index, 1);
			updatePromo(promozioni);
		},
		error: function() {
			alert("Errore in deletePromo()");
		}
	});
}