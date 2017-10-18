$(document).ready(function() {
	/**
	 * Design modal based on the use we need
	 */
	$("#schede-modal").on("show.bs.modal", function(event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var type = button.data("type"); // Extract info from data-* attributes
		var modal = $(this);
		modal.find("#scheda-name").val("");
		modal.find("#scheda-desc").val("");
		modal.find("#scheda-keywords").val("");
		modal.find("#scheda-image").val("");
		modal.find(".button-keyword-large").remove();
		modal.find("#help-block-keywords").remove();
		modal.find("#help-block-pdf").remove();
		resetErrors(); // Reset all previous errors or warnings
		if (type === "edit") {
			modal.find(".modal-title").text('Modifica Scheda');
			modal.find("#confirm-action-scheda").text("Modifica");
			modal.find('#scheda-name').attr("placeholder", button.data("name"));
			modal.find('#scheda-name').attr("index", button.data("index"));
			modal.find('#scheda-desc').attr("placeholder", button.data("desc"));
			modal.find("#scheda-image").parent().append('<p class="help-block" id="help-block-pdf">Ignora se non vuoi sostituire il pdf.</p>');
			modal.find('#temp-keywords-scheda').append('<p class="help-block" id="help-block-keywords">Cancella quelle inserite cliccandoci sopra.</p>');
			var keywords = button.data("keywords").split(",");
			for (var i = 0; i < keywords.length; i++) {
				modal.find("#temp-keywords-scheda").append('<button type="button" class="btn btn-sm button-keyword-large" id="' + keywords[i] + '" onclick="deleteKeyword(\'' + keywords[i] + '\')"><strong>' + keywords[i] + ' </strong><i class="fa fa-times" aria-hidden="true"></i></button>');
			}
		} else {
			modal.find(".modal-title").text('Nuova Scheda');
			modal.find("#confirm-action-scheda").text("Crea");
			modal.find('#scheda-name').removeAttr("placeholder");
			modal.find('#scheda-desc').removeAttr("placeholder");
			modal.find('#scheda-new').attr("checked", true);
		}
	});

	/**
	 * Define behaviour of confirm button, that is create new training schedule or edit an old one
	 */
	$("#confirm-action-scheda").click(function() {
		resetErrors();
		var type = $(this).text();
		var name = document.getElementById("scheda-name").value.trim(); // New or edited name
		var desc = document.getElementById("scheda-desc").value.trim(); // New or editer description
		var labelNew = document.getElementById("scheda-new").checked;
		// New or edited keywords
		var keywords = [];
		var buttons = document.getElementById("temp-keywords-scheda").children;
		for (var i = 0; i < buttons.length; i++) {
		    if (buttons[i].className === "btn btn-sm button-keyword-large") {
		    	keywords.push(buttons[i].id);
		    }
		}
		// Pdf for training schedule
		var pdf = document.getElementById("scheda-image").files[0]; // New image
		// Link creation for savin in schede.json
		if (pdf != undefined) var link = server + "data/" + pdf.name.replace(/\s+/g, "").toLowerCase();
		if (type === "Crea" && name !== "" && desc !== "" && keywords.length > 0 && pdf != undefined && checkPdf(pdf)) {	
			// Update file schede.json on server with a new training
			var scheda = new Object();
			scheda.name = name;
			scheda.desc = desc;
			scheda.keywords = keywords;
			scheda.new = labelNew;
			scheda.link = link;
			schede.push(scheda);
			updateSchedaPDF(pdf); // Will call updateSchede(schede)
		} else if (type === "Modifica" && name !== "" && desc !== "" && keywords.length > 0) {
			// Update file schede.json on server with an updated training
			var number = $("#scheda-name").attr("index");
			schede[number].name = name;
			schede[number].desc = desc;
			schede[number].keywords = keywords;
			schede[number].new = labelNew;
			// If there is a pdf, delete old one and upload a whole new schedule
			if (pdf != undefined && checkPdf(pdf)) {										// controllare visualizzazione errori checkpdf
				deleteScheda(number, false); // Won't call updateSchede(schede)
				schede[number].link = link;
				updateSchedaPDF(pdf); // Will call updateSchede(schede)
			} else if (pdf == undefined) {
				updateSchede(schede); // Just update schede array and upload it
			}
		} else {
			// Manage message error in input fields
			if (name === "") {
				$("#scheda-name").parent(".form-group").addClass("has-error has-feedback");
				$("#scheda-name").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Inserire un nome per la scheda.</span>');
			} else {
				$("#scheda-name").parent(".form-group").addClass("has-success has-feedback");
				$("#scheda-name").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (desc === "") {
				$("#scheda-desc").parent(".form-group").addClass("has-error has-feedback");
				$("#scheda-desc").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire una descrizione per la scheda.</span>');	
			} else {
				$("#scheda-desc").parent(".form-group").addClass("has-success has-feedback");
				$("#scheda-desc").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (keywords.length === 0) {
				$("#scheda-keywords").parent(".form-group").addClass("has-error has-feedback");
				$("#scheda-keywords").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire almeno una parola chiave per la scheda.</span>');
			} else {
				$("#scheda-keywords").parent(".form-group").addClass("has-success has-feedback");
				$("#scheda-keywords").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (pdf === undefined) {
				$("#scheda-image").parent(".form-group").addClass("has-error has-feedback");
				$("#scheda-image").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire PDF.</span>');
			} else {
				$("#scheda-image").parent(".form-group").addClass("has-success has-feedback");
				$("#scheda-image").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (!checkPdf(pdf)) {
				$("#scheda-image").parent(".form-group").addClass("has-error has-feedback");
				$("#scheda-image").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>');
			} else {
				$("#scheda-image").parent(".form-group").addClass("has-success has-feedback");
				$("#scheda-image").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
		}
	});

	/**
	 * Transform an inserted keyword in a button by pressing enter, ready to be processed or canceled before
	 */
	$("#scheda-keywords").on("keyup", function(e) {
		// Comma warning
		if (e.keyCode === 188 && !	$("#scheda-keywords").parent(".form-group").hasClass("has-warning has-feedback")) {
    		$("#scheda-keywords").parent(".form-group").addClass("has-warning has-feedback");
			$("#scheda-keywords").parent(".form-group").append('<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>' +
				'<span class="sr-only">(warning)</span>' + 
				'<span class="help-block">La virgola non ha senso in una keyword, pensaci <i class="fa fa-smile-o fa-lg" aria-hidden="true"></i></span>');
		} else {
			// Hide warning comma message in case there is no commas
			if ($("#scheda-keywords").val().indexOf(",") === -1) {
	    		$("div.has-warning").children("span.sr-only").remove();
				$("div.has-warning").children("span.form-control-feedback").remove();
				$("div.has-warning").children("span.help-block").remove();
				$("div.has-warning").removeClass("has-warning has-feedback");
			}
			// Save keyword and add message + button-keyword or only button-keyword
			if (e.keyCode === 13 && $("#scheda-keywords").val().trim() !== "" && $("#scheda-keywords").val().indexOf(",") === -1) {
	    		var keyword = $("#scheda-keywords").val().trim();
	        	console.log(keyword);
	        	$("#scheda-keywords").val("");
	        	if ($('#temp-keywords-scheda').is(':empty')) {
		        	$("#temp-keywords-scheda").append('<p class="help-block" id="help-block-keywords">Cancella quelle inserite cliccandoci sopra.</p>' +
		        		'<button type="button" class="btn btn-sm button-keyword-large" id="' + keyword + '" onclick="deleteKeyword(\'' + keyword + '\')"><strong>' + keyword + ' </strong><i class="fa fa-times" aria-hidden="true"></i></button>');
		        } else {
		        	$("#temp-keywords-scheda").append('<button type="button" class="btn btn-sm button-keyword-large" id="' + keyword + '" onclick="deleteKeyword(\'' + keyword + '\')"><strong>' + keyword + ' </strong><i class="fa fa-times" aria-hidden="true"></i></button>');
		        }
	    	}
		}
	});
});

/**
 * Array Corsi declaration and server link
 */
var schede = [];
var server = "http://www.fashionfitness.it/dashboard/";
// var server = "http://www.auronzovacanze.com/dashboard/";

/**
 * Get schede list from file schede.json on server and run displaySchede()
 */
function getSchede() {
	console.log("getSchede()");
	schede = [];
	var script_url = server + "php/get_schede.php";
	$.ajax({
		type: "GET",
		datatype: "application/json",
		url: script_url,
		success: function(data) {
			$.each(data, function(index, element) {
				// Create array of objects schede
				var scheda = new Object();
				scheda.name = element.name;
				scheda.desc = element.desc;
				scheda.keywords = element.keywords;
				scheda.new = element.new;
				scheda.link = element.link;
				schede.push(scheda);
			});
			displaySchede();
		},
		error: function() {
			alert("Errore in getSchede()");
		}
	});
}

/**
 * Clear and update schede list and badge
 */
function displaySchede() {
	console.log("displaySchede()");
	$("#badge-schede").text(schede.length);
	$("#lista-schede").empty();
	for (var i = 0; i < schede.length; i++) {
		// Check if some keywords exist
		var keywords = schede[i].keywords;
		if (keywords === undefined) {
			var buttons = displayKeywords("keyword1,keyword2,keyword3");
		} else {
			var buttons = displayKeywords(keywords.toString());
		}
		// Badge new scheda definition
		var badge = '<span class="badge badge-text">Nuovo</span>';
		if (!schede[i].new) {
			badge = '';
		}
		// Append a new scheda panel in the list
		$("#lista-schede").append('<div class="panel panel-default">' + 
		    '<div class="panel-heading panel-personal" role="tab" id="scheda-heading' + i + '">' +
		    	'<h4 class="panel-title">' +
			        '<a role="button" class="btn-panel" data-toggle="collapse" data-parent="#lista-schede" href="#scheda-content' + i + '" aria-expanded="true" aria-controls="scheda-content' + i + '">' +
						schede[i].name + badge + 
			        '</a>' +
		    	'</h4>' +
		    '</div>' +
		    '<div id="scheda-content' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="scheda-heading' + i + '">' +
		    	'<div class="panel-body">' +
	    			'<p class="lead">' + schede[i].desc + '</p>' +
	    			'<a href="' + schede[i].link + '" target="_blank" class="btn btn-primary btn-block" role="button">Visualizza PDF</a>' +
	    			'<br>' + 
	    			'<p><strong>Keywords</strong></p>' + 
	    			'<p>' + buttons + '</p>' +
	    			'<div class="btn-group pull-right" role="group" aria-label="edit-delete">' +
			    		'<a role="button" class="btn btn-default" data-toggle="modal" data-target="#schede-modal" data-type="edit" data-index="' + i + '" data-name="' + schede[i].name + '" data-desc="' + schede[i].desc + '" data-keywords="' + keywords + '"><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i> Modifica</a>' +
			    		'<a role="button" class="btn btn-danger" data-toggle="modal" data-target="#confirm-delete-modal" data-index="' + i + '" data-name="' + schede[i].name + '" data-type="scheda"><i class="fa fa-trash fa-lg" aria-hidden="true"></i> Elimina</a>' +
		    		'</div>' +
		     	'</div>' +
		    '</div>' +
		'</div>');
	}
	waitingDialog.hide();
}

/**
 * Display keywords in every schedule panel.
 * All the keywords of the course are in the string parameter, separated by a comma.
 * Every keyword has its own button displayed with f&f style.
 */
function displayKeywords(string) {
	var buttons = "";
	var keywords = string.split(",");
	for (var i = 0; i < keywords.length; i++) {
		buttons += '<button type="button" class="btn btn-sm button-keyword"><strong>' + keywords[i] + ' </strong></button>';
	}
	return buttons;
}

/**
 * Update file schede.json on server
 */
function updateSchede(schede) {
	console.log("updateSchede()");
	// waitingDialog.show("Scrivendo sul server...", {progressType: "warning"});
	$("#schede-modal").modal("hide");

	// Sort schede in alphabetical order by name
	schede.sort(function compare(a, b) {
		if (a.name < b.name)
	    	return -1;
		if (a.name > b.name)
	    	return 1;
		return 0;
	});

	$.ajax({
        url: server + "php/write_schede.php",
        type: 'POST',
        datatype: "application/json",
        data: { json: JSON.stringify(schede) },
        success: function(response) {
        	waitingDialog.show("Scaricamento dati...", {progressType: "primary"}); // Show waiting dialog
        	getSchede();
        	showMessage("scheda");
        },
        error: function() {
        	alert("Errore in updateSchede()");
        }
    });
}

/**
 * Delete a schedule in array schede and update file on the server.
 * To delete linked pdf, just cut profile and cover link from selected schedule object
 * @param {int} index position in the array
 * @param {all} boolean, delete all schedule the whole entry in schede.json or not
 */
function deleteScheda(index, all) {
	console.log("deleteScheda()");
	var pdf_name = schede[index].link.replace(server + 'data/', '');

	$.ajax({
		url: server + 'php/delete_scheda_pdf.php',
		type: 'POST',
		datatype: 'text',
		data: { file_name: pdf_name },
		success: function() {
			if (all) {
				schede.splice(index, 1);
				updateSchede(schede);
			}
		},
		error: function() {
			alert("Errore in deleteScheda()");
		}
	});
}

/**
 * Delete temporary insert keywords by clicking its button reference
 * @param  {string} keyword to delete
 */
function deleteKeyword(keyword) {
	document.getElementById(keyword).remove();
	if ($('#temp-keywords-scheda .button-keyword-large').length === 0) {
		document.getElementById("help-block-keywords").remove();
	}
}

/**
 * Get corsi pdf link from server and display it
 */
// function getCorsiPDF() {
// 	console.log("getCorsiPDF()");
// 	var link = server + "php/get_corsi_pdf.php";
// 	var request = new XMLHttpRequest();  
// 	request.open('GET', link, true);
// 	request.onload = function() {
// 		// console.log(request);
// 		// console.log(request.response);
// 		// Check if the call is ok and the file exists
//         if (request.status === 200 && request.response == 1) {
//         	$('button#confirm-upload-pdf').html('<i class="fa fa-minus-circle fa-lg" aria-hidden="true"></i> Cancella');
//         	//$('.corsi-pdf').html('<iframe src="http://docs.google.com/gview?url=' + server + 'data/corsi.pdf&embedded=true" style="width:520px; height:400px;" frameborder="0" id="corsi-pdf"></iframe>');
//         	$('.corsi-pdf').html('<object width="520" height="600" data="' + server + 'data/corsi.pdf"></object>');
//         }
// 	};
// 	request.send();
// }

/**
 * Upload pdf on server
 */
function updateSchedaPDF(pdf) {
	console.log("updateSchedaPDF()");
	waitingDialog.show("Salvataggio in corso...", {progressType: "primary"}); // Show waiting dialog

	// FormData Object to pass to XMLHTTP request
	var formData = new FormData();
	formData.append("scheda_pdf", pdf);

	var link = server + "php/upload.php";
	var request = new XMLHttpRequest();
	request.open("POST", link, true);
	request.onload = function() {
	    if (request.status == 200) {
	    	// getCorsiPDF();
	    	updateSchede(schede);
	    	// waitingDialog.hide();
	    } else {
	    	waitingDialog.hide();
	    	alert("Error " + request.status + " occurred when trying to upload your file.");
	    }
  	};
	request.send(formData);
}

/**
 * Check pdf restrinctions.
 * Limitations:
 * - Only pdf extensions
 * - Maximum size 0,5 Mb
 */
function checkPdf(pdf) {
	console.log("checkPdf()");
	var pdfType = pdf.type;
	var pdfSize = pdf.size;
	console.log(pdfSize + pdfType)
	var error = "";
	var uploadOk = true;
	// Extension check
	if (pdfType != "application/pdf") {
		uploadOk = false;
		error = error + "Il file selezionato non è un pdf.<br>";
	}
	// Size check
	if (pdfSize > 500000) {
		uploadOk = false;
		error = error + "Il file selezionato è troppo pesante. Il limite supportato è di 500 KB.<br>" + '\n';
	}
	// Error?
	if (!uploadOk) {
		$("#alert-image-scheda").append('<div class="alert alert-danger alert-dismissable fade in">' + 
			'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + error +
			'</div>');
	}
	return uploadOk;
}