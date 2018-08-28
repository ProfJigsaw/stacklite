const allQ = document.getElementById('all-questions');
const addQ = document.getElementById('addquestion');
const recentQ = document.getElementById('recent-questions');
const homepage = document.getElementById('home');
const searcher = document.getElementById('search-input');
const logoutBtn = document.getElementById('logout-link');
const mainContent = document.getElementById('main-content-container');

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
  	mainContent.innerHTML = `
	    <h1>Hello, <span id="hello">${data.username}</span>!</h1>
	    <h2 id="main-header"> Welcome to, StackOverFlow Lite</h2>
	    <br />
	    <h3>STACK TIP</h3>
	    <i>
	      This is a platform for asking useful questions on any aspect 
	      of life and getting feedback from others on the platform.
	      <p>To the left of the screen are options for navigating your 
	      page, at the top right hand corner of the page are buttons to 
	      view your profile and account information and to logout. </p>
	    </i>
	`;
  });
})
.catch(err => console.log(err))

const makeQuestion = (qobj) => {
	return `
		<div id="questions">
      <p> User: <strong>${qobj.username}</strong> asked</p>
      <h3><a class="question-item" questionid="${qobj.questionid}" href="#">${qobj.question}</a></h3>
      <button class="delete-question" questionid="${qobj.questionid}">Delete this question</button>
    </div>
	`;
}

// helper function to get question thread
const questionThread = (id) => {
	fetch(`https://nvc-stackqa.herokuapp.com/api/v1/questions/${id}`, {
	  method: 'get',
	  headers: {
	  	Accept: 'application/json',
	  	Authorization: `header ${localStorage.getItem('jwtoken')}`
	  }
  })
	.then(response => {
    response.json()
    .then((data) => {
    	if(data.getstate === true){
    		if(data.astack) {
		      	mainContent.innerHTML =  `
		      		<div id="questions">
				      <p> User: <strong>${data.qstack[0].username}</strong> asked</p>
				      <h3 id="question-returned" questionid="${data.qstack[0].questionid}">${data.qstack[0].question}</h3>
				      </div>
				      ${handleAnswers(data.astack)}
				      <div id="add-answer">
		            <form method="post" action="/api/v1/questions/{questions.questionId}/answers">
		              <textarea type="text" name="answer" id="form-answer-input" required></textarea>
		              <br>
		              <input type="submit" value="Add answer" id="add-answer-button" name="submit" />
		            </form>
		          </div>
				     `;
    		} else {
    			mainContent.innerHTML = `
			      <div id="questions">
			      <p> User: <strong>${data.qstack[0].username}</strong> asked</p>
			      <h3 id="question-returned" questionid="${data.qstack[0].questionid}">${data.qstack[0].question}</h3>
			      </div>		      
			      <div id="add-answer">
	            <form method="post" action="/api/v1/questions/{questions.questionId}/answers">
	              <textarea type="text" name="answer" id="form-answer-input" required></textarea>
	              <br>
	              <input type="submit" value="Add answer" id="add-answer-button" name="submit" />
	            </form>
	          </div>
	    		`;
    		}
    		createPostAnswerLink();
    		acceptAnswerLink();
    	}
    });
	})
	.catch(err => console.log(err))
}

// Helper to handle loading of returned if available
const handleAnswers = (arr) => {
	let returnString = '';
	arr.map(ans => {
		returnString += `
    	<div class="answers ${ans.state === true ? 'accepted' : ''}">
        <strong id="username">${ans.username}</strong> answered:<p> ${ans.answer}
        <form method="#" action="#">
            <strong>
                <button questionid="${ans.questionid}" answerid="${ans.answerid}" class="accept-answer">Accept Answer</button>
            </strong>
        </form>
        <div class="votes">
            <a href="#">Upvote</a>
            <span>${ans.upvotes}</span>
            <a href="#">Downvote</a>
            <span>${ans.downvotes}</span>
        </div>
      </div>
		`;
	})
	return returnString;
}

// Helper function to add event to post answer
const createPostAnswerLink = () => {
	const postAnswerBtn = document.getElementById('add-answer-button');
	postAnswerBtn.addEventListener('click', (e) => {
		e.preventDefault();
		if (!document.getElementById('form-answer-input').value) {
			modal.style.display = "block";
			return document.getElementById('modal-info-panel').innerHTML = 'You must enter an answer to submit!';
		}
		if (!document.getElementById('form-answer-input').value.trim()) {
			modal.style.display = "block";
			return document.getElementById('modal-info-panel').innerHTML = 'Your Entry is still empty!';
		}
		let id = document.getElementById('question-returned').getAttribute('questionid');
		postAnswerHelper(id);
		questionThread(id);
	})
}

// Helper function to add event to accept-answer button
const acceptAnswerLink = () => {
	const acceptBtn = document.querySelectorAll('.accept-answer');
		acceptBtn.forEach((node) => {
			node.addEventListener('click', (e) => {
			e.preventDefault();
			let qid = e.target.getAttribute('questionid');
			let aid = e.target.getAttribute('answerid');
			acceptAnswerHandler(qid, aid);
			questionThread(qid);
		})
	})
}

// Heler to accept a particular answer
const acceptAnswerHandler = (qid, aid) => {
		fetch(`https://nvc-stackqa.herokuapp.com/api/v1/questions/${qid}/answers/${aid}`, {
		method: 'put',
		headers : { 
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization' : `header ${localStorage.getItem('jwtoken')}`
		}
	})
	.then((response) => {
		response.json()
		.then((data) => {
			modal.style.display = "block";
			return document.getElementById('modal-info-panel').innerHTML = data.msg;
		})
		.catch(err => console.log(err));
	});
}

// helper to post an answer using fetch API tool
const postAnswerHelper = (id) => {
	fetch(`https://nvc-stackqa.herokuapp.com/api/v1/questions/${id}/answers`, {
		method: 'post',
		headers : { 
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `header ${localStorage.getItem('jwtoken')}`
		},
		body: JSON.stringify({
			"answer": document.getElementById('form-answer-input').value
		})
	})
	.then((response) => {
		response.json()
		.then((data) => {
			if (data.loginstate === true) {
				modal.style.display = "block";
				document.getElementById('modal-info-panel').innerHTML = data.msg;
			} else {
				modal.style.display = "block";
				document.getElementById('modal-info-panel').innerHTML = data.msg;
			}
		})
		.catch(err => console.log(err));
	});
}

// Helper function to add event listeners to all add questions links
const createLinkHandlers = () => {
	let x = document.querySelectorAll(".question-item");
	x.forEach(node => {
		node.addEventListener('click', (e) => {
			e.preventDefault();
			let id = e.target.getAttribute('questionid');
			questionThread(id);
		})
	})
}

// Helper function to get all questions and update the main content container
const getAllQuestions = () => {
	fetch('https://nvc-stackqa.herokuapp.com/api/v1/questions', {
	  method: 'get',
	  headers: {
	  	Accept: 'application/json',
	  	Authorization: `header ${localStorage.getItem('jwtoken')}`
	  }
  })
	.then(response => {
    response.json()
    .then((data) => {
      let questionList = '';
      data.qstack.reverse().map(question => {
      	questionList += makeQuestion(question);
      })
      mainContent.innerHTML = questionList;
      createLinkHandlers();
      deleteQuestionHook();
    });
	})
	.catch(err => console.log(err))
}

// A handler for creating link handlers to delete
const deleteQuestionHook = () => {
	let delBtns = document.querySelectorAll('.delete-question');
	delBtns.forEach(node => {
		node.addEventListener('click', (e) => {
			e.preventDefault();
			deleteQuestionHandler(e.target.getAttribute('questionid'));
		})
	})
}

// Handler to delete a particular question
const deleteQuestionHandler = (id) => {
	fetch(`https://nvc-stackqa.herokuapp.com/api/v1/questions/${id}`, {
		method: 'delete',
		headers : { 
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization' : `header ${localStorage.getItem('jwtoken')}`
		}
	})
	.then((response) => {
		response.json()
		.then((data) => {
			getAllQuestions();
			modal.style.display = "block";
			return document.getElementById('modal-info-panel').innerHTML = data.msg;
		})
		.catch(err => console.log(err));
	});
}

// Get all questions handler
allQ.addEventListener('click', (e) => {
	e.preventDefault();
	getAllQuestions();
})

// Get recent questions handler
recentQ.addEventListener('click', (e) => {
	e.preventDefault();
	getAllQuestions();
})


// add question dialog handler
addQ.addEventListener('click', (e) => {
	e.preventDefault();
	mainContent.innerHTML = `
		<div id="add-question">
		    <h3 id="askhead">Ask Your Question:</h3>
		    <form action="#" method="post">
		            <br>
		            <textarea type="text" name="question" id="form-question-input"required></textarea>
		        </label>
		        <br>
		        <input type="submit" value="Add question" name="submit" class="submit" id="addquestion-button" />
		    </form>
		</div>
	`;
	const addQBtn = document.getElementById('addquestion-button');
	// post question handler
	addQBtn.addEventListener('click', (e) => {
		e.preventDefault();

		let question = document.getElementById('form-question-input').value

		if(!question){
			modal.style.display = "block";
			return document.getElementById('modal-info-panel').innerHTML = 'Empty question cannot be submitted';
		} else if (!question.trim()) {
			modal.style.display = "block";
			return document.getElementById('modal-info-panel').innerHTML = 'Empty question cannot be submitted';
		}
		postQuestionHandler(document.getElementById('form-question-input').value);
		getAllQuestions();
		})
	})

// Post question handler
const postQuestionHandler = (qentry) => {
		fetch('https://nvc-stackqa.herokuapp.com/api/v1/questions', {
		method: 'post',
		headers : { 
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization' : `header ${localStorage.getItem('jwtoken')}`
		},
		body: JSON.stringify({
			"question": qentry
		})
	})
	.then((response) => {
		response.json()
		.then((data) => {
			modal.style.display = "block";
			return document.getElementById('modal-info-panel').innerHTML = data.msg;
			getAllQuestions();
		})
		.catch(err => console.log(err));
	});
}

logoutBtn.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.removeItem('jwtoken')
	window.location.assign('./index.html');
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