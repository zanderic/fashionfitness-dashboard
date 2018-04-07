$(document).ready(function() {
	isLogged();

	$('[data-toggle="tooltip"]').tooltip();

	/**
	 * Reset all previous errors and clears input fields
	 */
	$("#account-modal").on("show.bs.modal", function(event) {
		resetErrors();
		$("#new-username").val("");
		$("#new-password").val("");
		$("#new-password-confirm").val("");
	});

	/**
	 * Checks fields, manages error messages and calls function changeCredentials()
	 */
	$("#change-credentials").click(function() {
		resetErrors();
		var username = document.getElementById("new-username").value;
		var password = document.getElementById("new-password").value;
		var passwordConfirm = document.getElementById("new-password-confirm").value;
		if (username !== "" && password !== "" && password === passwordConfirm) {
			changeCredentials(username, password);
		} else {
			if (username === "") {
				$("#new-username").parent(".form-group").addClass("has-error has-feedback");
				$("#new-username").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Inserire uno username.</span>');
			} else {
				$("#new-username").parent(".form-group").addClass("has-success has-feedback");
				$("#new-username").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (password === "") {
				$("#new-password").parent(".form-group").addClass("has-error has-feedback");
				$("#new-password").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Inserire una password.</span>');
			} else {
				$("#new-password").parent(".form-group").addClass("has-success has-feedback");
				$("#new-password").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (passwordConfirm === "") {
				$("#new-password-confirm").parent(".form-group").addClass("has-error has-feedback");
				$("#new-password-confirm").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Inserire la password una seconda volta.</span>');
			} else {
				$("#new-password-confirm").parent(".form-group").addClass("has-success has-feedback");
				$("#new-password-confirm").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
			if (password != passwordConfirm) {
				$("#new-password-confirm").parent(".form-group").addClass("has-error has-feedback");
				$("#new-password-confirm").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' + 
  					'<span class="help-block">Le due password non coincidono, riprovare.</span>');
			} else {
				$("#new-password-confirm").parent(".form-group").addClass("has-success has-feedback");
				$("#new-password-confirm").parent(".form-group").append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(success)</span>');
			}
		}
	});

	/**
	 * Design modal for confirmation of deleting corso or trainer
	 */
	$("#confirm-delete-modal").on("show.bs.modal", function(event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var modal = $(this);
		modal.find(".modal-body p").html("Sei sicuro di voler eliminare <strong>" + button.data('name') + "</strong>?");
		switch (button.data('type')) {
			case "corso":
				modal.find("#confirm-action-delete").attr("onclick", "deleteCorso(" + button.data('index') + ")");
				break;
			case "trainer":
				modal.find("#confirm-action-delete").attr("onclick", "deleteTrainer(" + button.data('index') + ")");
				break;
			case "promo":
				modal.find("#confirm-action-delete").attr("onclick", "deletePromo(" + button.data('index') + ")");
				break;
			case "scheda":
				modal.find("#confirm-action-delete").attr("onclick", "deleteScheda(" + button.data('index') + ", true)");
				break;
		}
	});
});

var myDb; // Image of the database
var account; // Image of the login table
var schemaBuilder = lf.schema.create('fashionfitness', 1);
schemaBuilder.createTable('login').
	addColumn('id', lf.Type.INTEGER).
	addColumn('username', lf.Type.STRING).
	addColumn('password', lf.Type.STRING).
	addColumn('active', lf.Type.BOOLEAN).
	addPrimaryKey(['id']);

/**
 * Checks if user is logged through a query to the database
 */
function isLogged() {
	schemaBuilder.connect().then(function(db) {
		myDb = db;
		account = db.getSchema().table('login');
		return db.select().
				from(account).
				where(account.active.eq(false)).
				exec();
	}).then(function(results) {
		if (results.length == 0) {
			waitingDialog.show("Scaricamento dati...", {progressType: "primary"}); // Show waiting dialog
			getCorsi();
			getCorsiPDF();
			getTeam();
			getPromo();
			getSchede();
		}
		results.forEach(function(row) {
			alert("Ci hai provato... Accesso negato!");
			window.location.href = "index.html";
		});
	});
}

/**
 * Change access credentials with a query that modifies the login table
 * @param {string} username new username
 * @param {string} password new password
 */
function changeCredentials(username, password) {
	return myDb.update(account).
				set(account.username, username).
				set(account.password, password).
				where(account.active.eq(true)).
				exec().
	then(function(results) {
		showMessage("credentials");
		$("#account-modal").modal("hide");
	}, function (error) {
    	alert('Problema aggiornamento del database, vedi console.');
    	console.log('error: ' + error);
	});
}

function logout() {
	myDb.update(account).
		set(account.active, false).
		where(account.active.eq(true)).
		exec();
	window.location.href = "index.html";
}

function resetPassword() {
	myDb.update(account).
		set(account.username, "admin").
		set(account.password, "admin").
		where(account.active.eq(true)).
		exec();
	showMessage("reset");
}

/**
 * Hide and reset all warnings in input fields
 */
function resetErrors() {
	console.log("resetErrors");
	$("div.has-error").children("span.sr-only").remove();
	$("div.has-error").children("span.form-control-feedback").remove();
	$("div.has-error").children("span.help-block").remove();
	$("div.has-error").removeClass("has-error has-feedback");
	$("div.has-success").children("span.sr-only").remove();
	$("div.has-success").children("span.form-control-feedback").remove();
	$("div.has-success").children("span.help-block").remove();
	$("div.has-success").removeClass("has-success has-feedback");
	if ($("#corso-keywords").val() === "") {
		$("div.has-warning").children("span.sr-only").remove();
		$("div.has-warning").children("span.form-control-feedback").remove();
		$("div.has-warning").children("span.help-block").remove();
		$("div.has-warning").removeClass("has-warning has-feedback");
	}
	$("div#alert-image-scheda").html("");
}

/**
 * Show messages in the correct panel.
 * Input string is the panel name in which the massage should be placed
 */
function showMessage(context) {
	var message = "";
	switch (context) {
		case "corsi":
			message = "Elenco dei corsi <strong>aggiornato!</strong>";
			pointer = "#alert-corsi";
			break;
		case "team":
			message = "Elenco del team <strong>aggiornato!</strong>";
			pointer = "#alert-team";
			break;
		case "promo":
			message = "Promozioni <strong>aggiornate!</strong>";
			pointer = "#alert-promo";
			break;
		case "credentials":
			message = "Le <strong>credenziali d'accesso</strong> sono state modificate!";
			pointer = "#alert-corsi";
			break;
		case "reset":
			message = "Reset delle <strong>credenziali d'accesso</strong> eseguito correttamente!";
			pointer = "#alert-corsi";
			break;
		case "scheda":
			message = "Elenco delle schede d'allenamento aggiornato!";
			pointer = "#alert-schede";
			break;	
	}
	if ($(pointer + " .alert").length == 0 ) {
		$(pointer).append('<div class="alert alert-success alert-dismissable fade in">' +
			'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
				message + '</div>');
	}
}

/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 * @author Eugene Maslovich <ehpc@em42.ru>
 * @copyright http://bootsnipp.com/snippets/featured/quotwaiting-forquot-modal-dialog
 */
var waitingDialog = waitingDialog || (function($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
			'<div class="modal-dialog modal-m">' +
				'<div class="modal-content">' +
					'<div class="modal-header">' +
						'<h3 style="margin:0;"></h3>' +
					'</div>' +
					'<div class="modal-body">' +
						'<div class="progress progress-striped active" style="margin-bottom:0;">' +
							'<div class="progress-bar" style="width: 100%"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Aggiornamento lista corsi...';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};
})(jQuery);