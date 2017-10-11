$(document).ready(function() {
	/**
	 * Clear modal and prepare it for input
	 */
	$("#team-modal").on("show.bs.modal", function(event) {
		var modal = $(this);
		modal.find("#trainer-name").val("");
		modal.find("#trainer-desc").val("");
		modal.find("#trainer-phone").val("");
		modal.find("#trainer-email").val("");
		modal.find("#trainer-profile").val("");
		modal.find("#trainer-cover").val("");
		resetErrors(); // Reset all previous errors or warnings
	});

	/**
	 * Confirm button for creating a new trainer.
	 * The script will upload new images with uploadMedia(), then will call uploadTeam() to update team.json
	 */
	$("#confirm-action-trainer").click(function() {
		resetErrors();
		var type = $(this).text();
		var name = document.getElementById("trainer-name").value.trim(); // New name
		var desc = document.getElementById("trainer-desc").value.trim(); // New description
		var phone = document.getElementById("trainer-phone").value.trim(); // New description
		var email = document.getElementById("trainer-email").value.trim(); // New description
		var profile_pic = document.getElementById("trainer-profile").files[0]; // Profile photo
		var cover_pic = document.getElementById("trainer-cover").files[0]; // Cover photo
		
		console.log(team);
		if (name !== "" && desc !== "" && profile_pic !== undefined && cover_pic !== undefined) {
			// New trainer object
			var trainer = new Object();
			trainer.name = name;
			trainer.desc = desc;
			trainer.phone = phone;
			trainer.email = email;
			trainer.profile = server + 'data/' + profile_pic.name;
			trainer.cover = server + 'data/' + cover_pic.name;
			console.log(trainer);
			if (checkImageTeam(profile_pic, cover_pic)) {
				// Update file team.json on server with a new trainer
				uploadMediaTeam(profile_pic, cover_pic, trainer);
			}
		} else {
			// Manage message error in input fields
			if (name === "") {
				$("#trainer-name").parent(".form-group").addClass("has-error has-feedback");
				$("#trainer-name").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Inserire il nome del personal trainer.</span>');
			} else {
				$("#trainer-name").parent(".form-group").addClass("has-success has-feedback");
				$("#trainer-name").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (desc === "") {
				$("#trainer-desc").parent(".form-group").addClass("has-error has-feedback");
				$("#trainer-desc").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire una descrizione per il personal trainer.</span>');	
			} else {
				$("#trainer-desc").parent(".form-group").addClass("has-success has-feedback");
				$("#trainer-desc").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (profile_pic === undefined) {
				$("#trainer-profile").parent(".form-group").addClass("has-error has-feedback");
				$("#trainer-profile").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire immagine profilo.</span>');	
			} else {
				$("#trainer-profile").parent(".form-group").addClass("has-success has-feedback");
				$("#trainer-profile").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (cover_pic === undefined) {
				$("#trainer-cover").parent(".form-group").addClass("has-error has-feedback");
				$("#trainer-cover").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire immagine copertina.</span>');	
			} else {
				$("#trainer-cover").parent(".form-group").addClass("has-success has-feedback");
				$("#trainer-cover").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
		}
	});
});

/**
 * Array Team declaration and creation of the datasbase schema
 */
var team = [];
var server = "http://www.fashionfitness.it/dashboard/";

/**
 * Get team list from file team.json on server and run displayTeam()
 */
function getTeam() {
	console.log("getTeam()");
	// waitingDialog.show("Aggiornamento lista team...");
	team = [];
	var script_url = server + "php/get_team.php";
	$.ajax({
		type: "GET",
		datatype: "application/json",
		url: script_url,
		success: function(data) {
			$.each(data, function(index, element) {
				// Create array of objects Trainer
				var trainer = new Object();
				trainer.name = element.name;
				trainer.desc = element.desc;
				trainer.phone = element.phone;
				trainer.email = element.email;
				trainer.profile = element.profile;
				trainer.cover = element.cover;
				team.push(trainer);
			});
			displayTeam();
		},
		error: function() {
			alert("Errore in getTeam()");
		}
	});
}

/**
 * Clear and update team list and badge
 */
function displayTeam() {
	$("#badge-team").text(team.length);
	$("#lista-trainer").empty();
	for (var i = 0; i < team.length; i++) {
		// Append a new trainer panel in the list
		$("#lista-trainer").append('<div class="panel panel-default">' + 
		    '<div class="panel-heading panel-personal" role="tab" id="trainer-heading' + i + '">' +
		    	'<h4 class="panel-title">' +
			        '<a role="button" class="btn-panel" data-toggle="collapse" data-parent="#lista-trainer" href="#trainer-content' + i + '" aria-expanded="true" aria-controls="trainer-content' + i + '">' +
						team[i].name + 
			        '</a>' +
		    	'</h4>' +
		    '</div>' +
		    '<div id="trainer-content' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="trainer-heading' + i + '">' +
		    	'<div class="panel-body">' +
		    		'<div class="row">' +
		    			'<div class="col-md-6 text-center"><img class="img-thumbnail" src="' + team[i].profile + '" alt="profile"><p><strong>Foto Profilo</strong></p></div>' +
		    			'<div class="col-md-6 text-center"><img class="img-thumbnail" src="' + team[i].cover + '" alt="cover"><p><strong>Foto Copertina</strong></p></div>' +
		    		'</div>' +
		    		'<p><strong>Descrizione</strong></p>' +
		    		'<p class="lead">' + team[i].desc + '</p>' +
	    			'<p><strong>Telefono: </strong>' + team[i].phone + '</p>' + 
	    			'<p><strong>Email: </strong>' + team[i].email + '</p>' + 
		    		'<button type="button" class="btn btn-danger pull-right" data-toggle="modal" data-target="#confirm-delete-modal" data-index="' + i + '" data-name="' + team[i].name + '" ' + 
		    			'data-type="trainer"><i class="fa fa-trash fa-lg" aria-hidden="true"></i> Elimina</button>' +
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
function checkImageTeam(profile, cover) {
	console.log("checkImageTeam()");
	var profileName = profile.name;
	var coverName = cover.name;
	var profileType = profile.type;
	var coverType = cover.type;
	var profileSize = profile.size;
	var coverSize = cover.size;
	var error = "";
	var uploadOk = true;
	// Extension check
	if (profileType != "image/png" && profileType != "image/jpeg") {
		uploadOk = false;
		error = error + "Il file selezionato per il profilo non è un'immagine.<br>";
	}
	if (coverType != "image/png" && coverType != "image/jpeg") {
		uploadOk = false;
		error = error + "Il file selezionato per la cover non è un'immagine.<br>";
	}
	// Size check
	if (profileSize > 500000) {
		uploadOk = false;
		error = error + "Il file selezionato per il profilo è troppo pesante. Il limite supportato è di 500 KB.<br>";
	}
	if (coverSize > 500000) {
		uploadOk = false;
		error = error + "Il file selezionato per la cover è troppo pesante. Il limite supportato è di 500 KB.<br>";
	}
	// Name check - it cannot be already in use, otherwise it will be deleted by the server
	for (var i = 0; i < team.length; i++) {
		console.log(team[i].profile.replace(server + 'data/', ''));
		console.log(team[i].cover.replace(server + 'data/', ''));
		if (profileName == team[i].profile.replace(server + 'data/', '')) {
			uploadOk = false;
			error = error + "Nome per la foto profilo già utilizzato, cambiare nome al file.<br>";
		}
		if (coverName == team[i].cover.replace(server + 'data/', '')) {
			uploadOk = false;
			error = error + "Nome per la foto copertina già utilizzato, cambiare nome al file.<br>";
		}
	}
	// Error?
	if (!uploadOk) {
		error = error + "Il caricamento non è andato a buon fine!";
		$(".alert-photo-team").append('<div class="alert alert-danger alert-dismissable fade in">' + 
			'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + error +
			'</div>');
	}
	return uploadOk;
}

/**
 * Upload profile images on server, then call updateTeam(trainer).
 */ 
function uploadMediaTeam(profile, cover, trainer) {
	$("#team-modal").modal("hide"); // Hide active modal
	waitingDialog.show("Salvataggio in corso...", {progressType: "primary"}); // Show waiting dialog

	// FormData Object to pass to XMLHTTP request
	var formData = new FormData();
	formData.append("profile_pic", profile);
	formData.append("cover_pic", cover);

	var link = server + "php/upload.php";
	var request = new XMLHttpRequest();
	request.open("POST", link, true);
	request.onload = function() {
	    if (request.status == 200) {
	    	// Uploading images ok, update team.json also with images path
	    	team.push(trainer); // Trainer parameter, object with the new trainer
	    	updateTeam(team);
	    } else {
	    	waitingDialog.hide();
	    	alert("Error " + request.status + " occurred when trying to upload your file.");
	    }
  	};
	request.send(formData);
}

/**
 * Update file team.json on server. Called by uploadMedia()
 */
function updateTeam(team) {
	console.log("updateTeam()");
	console.log(team);
	// Sort team in alphabetical order by name
	team.sort(function compare(a, b) {
		if (a.name < b.name)
	    	return -1;
		if (a.name > b.name)
	    	return 1;
		return 0;
	});

	$.ajax({
        url: server + "php/write_team.php",
        type: 'POST',
        datatype: "application/json",
        data: {
            json: JSON.stringify(team)
        },
        success: function() {
        	waitingDialog.show("Scaricamento dati...", {progressType: "primary"}); // Show waiting dialog
        	getTeam();
        	showMessage("team");
        },
        error: function() {
        	alert("Errore in updateTeam()");
        }
    });
}

/**
 * Delete a trainer in array team and update file on the server.
 * To delete linked images, just cut profile and cover link from selected trainer object
 * @param  {int} index position in the array
 */
function deleteTrainer(index) {
	console.log("deleteTrainer()");
	var profile = team[index].profile.replace(server + 'data/', ''); 
	var cover = team[index].cover.replace(server + 'data/', '');

	$.ajax({
		url: server + 'php/delete.php',
		type: 'POST',
		datatype: 'text',
		data: { profile: profile, cover: cover },
		success: function() {
			team.splice(index, 1);
			updateTeam(team);
		},
		error: function() {
			alert("Errore in deleteTrainer()");
		}
	});
}