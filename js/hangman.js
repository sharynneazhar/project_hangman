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
    var topic = sessionStorage.getItem('topic-flag') || 'states';

    $('.states').click(function() {
        sessionStorage.setItem('topic-flag', 'states');
        if (!ai) {
            location.href = 'game.html';
        } else {
            location.href = 'roboGame.html';
        }
    });

    $('.president').click(function() {
        sessionStorage.setItem('topic-flag', 'presidents');
        if (!ai) {
            location.href = 'game.html';
        } else {
            location.href = 'roboGame.html';
        }
    });

    $('.countries').click(function() {
        sessionStorage.setItem('topic-flag', 'countries');
        if (!ai) {
            location.href = 'game.html';
        } else {
            location.href = 'roboGame.html';
        }
    });

    $('.custom-topic').click(function() {
        location.href = 'add-words.html';
    });

    $('.play-custom').click(function() {
        sessionStorage.setItem('topic-flag', 'customWordBank');
        if (!ai) {
            location.href = 'game.html';
        } else {
            location.href = 'roboGame.html';
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////
    /// CUSTOM WORD BANK SECTION by Levi Clark
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
    var lettersGuessed = [];
    var letterInWord = '';
    var letterLocation = '';
    var wordBlank = [];
    var score = 0;
    var strikes = 0;

    // Set default hangman graphic
    var image = $('<img />', { src: 'img/hangman-0.png' });
    $('.hangman').html(image);

    if (topic !== 'customWordBank') { $('.topic').html(topic); }
    else { $('.topic').html('CUSTOM'); }

    $('.letters').click(function() {
        // disabled the button
        $(this).addClass('disabled');

        // push to the letters guessed array and display on screen
        var letterClicked = $(this).html();
        lettersGuessed.push(letterClicked);
        $('.guesses').text($('.guesses').html() + $(this).html());

        // if the letter guessed is in the word then display on the screen
        for (var i = 0; i < wordToGuess.length; i++) {
            if (letterClicked === wordToGuess[i]) {
                letterInWord = letterClicked;
                letterLocation = i;
                wordBlank[i] = letterClicked;
                $('.word').html(wordBlank);
            }
        }

        var search = wordBlank.join('').indexOf(letterClicked);
        if (search === -1) {
            strikes++;
        }

        // if player guess the word correctly, increment score and reset game
        if (wordBlank.join('') === wordToGuess) {
            score++;
            $('.hangman').html(image);
            $('.score').html('Score: ' + score);
            $('.guesses').html('Guesses: ');
            $('.letters').css('background-color', '#FF5722');

            for (var i = 0; i < wordToGuess.length; i++) {
                wordBlank[i] = ' ';
            }

            // get a new word for player to guess
            wordToGuess = getRandomWord();
            for (var i = 0; i < wordToGuess.length; i++) {
                if (wordToGuess[i] === ' ') {
                    wordBlank[i] = ' ';
                } else {
                    wordBlank[i] = '-';
                }
            }

            $('.word').html(wordBlank);
            strikes = 0;
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
    });

    function getRandomWord() {
        if (topic === 'states') { return states[Math.floor(Math.random()*(states.length))]; }
        else if (topic === 'countries') { return countries[Math.floor(Math.random()*(countries.length))]; }
        else if (topic === 'presidents') { return presidents[Math.floor(Math.random()*(presidents.length))]; }
        else { return customWordBank[Math.floor(Math.random()*(customWordBank.length))];; }
    }

    wordToGuess = getRandomWord();
    for (var i = 0; i < wordToGuess.length; i++) {
        if (wordToGuess[i] === ' ') {
            wordBlank[i] = ' ';
        } else {
            wordBlank[i] = '-';
        }
    }

    $('.word').append(wordBlank);
    $('.score').html("Score: " + score);
    $('.strikes').html("Lives Left: " + (6 - strikes));

    ///////////////////////////////////////////////////////////////////////////////////////
    /// ROBOT AI SECTION by Denis Sehic
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
