const logoutBtn = document.getElementById('logout-link');
logoutBtn.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.removeItem('jwtoken')
	window.location.assign('./index.html');
});

fetch('https://nvc-stackqa.herokuapp.com/api/v1/auth/users', {
  method: 'get',
  headers: {
  	Accept: 'application/json',
  	Authorization: `header ${localStorage.getItem('jwtoken')}` 
  }
})
.then(response => {
  response.json()
  .then((data) => {
  	console.log(data);
  	document.getElementById('username-root').innerHTML = data.username;
  	document.getElementById('email-root').innerHTML = data.email;
  });
})
.catch(err => console.log(err))