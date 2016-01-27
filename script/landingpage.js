"use-strict";
const loginURL = "API/login.php";
const registerURL = "API/register.php";
const myProfilePage = "myprofilepage.html";
const cookieName = "session";
const minPasswordLength = 6;

$(window).load(function() {
	if(getCookie(cookieName) != ""){
		window.location.href= myProfilePage;
		return;
	}
	
	$("#login_btn").click(function(){
		login("","",false);
		});
	
	$("#signup_btn").click(function(){
		var username = $("#inputUsernameSignup").val();
		var pass = $("#inputPasswordSignup").val();
		var passConfirm = $("#inputPasswordAgainSignup").val();
		var usernameValidity = checkUsername(username);
		var passwordValidity = checkPassword(pass, passConfirm);
		if(usernameValidity != 0){//invalid
			giveUsernameInvalidError(usernameValidity);
			return;
		}
		if(passwordValidity	!= 0){//invalid
			givePasswordInvalidError(passwordValidity);
			return;
		}
		
		$.ajax({
			type : "POST",
			url : registerURL,
			data : {
				'username' : username,
				'password' : pass
			}
		}).always(function(returnData) {
			//'cast' to a json object
			// alert(JSON.stringify(returnData));
			var json = JSON.parse(returnData);
			if(json.error){
				alert(json.err_message);
			}else{
				// we should make it so that if a user signs up successfully
				// they are logged in with the login function 
				// this will create a session cookie and do everything 
				// that we need
				login(username, pass, true);
			}
		});
		
	});
	
	
});

/**
 *If the parameters are passed and useOptionalParameters is true
 * then the function will log in using the parameters
 * if false, then it will use the values from the inputs
 * on the login page.
 */
function login(userNameOptional, passwordOptional, useOptionalParameters) {
		var username;
		var password;
		if(useOptionalParameters){
			username = userNameOptional;
			password = passwordOptional;
		}else{
			username = $("#inputUsername").val();
			password = $("#inputPassword").val();
		}
		
		// if(username.length < 1 || password.length < 1){
		// alert("invalid username or password");
		// return;
		// }
		$.ajax({
			type : "POST",
			url : loginURL,
			data : {
				'username' : username,
				'password' : password
			}
		}).always(function(returnData) {
			//'cast' to a json object
			var json = JSON.parse(returnData);
			if(json.error){
				alert("invalid username/password :" + json.err_pos);
			}else{
				if(json.cookie != null){
					if(parseInt(json.cookie.length) == 40 ){
						setCookie(cookieName,json.cookie);
						window.location.href= myProfilePage;
						return;
					}
				}
				alert("cookie null...?");
			}
		});
	}

/**
 *  Check if username is valid and return an error code if not,
 *  0: valid
 *  1: username too short
 * 	2: username too long
 * 	3: username invalid, "must contain only ... and cannot... " message
 * 	4: username is already taken
 * 	Server side validation is also needed for security
 * 	
 * 
 * 
 */
function checkUsername(username){
	if(username.length < 3){
		return 1;
	}
	if(username.length > 20){
		return 2;
	}
	var reg = /^[a-zA-Z0-9._]{3,20}$/;
	var testReg = reg.test(username);
    if(!testReg){
    	return 3;
    }
    return 0;
}

/**
 * Check is password is valid and returns an error code if not,
 * returns an int, all punct are valid, as well as spaces
 *  0: valid
 * 	1: password too short
 * 	2: passwords dont match
 * @param {String} pass
 * @param {String} passConfirm
 */
function checkPassword(pass, passConfirm){
	if(pass.length < minPasswordLength){
		return 1;
	}
	if(pass !== passConfirm){
		return 2;
	}
	return 0;
}

function giveUsernameInvalidError(code){
	//TODO: alert invalid username
	alert("invalid username" + code);
}


function givePasswordInvalidError(code){
	//TODO: alert invalid Password
	alert("invalid Password");
}

