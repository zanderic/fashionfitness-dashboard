$(document).ready(function() {
	$('.form-signin').submit(function(e) {
    	e.preventDefault();
	    var username = document.getElementById('input-username').value;
		var password = document.getElementById('input-password').value;
		console.log('user: ' + username);
		console.log('pass: ' + password);
		control(username, password);
	});
});

// The schema declaration process is performed once and the API is synchronous.
var schemaBuilder = lf.schema.create('fashionfitness', 1);
schemaBuilder.createTable('login').
	addColumn('id', lf.Type.INTEGER).
	addColumn('username', lf.Type.STRING).
	addColumn('password', lf.Type.STRING).
	addColumn('active', lf.Type.BOOLEAN).
	addPrimaryKey(['id']);

// Connect to the database and add an account
schemaBuilder.connect().then(function(db) {
	var account = db.getSchema().table('login');
	var row = account.createRow({
		'id': 1,
		'username': 'admin',
		'password': 'admin',
		'active': false
	});
	// .insert / .insertOrReplace: .insert will operate only if there not exists a row with PK = 1.
	return db.insert().
			into(account).
			values([row]).
			exec().
	then(function(results) {
		console.log("Database creato correttamente.");
	}, function(error) {
		console.log("Database già creato, controllo se utente è loggato...")
    	redirect();
	});
});

/**
 * Control if user is already logged in.
 */
function redirect() {
	var schemaBuilder = lf.schema.create('fashionfitness', 1);
	schemaBuilder.createTable('login').
		addColumn('id', lf.Type.INTEGER).
		addColumn('username', lf.Type.STRING).
		addColumn('password', lf.Type.STRING).
		addColumn('active', lf.Type.BOOLEAN).
		addPrimaryKey(['id']);
	// Connect to the database and add an account
	schemaBuilder.connect().then(function(db) {
		var account = db.getSchema().table('login');
		return db.select().
				from(account).
				where(account.active.eq(true)).
				exec().
		then(function(results) {
			results.forEach(function(row) {
				console.log("Utente loggato, reindirizzo alla dashboard");
				// window.location.href = "home.html" // Adds an item to the history
				window.location.replace("home.html"); // It replaces the current history item, you can't go back
			});
		});
	});
}

/**
 * Provide secure login checking username and password.
 * Variables myDB and account are necessary because the fathers db and account
 * ends after the query. We need their content for the whole function.
 * @param  {string} username user input
 * @param  {string} password user input
 */
function control(username, password) {
	var schemaBuilder = lf.schema.create('fashionfitness', 1);
	var myDb;
	var account;
	schemaBuilder.connect().then(function(db) {
		myDb = db;
		account = db.getSchema().table('login');
		return db.select().
				from(account).
				where(account.username.eq(username) && account.password.eq(password)).
				exec();
	}).then(function(results) {
		console.log(results);
		if (results.length == 0 && !$("#input-username").parent(".form-group").hasClass("has-error has-feedback")) {
			$("#input-username").parent(".form-group").addClass("has-error has-feedback");
				$("#input-username").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>');
			$("#input-password").parent(".form-group").addClass("has-error has-feedback");
				$("#input-password").parent(".form-group").append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
  					'<span class="sr-only">(error)</span>' +
  					'<span class="help-block">Credenziali errate!</span>');
		}
		results.forEach(function(row) {
			myDb.update(account).
				set(account.active, true).
				exec();
			// window.location.href = "home.html" // Adds an item to the history
			window.location.replace("home.html"); // It replaces the current history item, you can't go back
		});
	});
}