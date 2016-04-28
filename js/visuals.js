$(function() {
    ////////////////////////////
    // button event handling //
    ///////////////////////////
    $('.start').click(function() {
        location.href = "game.html";
    });

    $('.back').click(function() {
        location.href = "index.html";
    });

	var audio = $('#clickSound')[0];
	var audio2 = $('#clickSound2')[0];
	$('button').mousedown(function() { audio2.play(); });
	$('button').mouseup(function() { audio.play(); });

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
        $(this).css('background-color', "#607D8B");
    });

    $('.letters').mousedown(function() { audio2.play(); });
	$('.letters').mouseup(function() { audio.play(); });

});
