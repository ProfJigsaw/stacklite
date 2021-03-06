const signupBtn = document.getElementById('submit');
const uNameSign = document.getElementById('username');
const uMailSign = document.getElementById('email');
const uPassSign = document.getElementById('password');

const testEmail = (email) => {
  const emailregex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailregex.test(email);
};

signupBtn.addEventListener('click', (e) => {
	e.preventDefault();
	let username = uNameSign.value;
	let password = uPassSign.value;
	let email = uMailSign.value;
	if(!username || !password || !email){
		modal.style.display = "block";
		return document.getElementById('modal-info-panel').innerHTML = 'None of the fields can be empty';
	}
	if (!testEmail(email)) {
		modal.style.display = "block";
		return document.getElementById('modal-info-panel').innerHTML = 'Your Email is invalid!';
	}
	fetch('https://nvc-stackqa.herokuapp.com/api/v1/auth/signup', {
		method: 'post',
		headers : { 
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			"username": username,
			"email": email,
			"password": password,
		})
	})
	.then((response) => {
		response.json()
		.then((data) => {
			if (data.loginstate === true) {
				localStorage.setItem('jwtoken', data.token);
				window.location.assign('./user.html');
			} else {
				modal.style.display = "block";
				document.getElementById('modal-info-panel').innerHTML = data.msg;
			}
		})
		.catch(err => console.log(err));
	});
});
const modal = document.getElementById('info');
const span = document.getElementsByClassName("cancel")[0];
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}