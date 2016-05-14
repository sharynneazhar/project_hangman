$(function() {

    ///////////////////////////////////////////////////////////////////////////////////////
    /// GENERAL BUTTON HANDLING FOR FRONTEND BY SHARYNNE AZHAR
    ///////////////////////////////////////////////////////////////////////////////////////

    // sessionStorage to persist data through reloads
    var topic = sessionStorage.getItem('topic-flag') || '';
    var ai = sessionStorage.getItem('ai-flag') || false;
    var aiDiff = sessionStorage.getItem('dif-flag') || 1;

    function goToGame() {
        location.href = (!ai) ? 'game.html' : 'roboGame.html';
    }

    function clearWordBank() {
        customWordBank = [];
    }

    function gameOver() {
        $('.hold').addClass('over').empty();
        $('.over').html("Game Over");
        setTimeout(function() {
            clearWordBank();
            sessionStorage.clear();
            location.href = 'index.html';
        }, 3000);
    }

    $('.done').click(function() {
        clearWordBank();
        sessionStorage.clear();
        location.href = 'index.html';
    });

    // display ai button text based on the value of the ai flag
    var aiText = (!ai) ? 'Mode: 1P' : 'Mode: vs. AI';
    $('.ai-mode').html(aiText);
    $('.ai-mode').click(function() {
        ai = !ai;
        sessionStorage.setItem('ai-flag', ai);
        $(this).text(function(i, text) {
            return text === 'Mode: vs. AI' ? 'Mode: 1P' : 'Mode: vs. AI';
        });
    });

    var aiDiffText = (aiDiff === 1) ? 'Bot Level: Easy' : 'Bot Level: Hard';
    $('.ai-diff').html(aiDiffText);
    $('.ai-diff').click(function() {
        aiDiff++;
        if (aiDiff > 2) {
            aiDiff = 1;
        }
        sessionStorage.setItem('dif-flag', aiDiff);
        $(this).text(function(i, text) {
            return text === 'Bot Level: Easy' ? 'Bot Level: Hard' :
                'Bot Level: Easy';
        });
    });

    // button handling for topic pick
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
        location.href = 'add-words.php';
    });

    ///////////////////////////////////////////////////////////////////////////////////////
    /// CUSTOM WORD BANK SECTION by Levi Clark
    ///////////////////////////////////////////////////////////////////////////////////////

    var customWordBank = JSON.parse(sessionStorage.getItem('customWordBank')) || [];

    // get the word from the text file into the array
    $.get('wordbank.txt', function(data) {
        customWordBank = data.split('\n');
        customWordBank.pop(); // removing whitespace item at the end;
        // need to store in session or else the data is lost on refresh
        sessionStorage.setItem('customWordBank', JSON.stringify(customWordBank));
    });

    $('.add-field').focus();

    $('.add-word').click(function(event) {
        event.preventDefault();

        // get the word from input field
        var inputValue = $('input[name=word]').val();
        var data = {
            word: inputValue.toLowerCase()
        };

        // save to the text file
        $.post('wordbank.php', data, function(response) {
            console.log('successfully added to word bank: ' + response);
        });

        if (inputValue.length > 0) {
            // add the word to the word bank and the display screen
            customWordBank.push(inputValue);
            $('.word-list').prepend('<li class=\"list-group-item new-word\">' + inputValue + '</li>');
        }

        // clear input field
        $('input[name=word]').val('');
    });

    $('.delete-list').click(function() {
        clearWordBank();
        $('.word-list').empty();
    });

    $('.play-custom').click(function() {
        console.log(customWordBank.length);
        if (customWordBank.length > 0) {
            sessionStorage.setItem('topic-flag', 'customWordBank');
            goToGame();
        } else {
            alert('Word bank empty: Please add some words first!');
        }
    });


    ///////////////////////////////////////////////////////////////////////////////////////
    /// KEYBOARD DISPLAY SECTION by Sharynne Azhar
    ///////////////////////////////////////////////////////////////////////////////////////

    var letters = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u',
        'v', 'w', 'x', 'y', 'z'
    ];

    // create the keyboard area
    $('.keyboard-container').append('<ul class=\"keyboard\"></ul>');

    for (var i = 0; i < letters.length; i++) {
        // create each individual key
        $('.keyboard').append($('<li class=\"letters\"></li>').text(letters[i]));
    }


    ///////////////////////////////////////////////////////////////////////////////////////
    /// GAME ENGINE SECTION BY ZACK MRYYAN
    ///////////////////////////////////////////////////////////////////////////////////////

    var wordToGuess = '';
    var blankSpaces = [];
    var score = 0;
    var strikes = 0;

    // Set default hangman graphic
    var image = $('<img />', {
        src: 'img/hangman-0.png'
    });

    $('.hangman').html(image);

    // display topic chosen on screen
    if (topic !== 'customWordBank') {
        $('.topic').html(topic);
    } else {
        $('.topic').html('CUSTOM');
    }

    // returns a random word from topic list
    function getRandomWord() {
        if (topic === 'states') {
            return states[Math.floor(Math.random() * (states.length))];
        } else if (topic === 'countries') {
            return countries[Math.floor(Math.random() * (countries.length))];
        } else if (topic === 'presidents') {
            return presidents[Math.floor(Math.random() * (presidents.length))];
        } else {
            // length-1 because the text file has a space at the end
            return customWordBank[Math.floor(Math.random() * (customWordBank.length))];
        }
    }

    // get a random word to guess
    wordToGuess = getRandomWord();

    // hide the letters with a hyphen
    // if there are 2+ words, keep spaces in
    if (wordToGuess) {
        for (var i = 0; i < wordToGuess.length; i++) {
            if (wordToGuess[i] === ' ') {
                blankSpaces[i] = ' ';
            } else {
                blankSpaces[i] = '-';
            }
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
            image = $('<img />', {
                src: 'img/hangman-1.png'
            });
            $('.hangman').html(image);
        } else if (strikes === 2) {
            image = $('<img />', {
                src: 'img/hangman-2.png'
            });
            $('.hangman').html(image);
        } else if (strikes === 3) {
            image = $('<img />', {
                src: 'img/hangman-3.png'
            });
            $('.hangman').html(image);
        } else if (strikes === 4) {
            image = $('<img />', {
                src: 'img/hangman-4.png'
            });
            $('.hangman').html(image);
        } else if (strikes === 5) {
            image = $('<img />', {
                src: 'img/hangman-5.png'
            });
            $('.hangman').html(image);
        } else if (strikes === 6) {
            gameOver();
        }

        $('.strikes').html("Lives Left: " + (6 - strikes));

        // if player guess the word correctly, increment score and reset game
        if (blankSpaces.join('') === wordToGuess) {
            score++;
            strikes = 0;

            $('.hangman').html($('<img />', {
                src: 'img/hangman-0.png'
            }));

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

    if (ai) {
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

        var isInArray = function(value, array) {
            return array.indexOf(value) > -1;
        }

        var randomLetter = function() {
            return letters[Math.floor(Math.random() * letters.length)];
        }

        $('.roboSpace').html(roboSpaces);

        $('.letters').click(function() {
            // disable the button after click
            $(this).addClass('disabled');

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
            var newDif = sessionStorage.getItem('dif-flag')
            if (!found) {
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

            //if Hard difficulty is selected, do it again
            if (newDif === 2) {
                if (!found) {
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
            }

            // If correct guesses is equal to the word length
            // then the robot won
            if (roboWord.join('') === wordToGuess) {
                alert("The Robot beat you :(");
                gameOver();
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
                $('.letters').removeClass('disabled');
                $('.roboSpace').html(roboSpaces);
            } else {
                $('.roboGuesses').text("Robot's Guesses: Shhh");
            }
        });
    }

});
