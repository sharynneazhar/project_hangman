<?php

    //create a file handler by opening the file
    $myTextFileHandler = @fopen("customWordBank.txt","r+");

    //truncate the file to zero
    //or you could have used the write method and written nothing to it
    @ftruncate($myTextFileHandler, 0);

    echo "Cleared File!";

?>
