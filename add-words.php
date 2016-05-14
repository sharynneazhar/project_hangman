<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Hangman</title>

    <!-- font style -->
    <link href='https://fonts.googleapis.com/css?family=Amatic+SC:400,700|Open+Sans+Condensed:300' rel='stylesheet' type='text/css'>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>


    <link rel="stylesheet" href="css/add-words.css">
    <link rel="stylesheet" href="css/hangman.css">
    <script src="js/hangman.js" type="text/javascript"></script>
    <script src="js/wordbank.js" type="text/javascript"></script>

</head>
<body>

    <div class="add-heading text-center">Create Your Own Word Bank</div>
    <div class="container text-center">
        <div class="row">
            <div class="col-md-6">
                <div class="add-subheading">Current Word Bank</div>
                <ul class="list-group word-list scrollbar">
                    <!-- displays all the words currently in word bank file -->
                    <?php
                        $myfile = fopen("wordbank.txt", "r") or die("Unable to open file!");
                        $data = fread($myfile,filesize("wordbank.txt"));
                        $words = explode("\n", $data);

                        foreach($words as $word) {
                          echo '<li class="list-group-item new-word">' . $word . '</li>';
                        }

                        fclose($myfile);
                    ?>
                </ul>
            </div>
            <div class="col-md-6">
                <div class="input-group">
                    <form>
                        <label class="add-subheading" for="word">New Word</label>
                        <input class="add-field" type="text" name="word">
                        <div class="button-area add-btn">
                            <button class="add-word" type="submit">Add</button>
                        </div>
                        <div class="button-area add-btn">
                            <button class="delete-list" type = "button">Delete List</button>
                        </div>
                        <div class="button-area add-btn">
                            <button class="play-custom" type="button">Play Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="stick-figure-add center-block visible-lg-block">
            <div class="thought-bubble">Yeah...Add some <br> hard words in there</div>
            <img src="img/stickman_add-words.png" />
        </div>
    </div>

</body>
</html>
