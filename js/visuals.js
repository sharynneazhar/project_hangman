$(function() {
    ////////////////////////////
    // button event handling //
    ///////////////////////////

    $('.start').click(function() {
        location.href = 'game.html';
    });

    $('.back').click(function() {
        location.href = 'index.html';
    });

    $('.add').click(function() {
        location.href = 'add-words.html';
    });

    $('.mode').click(function() {
        $(this).text(function(i, text) {
            return text === 'Select Mode: P2P' ? 'Select Mode: AI' : 'Select Mode: P2P';
        })
    });

    ///////////////////////////
    // show hangman series ///
    //////////////////////////
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

    ////////////////////
    // adding words ///
    ///////////////////
    $('input[name=add]').keyup(function(event){
        if (event.keyCode == 13) {
            $('.add-word').click();
        }
    });

    $('.add-word').click(function(event) {
        event.preventDefault();
        var inputValue = $('input[name=add]').val();
        if (inputValue.length > 0) {
            wordList.push(inputValue);
            $('.word-list').prepend('<li class=\"list-group-item new-word\">' + inputValue + '</li>');
        }
        $('input[name=add]').val('');
    });

});
