$(function() {
    ////////////////////////////
    // button event handling //
    ///////////////////////////
    $('.play').click(function() {
        location.href = 'pick-topic.html';
    });

    $('.back').click(function() {
        location.href = 'index.html';
    });

    $('.mode').click(function() {
        $(this).text(function(i, text) {
            return text === 'Select Mode: P2P' ? 'Select Mode: AI' : 'Select Mode: P2P';
        })
    });

    //////////////////////////
    // ask for which topic //
    /////////////////////////
    $('.states').click(function() {
        // TODO flag engine to grab words from the states word bank
        location.href = 'game.html';
    });

    $('.president').click(function() {
        // TODO flag engine to grab words from presidents wordbank
        location.href = 'game.html';
    });

    $('.countries').click(function() {
        // TODO flag engine to grab words from countries wordbank
        location.href = 'game.html';
    });

    $('.custom-topic').click(function() {
        // TODO flag engine to grab words from the custom wordbank
        location.href = 'add-words.html';
    });

    ////////////////////////
    // adding new topics //
    ///////////////////////

    $('input[name=word]').keyup(function(event){
        if (event.keyCode == 13) {
            $('.add-word').click();
        }
    });

    $('.add-word').click(function(event) {
        event.preventDefault();
        var inputValue = $('input[name=word]').val();
        if (inputValue.length > 0) {
            wordList.push(inputValue);
            $('.word-list').prepend('<li class=\"list-group-item new-word\">' + inputValue + '</li>');
        }
        $('input[name=word]').val('');
    });


    /////////////////////////////
    // show hangman graphics ///
    ////////////////////////////
    var source = 'img/hangman-0.png';
    var image = $('<img />', { src: source });
    $('.hangman').append(image);


    /////////////////////////
    // generate keyboard ///
    ////////////////////////
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
                   'h', 'i', 'j', 'k', 'l', 'm', 'n',
                   'o', 'p', 'q', 'r', 's', 't', 'u',
                   'v', 'w', 'x', 'y', 'z'];

    $('.keyboard').append('<ul class=\"keys\"></ul>');

    for (var i = 0; i < letters.length; i++) {
        var singleKey = $('<li class=\"letters\"></li>').text(letters[i]);
        $('.keys').append(singleKey);
    }

    $('.letters').click(function() {
        $(this).css('background-color', '#607D8B');
        $('.guesses').text($('.guesses').html() + $(this).html());
    });

    //////////////////////////
    // show word to guess ///
    /////////////////////////
    var wordList = ['cat'];
    var word = wordList[0];

    for (var i = 0; i < word.length; i++) {
        $('.word').append('-');
    }

});
