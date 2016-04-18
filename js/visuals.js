$(function() {
    // button event handling
    $('.start').click(function() {
        location.href = "game.html";
    });

    $('.back').click(function() {
        location.href = "index.html";
    });

    // show hangman series
    var source = 'img/hangman-0.png';
    var image = $('<img />', { src: source });
    $('.hangman').append(image);

    // generate keyboard
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
                   'h', 'i', 'j', 'k', 'l', 'm', 'n',
                   'o', 'p', 'q', 'r', 's', 't', 'u',
                   'v', 'w', 'x', 'y', 'z'];

    $('.keyboard').append('<ul class=\"keys\"></ul>');

    for (var i = 0; i < letters.length; i++) {
        var singleKey = $('<li></li>').text(letters[i]);
        $('.keys').append(singleKey);
    }
});
