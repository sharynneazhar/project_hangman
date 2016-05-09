$(function() {

    // session storage allow the value of this flag to be preserve when routing to next page or on reload
    var ai = sessionStorage.getItem('ai-flag') || false;

    // general button handling
    $('.play').click(function() {
        location.href = 'pick-topic.html';
    });

    $('.back').click(function() {
        sessionStorage.clear(); // clear session storage when route back to home
        location.href = 'index.html';
    });

    $('.mode').click(function() {
        ai = !ai;
        sessionStorage.setItem('ai-flag', ai);

        $(this).text(function(i, text) {
            return text === 'Select Mode: AI' ? 'Select Mode: 1P' : 'Select Mode: AI';
        });
    });


    // button handling for topic pick
    $('.states').click(function() {
        // TODO flag engine to grab words from the states word bank
        if (!ai) {
			location.href = 'game.html';
		} else {
			location.href = 'roboGame.html';
		}
    });

    $('.president').click(function() {
        // TODO flag engine to grab words from presidents wordbank
        if (!ai) {
			location.href = 'game.html';
		} else {
			location.href = 'roboGame.html';
		}
    });

    $('.countries').click(function() {
        // TODO flag engine to grab words from countries wordbank
        if (!ai) {
			location.href = 'game.html';
		} else {
			location.href = 'roboGame.html';
		}
    });

    $('.custom-topic').click(function() {
        // TODO flag engine to grab words from the custom wordbank
        location.href = 'add-words.html';
    });


    ///////////////////////////////////////////////////////////////////////////////////////
    /// CUSTOM WORD BANK SECTION
    ///////////////////////////////////////////////////////////////////////////////////////

    var customWordBank = ['cat'];

    // allow enter key to work when adding a word
    $('input[name=word]').keyup(function(event){
        if (event.keyCode == 13) {
            $('.add-word').click();
        }
    });

    $('.add-word').click(function(event) {
        event.preventDefault();

        var inputValue = $('input[name=word]').val(); // get the word from input field
        if (inputValue.length > 0) {
            customWordBank.push(inputValue); // push the word into the array
            $('.word-list').prepend('<li class=\"list-group-item new-word\">' + inputValue + '</li>'); // add the word to the display screen
        }
        $('input[name=word]').val(''); // clear input field
    });

    $('.delete-word').click(function() {
		$('.word-list li:last-child').remove();

	});

    $('.delete-list').click(function() {
        $('.word-list').empty();
    });


    // TODO show the word to guess on the screen
    var word = customWordBank[0];
    for (var i = 0; i < word.length; i++) {
        $('.word').append('-');
    }


    ///////////////////////////////////////////////////////////////////////////////////////
    /// HANGMAN GRAPHICS SECTION
    ///////////////////////////////////////////////////////////////////////////////////////

    // TODO change hangman graphic based on number of misses
    var source = 'img/hangman-0.png';
    var image = $('<img />', { src: source });
    $('.hangman').append(image);


    ///////////////////////////////////////////////////////////////////////////////////////
    /// KEYBOARD DISPLAY SECTION
    ///////////////////////////////////////////////////////////////////////////////////////

    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
                   'h', 'i', 'j', 'k', 'l', 'm', 'n',
                   'o', 'p', 'q', 'r', 's', 't', 'u',
                   'v', 'w', 'x', 'y', 'z'];

    $('.keyboard-container').append('<ul class=\"keyboard\"></ul>'); // create the keyboard

    for (var i = 0; i < letters.length; i++) {
        $('.keyboard').append($('<li class=\"letters\"></li>').text(letters[i])); // create each individual key
    }

    $('.letters').click(function() {
        $(this).css('background-color', '#607D8B');
        $('.guesses').text($('.guesses').html() + $(this).html());
    });


    ///////////////////////////////////////////////////////////////////////////////////////
    /// ROBOT AI SECTION
    ///////////////////////////////////////////////////////////////////////////////////////

	var rGuessArr = [];
	var totalRoboMisses = 0;

	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	}

	function randomLetter() {
		return letters[Math.floor(Math.random() * letters.length)];
	}

	$('.letters').click(function() {
		//Robo AI
		var roboGuess = randomLetter(); //generate random letter
		while(isInArray(roboGuess, rGuessArr)) { //checks if letter has already been guessed
			roboGuess = randomLetter(); //if so find another letter
		}

		rGuessArr.push(roboGuess); //add letter to an array
		//If guess deems that the guessed letter isn't in the word,
		//add to missed guesses
		if(totalRoboMisses < 6) { //if maximum alloted misses not reached
			$('.roboGuesses').text($('.roboGuesses').html() + roboGuess);
			//if(guessChecker(roboGuess, word) == true)
			//else
			totalRoboMisses++;
		} else {
			$('.roboGuesses').text("The Robot Lost");
		}
    });

});
