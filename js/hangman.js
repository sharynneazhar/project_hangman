$(function() {

    // session storage allow the value of this flag to be preserve when routing to next page or on reload
    var ai = sessionStorage.getItem('ai-flag') || false;
    var onCustomPage = sessionStorage.getItem('onCustomPage-flag') || false;

    // general button handling
    $('.play').click(function() {
        location.href = 'pick-topic.html';
    });

    $('.back').click(function() {
        parent.history.back();
		return false;
    });

    $('.done').click(function() {
        sessionStorage.clear(); // clear session storage when route back to home

        // clear the custom word bank file
        if (onCustomPage) {
            $.ajax({
               url: 'clearFile.php',
               success: function (response) {
                 alert(response);
               }
            });
        }

        location.href = 'index.html';
    });

    $('.mode').click(function() {
        ai = !ai;
        console.log("AI: " + !ai);
        sessionStorage.setItem('ai-flag', ai);
        $(this).text(function(i, text) {
            return text === 'Select Mode: AI' ? 'Select Mode: 1P' : 'Select Mode: AI';
        });
    });


    // button handling for topic pick
    var topic = sessionStorage.getItem('topic-flag') || 'states';

    function goToGame() {
        if (!ai) {
            location.href = 'game.html';
        } else {
            location.href = 'roboGame.html';
        }
    }

    $('.states').click(function() {
        console.log('Player chose states');
        sessionStorage.setItem('topic-flag', 'states');
        goToGame();
    });

    $('.president').click(function() {
        console.log('Player chose presidents');
        sessionStorage.setItem('topic-flag', 'presidents');
        goToGame();
    });

    $('.countries').click(function() {
        console.log('Player chose countries');
        sessionStorage.setItem('topic-flag', 'countries');
        goToGame();
    });

    $('.custom-topic').click(function() {
        console.log('Player chose to add custom word bank');
        sessionStorage.setItem('onCustomPage-flag', true);
        location.href = 'add-words.html';
    });

    ///////////////////////////////////////////////////////////////////////////////////////
    /// CUSTOM WORD BANK SECTION by Levi Clark
    ///////////////////////////////////////////////////////////////////////////////////////

    var customWordBank = JSON.parse(sessionStorage.getItem('customWordBank')) || [];

    // allow enter key to work when adding a word
    $('input[name=word]').keyup(function(event){
        if (event.keyCode == 13) {
            $('.add-word').click();
        }
    });

    $('.add-word').click(function(event) {
        event.preventDefault();

        // get the word from input field
        var inputValue = $('input[name=word]').val();
        var data = { word: inputValue };

        // save to the text file
        var jqxhr = $.post('wordbank.php', data, function(dataFromServer) {
            console.log('successfully added to word bank: ' + dataFromServer);
        });

        if (inputValue.length > 0) {
            // add the word to the list and the display screen
            customWordBank.unshift(inputValue);
            $('.word-list').prepend('<li class=\"list-group-item new-word\">' + inputValue + '</li>');
        }

        // clear input field
        $('input[name=word]').val('');
    });

    $('.delete-word').click(function() {
        $('.word-list li:last-child').remove();
    });

    $('.delete-list').click(function() {
        $('.word-list').empty();
    });

    $('.play-custom').click(function() {
        if (customWordBank.length > 1) {
            sessionStorage.setItem('topic-flag', 'customWordBank');
            goToGame();
        } else {
            alert('Please add some words first!');
            location.reload();
        }
    });


    ///////////////////////////////////////////////////////////////////////////////////////
    /// KEYBOARD DISPLAY SECTION by Sharynne Azhar
    ///////////////////////////////////////////////////////////////////////////////////////

    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
                   'h', 'i', 'j', 'k', 'l', 'm', 'n',
                   'o', 'p', 'q', 'r', 's', 't', 'u',
                   'v', 'w', 'x', 'y', 'z'];

    $('.keyboard-container').append('<ul class=\"keyboard\"></ul>'); // create the keyboard

    for (var i = 0; i < letters.length; i++) {
        $('.keyboard').append($('<li class=\"letters\"></li>').text(letters[i])); // create each individual key
    }


    ///////////////////////////////////////////////////////////////////////////////////////
    /// GAME ENGINE SECTION BY ZACK MRYYAN
    ///////////////////////////////////////////////////////////////////////////////////////

    var wordToGuess = '';
    var blankSpaces = [];
    var score = 0;
    var strikes = 0;

    // Set default hangman graphic
    var image = $('<img />', { src: 'img/hangman-0.png' });
    $('.hangman').html(image);

    // display topic chosen on screen
    if (topic !== 'customWordBank') { $('.topic').html(topic); }
    else { $('.topic').html('CUSTOM'); }

    // returns a random word from topic list
    function getRandomWord() {

        // get words from file
        $.get('customWordBank.txt', function(data) {
            customWordBank = data.split(',');
            // need to store in session or else the data is lost on refresh
            customWordBank.pop();
            sessionStorage.setItem('customWordBank', JSON.stringify(customWordBank));
        });

        if (topic === 'states') { return states[Math.floor(Math.random()*(states.length))]; }
        else if (topic === 'countries') { return countries[Math.floor(Math.random()*(countries.length))]; }
        else if (topic === 'presidents') { return presidents[Math.floor(Math.random()*(presidents.length))]; }
        else { return customWordBank[Math.floor(Math.random()*(customWordBank.length))]; } // length-1 because the text file has a space at the end
    }

    // get a random word to guess
    wordToGuess = getRandomWord();

    // hide the letters with a hyphen
    // if there are 2+ words, keep spaces in
    for (var i = 0; i < wordToGuess.length; i++) {
        if (wordToGuess[i] === ' ') {
            blankSpaces[i] = ' ';
        } else {
            blankSpaces[i] = '-';
        }
    }

    $('.word').append(blankSpaces);
    $('.score').html("Score: " + score);
    $('.strikes').html("Lives Left: " + (6 - strikes));

    $('.letters').click(function() {
        // disable the button after click
        $(this).addClass('disabled');

        // push to the letters guessed array and display on screen
        var letterClicked = $(this).html();
        $('.guesses').text($('.guesses').html() + letterClicked);

        // if the letter guessed is in the word then display on the screen
        for (var i = 0; i < wordToGuess.length; i++) {
            if (letterClicked === wordToGuess[i]) {
                blankSpaces[i] = letterClicked;
            }
            $('.word').html(blankSpaces);
        }

        var search = blankSpaces.join('').indexOf(letterClicked);
        if (search === -1) {
            strikes++;
        }

        if (strikes === 1) {
            image = $('<img />', { src: 'img/hangman-1.png' });
            $('.hangman').html(image);
        } else if (strikes === 2) {
            image = $('<img />', { src: 'img/hangman-2.png' });
            $('.hangman').html(image);
        } else if (strikes === 3) {
            image = $('<img />', { src: 'img/hangman-3.png' });
            $('.hangman').html(image);
        } else if (strikes === 4) {
            image = $('<img />', { src: 'img/hangman-4.png' });
            $('.hangman').html(image);
        } else if (strikes === 5) {
            image = $('<img />', { src: 'img/hangman-5.png' });
            $('.hangman').html(image);
        } else if (strikes === 6) {
            image = $('<img />', { src: 'img/hangman-6.png' });
            $('.hangman').html(image);
            alert("Game Over");
            location.href = 'index.html';
        }

        $('.strikes').html("Lives Left: " + (6 - strikes));

        // if player guess the word correctly, increment score and reset game
        if (blankSpaces.join('') === wordToGuess) {
            score++;
            strikes = 0;

            $('.hangman').html($('<img />', { src: 'img/hangman-0.png' }));
            $('.score').html('Score: ' + score);
            $('.guesses').html('Guesses: ');
            $('.letters').removeClass('disabled');

            // clear previous word
            blankSpaces = [];

            // clear robot variables
            rGuessArr = [];
      			roboWord = [];
      			roboFlag = true;

            // get a new word for player to guess
            wordToGuess = getRandomWord();
            for (var i = 0; i < wordToGuess.length; i++) {
                if (wordToGuess[i] === ' ') {
                    blankSpaces[i] = ' ';
                } else {
                    blankSpaces[i] = '-';
                }
            }

            // update the screen
            $('.word').html(blankSpaces);
        }

    });


    ///////////////////////////////////////////////////////////////////////////////////////
    /// ROBOT AI SECTION by Denis Sehic
    ///////////////////////////////////////////////////////////////////////////////////////

    if (sessionStorage.getItem('ai-flag')) {
        var roboFlag = false;
        var rGuessArr = [];
        var roboCorrectIndex = [];
        var roboSpaces = [];
        var roboWord = [];

        // hide the letters with a hyphen
        // if there are 2+ words, keep spaces in
        if (wordToGuess) {
            for (var i = 0; i < wordToGuess.length; i++) {
                if (wordToGuess[i] === ' ') {
                    roboSpaces[i] = ' ';
                } else {
                    roboSpaces[i] = '-';
                }
            }
        }

        function isInArray(value, array) {
            return array.indexOf(value) > -1;
        }

        function randomLetter() {
            return letters[Math.floor(Math.random() * letters.length)];
        }

        $('.roboSpace').append(roboSpaces);

        $('.letters').click(function() {
            //Robo AI
            var roboGuess = randomLetter(); //generate random letter
            while (isInArray(roboGuess, rGuessArr)) { //checks if letter has already been guessed
                roboGuess = randomLetter(); //if so find another letter
            }
            rGuessArr.push(roboGuess); //add letter to an array

            //If the random letter is in the word then
            //Display an asterisks on the screen
            var found = false;
            for (var i = 0; i < wordToGuess.length; i++) {
                if (roboGuess === wordToGuess[i]) {
                    roboCorrectIndex.push(i);
                    roboSpaces[i] = "*";
                    roboWord[i] = roboGuess;
                    found = true;
                }
                $('.roboSpace').html(roboSpaces);
            }

            //In order to level the playing field more
            //the robot gets another attempt
            if(!found){
                while (isInArray(roboGuess, rGuessArr)) {
                    roboGuess = randomLetter();
                }
                rGuessArr.push(roboGuess);

                for (var i = 0; i < wordToGuess.length; i++) {
                    if (roboGuess === wordToGuess[i]) {
                        roboCorrectIndex.push(i);
                        roboSpaces[i] = "*";
                        roboWord[i] = roboGuess;
                        found = true;
                    }
                    $('.roboSpace').html(roboSpaces);
                }
            }

            //If correct guesses is equal to the word length
            //then the robot won
            if (roboWord.join('') === wordToGuess){
                $('.roboGuesses').text("The Robot won");
                alert("The Robot beat you :(");
                location.href = 'index.html';
            } else if (roboFlag) {
                roboSpaces = [];
                for (var i = 0; i < wordToGuess.length; i++) {
                    if (wordToGuess[i] === ' ') {
                        roboSpaces[i] = ' ';
                    } else {
                        roboSpaces[i] = '-';
                    }
                }
                roboFlag = false;
                $('.roboSpace').html(roboSpaces);
            } else {
                $('.roboGuesses').text("Robot's Guesses:");
            }
        });
    }

});
