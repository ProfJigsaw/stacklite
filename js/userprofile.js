const logoutBtn = document.getElementById('logout-link');
logoutBtn.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.removeItem('jwtoken')
	window.location.assign('./index.html');
});