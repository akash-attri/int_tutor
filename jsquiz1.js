(function() {
  var questions = [{
    question: "How many apples are there?",
    part2 : "",
    choices: [13, 5, 12, 10],
    correctAnswer: 0
  }, {
    question: "Rob saw 17 squirrels, but one of them ran away.",
    part2 : "How many squirrels are left?",
    choices: [17, 6, 7, 16],
    correctAnswer: 3
  }, {
    question: "Which of these is not a missing no. in the sequence",
    part2 : "4, 5, 6, __ , __ , 9, __ , 11",
    choices: [8, 7, 19, 10],
    correctAnswer: 2
  }, {
    question: "Are there fewer ice cream cones or cookies?",
    part2 : "",
    choices: ["Ice cream cones are fewer", "Cookies are fewer", "There are the same number of each"],
    correctAnswer: 2
  }, {
    question: "Santa received 35 letters on Sunday and 75 on Monday.",
    part2 : "When did he recieve more letters?",
    choices: ["Monday", "Sunday", "Same number of letters"],
    correctAnswer: 0
  }];
  
  var apples = 0;	//For assigning images to questions
  var squirrels = 1;
  var food = 3;
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object
  
  // Display initial question
  displayNext();
  
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    
    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please select an option!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  
  // Animates buttons on hover
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    //var header = $('<h3>Question ' + (index + 1) + ':</h3>');	qElement.append(header);

    var question = $('<h4>').append((index + 1) + '. ' + questions[index].question);
    qElement.append(question);
    
    if(questions[index].part2 != "") {
		var part2 = $('<h4>').append(questions[index].part2);
		qElement.append(part2);
	}
    if(index==apples) {
		qElement.append('<img id="qusImg" src="img_apples.png" />');
	}
	else if(index==squirrels) {
		qElement.append('<img id="qusImg" src="img_squirrels.png" />');
	}
	else if(index==food) {
		qElement.append('<img id="qusImg" src="img_food.png" />');
	}
	else {
		qElement.append('<br/><br/>')
	}
	   
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul id="opt">');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += ' ' + questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<h4>',{id: 'question'});
    
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
    
    score.append('You got ' + numCorrect + ' questions correct out of ' +
                 questions.length + '.');
	
	if(numCorrect >= 4*(questions.length / 5))	{
		score.append('<br/><br/><br/>');
		score.append('<a href="teach1.html"><button type="button" class="btn btn-primary" id="newTopic">Learn Subtraction</button></a> or ');
		score.append('<a href="test2.html"><button type="button" class="btn btn-primary" id="newTest">Take a test on Subtraction</button></a><br/>');		
    }       
    return score;
  }
})();
