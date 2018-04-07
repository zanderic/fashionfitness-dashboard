$(document).ready(function() {
	/**
	 * Design modal based on the use we need
	 */
	$("#corso-modal").on("show.bs.modal", function(event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var type = button.data("type"); // Extract info from data-* attributes
		var modal = $(this);
		modal.find("#corso-name").val("");
		modal.find("#corso-desc").val("");
		modal.find("#corso-keywords").val("");
		modal.find(".button-keyword-large").remove();
		modal.find("#help-block-keywords").remove();
		resetErrors(); // Reset all previous errors or warnings
		if (type === "edit") {
			modal.find(".modal-title").text('Modifica Corso');
			modal.find("#confirm-action-corso").text("Modifica");
			modal.find('#corso-name').attr("placeholder", button.data("name"));
			modal.find('#corso-name').attr("index", button.data("index"));
			modal.find('#corso-desc').attr("placeholder", button.data("desc"));
			modal.find('#temp-keywords').append('<p class="help-block" id="help-block-keywords">Cancella quelle inserite cliccandoci sopra.</p>');
			var keywords = button.data("keywords").split(",");
			for (var i = 0; i < keywords.length; i++) {
				modal.find("#temp-keywords").append('<button type="button" class="btn btn-sm button-keyword-large" id="' + keywords[i] + '" onclick="deleteKeyword(\'' + keywords[i] + '\')"><strong>' + keywords[i] + ' </strong><i class="fa fa-times" aria-hidden="true"></i></button>');
			}
		} else {
			modal.find(".modal-title").text('Crea Corso');
			modal.find("#confirm-action-corso").text("Crea");
			modal.find('#corso-name').removeAttr("placeholder");
			modal.find('#corso-desc').removeAttr("placeholder");
			modal.find('#corso-new').attr("checked", true);
		}
	});

	/**
	 * Define behaviour of confirm button, that is create new course or edit an old one
	 */
	$("#confirm-action-corso").click(function() {
		resetErrors();
		var type = $(this).text();
		var name = document.getElementById("corso-name").value.trim(); // New or edited name
		var desc = document.getElementById("corso-desc").value.trim(); // New or editer description
		var labelNew = document.getElementById("corso-new").checked;
		var keywords = []; // New or edited keywords
		var buttons = document.getElementById("temp-keywords").children;
		for (var i = 0; i < buttons.length; i++) {
		    if (buttons[i].className === "btn btn-sm button-keyword-large") {
		    	keywords.push(buttons[i].id);
		    }
		}

		if (name !== "" && desc !== "" && keywords.length > 0) {
			if (type === "Crea") {
				// Update file corsi.json on server with a new course
				var corso = new Object();
				corso.name = name;
				corso.desc = desc;
				corso.keywords = keywords;
				corso.new = labelNew;
				corsi.push(corso);
			} else {
				// Update file corsi.json on server with an updated course
				var number = $("#corso-name").attr("index");
				corsi[number].name = name;
				corsi[number].desc = desc;
				corsi[number].keywords = keywords;
				corsi[number].new = labelNew;
			}
			updateCorsi(corsi);
		} else {
			// Manage message error in input fields
			if (name === "") {
				$("#corso-name").parent(".form-group").addClass("has-error has-feedback");
				$("#corso-name").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Inserire un nome per il corso.</span>');
			} else {
				$("#corso-name").parent(".form-group").addClass("has-success has-feedback");
				$("#corso-name").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (desc === "") {
				$("#corso-desc").parent(".form-group").addClass("has-error has-feedback");
				$("#corso-desc").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire una descrizione per il corso.</span>');	
			} else {
				$("#corso-desc").parent(".form-group").addClass("has-success has-feedback");
				$("#corso-desc").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (keywords.length === 0) {
				$("#corso-keywords").parent(".form-group").addClass("has-error has-feedback");
				$("#corso-keywords").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Inserire almeno una parola chiave per il corso.</span>');	
			} else {
				$("#corso-keywords").parent(".form-group").addClass("has-success has-feedback");
				$("#corso-keywords").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
		}
	});

	/**
	 * Transform an inserted keyword in a button by pressing enter, ready to be processed or canceled before
	 */
	$("#corso-keywords").on("keyup", function(e) {
		// Comma warning
		if (e.keyCode === 188 && !	$("#corso-keywords").parent(".form-group").hasClass("has-warning has-feedback")) {
    		$("#corso-keywords").parent(".form-group").addClass("has-warning has-feedback");
			$("#corso-keywords").parent(".form-group").append('<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>' +
				'<span class="sr-only">(warning)</span>' + 
				'<span class="help-block">La virgola non ha senso in una keyword, pensaci <i class="fa fa-smile-o fa-lg" aria-hidden="true"></i></span>');
		} else {
			// Hide warning comma message in case there is no commas
			if ($("#corso-keywords").val().indexOf(",") === -1) {
	    		$("div.has-warning").children("span.sr-only").remove();
				$("div.has-warning").children("span.form-control-feedback").remove();
				$("div.has-warning").children("span.help-block").remove();
				$("div.has-warning").removeClass("has-warning has-feedback");
			}
			// Save keyword and add message + button-keyword or only button-keyword
			if (e.keyCode === 13 && $("#corso-keywords").val().trim() !== "" && $("#corso-keywords").val().indexOf(",") === -1) {
	    		var keyword = $("#corso-keywords").val().trim();
	        	console.log(keyword);
	        	$("#corso-keywords").val("");
	        	if ($('#temp-keywords').is(':empty')) {
		        	$("#temp-keywords").append('<p class="help-block" id="help-block-keywords">Cancella quelle inserite cliccandoci sopra.</p>' +
		        		'<button type="button" class="btn btn-sm button-keyword-large" id="' + keyword + '" onclick="deleteKeyword(\'' + keyword + '\')"><strong>' + keyword + ' </strong><i class="fa fa-times" aria-hidden="true"></i></button>');
		        } else {
		        	$("#temp-keywords").append('<button type="button" class="btn btn-sm button-keyword-large" id="' + keyword + '" onclick="deleteKeyword(\'' + keyword + '\')"><strong>' + keyword + ' </strong><i class="fa fa-times" aria-hidden="true"></i></button>');
		        }
	    	}
		}
	});

	/**
	 * Define behaviour of confirm button of upload corsi PDF. It check the file and manage errors.
	 */
	$("#confirm-upload-pdf").click(function() {
		var buttonText = $(this).text().trim();
		if (buttonText == "Cancella") {
			$('button#confirm-upload-pdf').html('<i class="fa fa-upload fa-lg" aria-hidden="true"></i> Carica');
			$('.corsi-pdf').html('<div class="form-inline"><div class="form-group"><label for="upload-corsi-pdf">caricamento PDF</label>' +
				'<input type="file" id="upload-corsi-pdf" name="upload-corsi-pdf"></div></div>');
		} else {
			resetErrors();
			var pdf = document.getElementById("upload-corsi-pdf").files[0];
			if (pdf != undefined && checkPdf(pdf)) {
				updateCorsiPDF(pdf);
			} else if (pdf == undefined) {
				$("#upload-corsi-pdf").parent(".form-group").addClass("has-error has-feedback");
					$("#upload-corsi-pdf").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
	  					'<span class="sr-only">(error)</span>' + 
	  					'<span class="help-block">Inserire un file in formato PDF.</span>');
			}
		}
	});
});

/**
 * Array Corsi declaration and server link
 */
var corsi = [];
var server = "http://www.fashionfitness.it/dashboard/";

/**
 * Get corsi list from file corsi.json on server and run displayCorsi()
 */
function getCorsi() {
	corsi = [];
	var script_url = server + "php/get_corsi.php";
	$.ajax({
		type: "GET",
		datatype: "application/json",
		url: script_url,
		success: function(data) {
			$.each(data, function(index, element) {
				// Create array of objects Corsi
				var corso = new Object();
				corso.name = element.name;
				corso.desc = element.desc;
				corso.keywords = element.keywords;
				corso.new = element.new;
				corsi.push(corso);
			});
			displayCorsi();
		},
		error: function() {
			alert("Errore in getCorsi()");
		}
	});
}

/**
 * Clear and update corsi list and badge
 */
function displayCorsi() {
	$("#badge-corsi").text(corsi.length);
	$("#lista-corsi").empty();
	for (var i = 0; i < corsi.length; i++) {
		// Check if some keywords exist
		var keywords = corsi[i].keywords;
		if (keywords === undefined) {
			var buttons = displayKeywords("keyword1,keyword2,keyword3");
		} else {
			var buttons = displayKeywords(keywords.toString());
		}
		// Badge new corso definition
		var badge = '<span class="badge badge-text">Nuovo</span>';
		if (!corsi[i].new) {
			badge = '';
		}
		// Append a new corso panel in the list
		$("#lista-corsi").append('<div class="panel panel-default">' + 
		    '<div class="panel-heading panel-personal" role="tab" id="corso-heading' + i + '">' +
		    	'<h4 class="panel-title">' +
			        '<a role="button" class="btn-panel" data-toggle="collapse" data-parent="#lista-corsi" href="#corso-content' + i + '" aria-expanded="true" aria-controls="corso-content' + i + '">' +
						corsi[i].name + badge + 
			        '</a>' +
		    	'</h4>' +
		    '</div>' +
		    '<div id="corso-content' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="corso-heading' + i + '">' +
		    	'<div class="panel-body">' +
	    			'<p class="lead">' + corsi[i].desc + '</p>' +
	    			'<p><strong>Keywords</strong>' + 
	    			'<p>' + buttons + '</p>' +
	    			'<div class="btn-group pull-right" role="group" aria-label="edit-delete">' +
			    		'<a role="button" class="btn btn-default" data-toggle="modal" data-target="#corso-modal" data-type="edit" data-index="' + i + '" data-name="' + corsi[i].name + '" data-desc="' + corsi[i].desc + '" data-keywords="' + keywords + '"><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i> Modifica</a>' +
			    		'<a role="button" class="btn btn-danger" data-toggle="modal" data-target="#confirm-delete-modal" data-index="' + i + '" data-name="' + corsi[i].name + '" data-type="corso"><i class="fa fa-trash fa-lg" aria-hidden="true"></i> Elimina</a>' +
		    		'</div>' +
		     	'</div>' +
		    '</div>' +
		'</div>');
	}
	waitingDialog.hide();
}

/**
 * Display keywords in every course panel.
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
 * Update file corsi.json on server
 */
function updateCorsi(corsi) {
	waitingDialog.show("Scrivendo sul server...", {progressType: "warning"});
	$("#corso-modal").modal("hide");

	// Sort corsi in alphabetical order by name
	corsi.sort(function compare(a, b) {
		if (a.name < b.name)
	    	return -1;
		if (a.name > b.name)
	    	return 1;
		return 0;
	});

	$.ajax({
        url: server + "php/write_corsi.php",
        type: 'POST',
        datatype: "application/json",
        data: {
            json: JSON.stringify(corsi)
        },
        success: function(response) {
        	waitingDialog.show("Scaricamento dati...", {progressType: "primary"}); // Show waiting dialog
        	getCorsi();
        	showMessage("corsi");
        },
        error: function() {
        	alert("Errore in updateCorsi()");
        }
    });
}

/**
 * Delete a course in array corsi and update file on the server
 * @param  {int} index position in the array
 */
function deleteCorso(index) {
	corsi.splice(index, 1);
	updateCorsi(corsi);
}

/**
 * Delete temporary insert keywords by clicking its button reference
 * @param  {string} keyword to delete
 */
function deleteKeyword(keyword) {
	document.getElementById(keyword).remove();
	if ($('#temp-keywords .button-keyword-large').length === 0) {
		document.getElementById("help-block-keywords").remove();
	}
}

/**
 * Get corsi pdf link from server and display it
 */
function getCorsiPDF() {
	console.log("getCorsiPDF()");
	var link = server + "php/get_corsi_pdf.php";
	var request = new XMLHttpRequest();  
	request.open('GET', link, true);
	request.onload = function() {
		// console.log(request);
		// console.log(request.response);
		// Check if the call is ok and the file exists
        if (request.status === 200 && request.response == 1) {
        	$('button#confirm-upload-pdf').html('<i class="fa fa-minus-circle fa-lg" aria-hidden="true"></i> Cancella');
        	//$('.corsi-pdf').html('<iframe src="http://docs.google.com/gview?url=' + server + 'data/corsi.pdf&embedded=true" style="width:520px; height:400px;" frameborder="0" id="corsi-pdf"></iframe>');
        	$('.corsi-pdf').html('<object width="520" height="600" data="' + server + 'data/corsi.pdf"></object>');
        }
	};
	request.send();
}

/**
 * Upload pdf on server then call updateCorsiPDFTarget()
 */
function updateCorsiPDF(pdf) {
	waitingDialog.show("Salvataggio in corso...", {progressType: "primary"}); // Show waiting dialog

	// FormData Object to pass to XMLHTTP request
	var formData = new FormData();
	formData.append("corsi_pdf", pdf);

	var link = server + "php/upload.php";
	var request = new XMLHttpRequest();
	request.open("POST", link, true);
	request.onload = function() {
	    if (request.status == 200) {
	    	getCorsiPDF();
	    	waitingDialog.hide();
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
		error = error + "Il caricamento non è andato a buon fine!";
		$("#alert-corsi-pdf").append('<div class="alert alert-danger alert-dismissable fade in">' + 
			'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + error +
			'</div>');
	}
	return uploadOk;
}