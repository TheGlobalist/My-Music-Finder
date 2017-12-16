$('html').bind('keypress', function (e) {
    if (e.keyCode == 13) {
        return false;
    }
});

$(document).on("click", " .testingClass", function () {
    if ($("#testRadio input[type='radio']:checked").val() === "Artista") {
        var tmp = $(this).attr('id');
        localStorage.artist = tmp;
    } else {
        var tmp = $(this).attr('id');
        var artist = tmp.split('-')[0];
        var toSearch = tmp.split('-')[1];
        localStorage.artist = artist;
        localStorage.thingToLook = toSearch;
    }
});


$('#testRadio').click(function () {

    if ($('#searchArtists').val() === "") {
        alert("Inserisci un valore nella barra di ricerca");
        return false;
    }

    $('button#premilo').click(function () {
        if ($("#testRadio input[type='radio']:checked").val() === "") {
            alert("Seleziona cosa cercare");
            return false;
        }
    });




    var chooser = $("#testRadio input[type='radio']:checked").val();
    var argToSearch = $('#searchArtists').val();
    switch (chooser) {
        case "Album":
            proposeAlbum(argToSearch);
            break;
        case "Brano":
            proposeTrack(argToSearch);
            break;
        default:
            proposeArtist(argToSearch);
    }

    $('form').attr('action', $("#testRadio input[type='radio']:checked").val() + ".html")

})


$('input#rese').click(function () {
    $('div#id2').empty();
    $('div#id2').html('<p id="title" style="align-content: center;"></p>');
});

$('input[name=ric]').click(function () {
    $('div#id2').empty();
    $('div#id2').html('<p id="title" style="align-content: center;"></p>');
})

var lastfm = new LastFM({
    apiKey: '007bb7dc4b7d8eef22dddd17427dc720',
    apiSecret: '341b8690cb2f80336f49ba5bae9b5b69',
    cache: null
});

function proposeArtist(artistOfInterest) {
    lastfm.artist.search(
        { artist: artistOfInterest },
        {
            success: function (data) {
                $artists = data.results.artistmatches.artist;
                $('div#id2').show();
                for (var i = 0; i < 10; i++) {
                    if (i == 4) {
                        $('div#id2').append("<a href='Artista.html' title='" + $artists[i].name + "'><img src='" + $artists[4]['image'][3]['#text'] + "' class='testingClass' id='" + $artists[4]['name'] + "' style=' width: 10%; margin-bottom: 0.5em;'/></a><br/>");
                    } else {
                        $('div#id2').append("<a href='Artista.html' title='" + $artists[i].name + "'><img src='" + $artists[i]['image'][3]['#text'] + "' class='testingClass' id='" + $artists[i]['name'] + "' style=' width: 10%; margin-bottom: 0.5em;'/></a>");
                    }
                }
            }
        },
        {
            error: function (code, message) {
                console.log("Oh no!");
            }
        }
    );
}



function proposeTrack(trackOfInterest) {
    lastfm.track.search(
        { track: trackOfInterest },
        {
            success: function (data) {
                $('div#id2').show();
                $tracks = data.results.trackmatches.track;
                for (var i = 0; i < 10; i++) {
                    if (i == 4) {
                        $('div#id2').append("<a href='Brano.html' title ='" + $tracks[i].name + "'><img src='" + $tracks[4]['image'][3]['#text'] + "' class='testingClass' id='" + $tracks[4]['artist'] + "-" + $tracks[4]['name'] + "' style=' width: 15%; margin-bottom: 0.5em;'></a><br>");
                    } else {
                        $('div#id2').append("<a href='Brano.html' title='" + $tracks[i].name + "'><img src='" + $tracks[i]['image'][3]['#text'] + "' class='testingClass' id='" + $tracks[i]['artist'] + "-" + $tracks[i]['name'] + "' style=' width: 15%; margin-bottom: 0.5em;'></a>");
                    }
                }
            }
        },
        {
            error: function (code, message) {
                console.log("Oh no!");
            }
        });
}


function proposeAlbum(albumOfInterest) {
    lastfm.album.search(
        { album: albumOfInterest },  // Passando come parametro 'test', gli sto dicendo di prendere quello che 
        //l'input chiamato "test" (riga 13 di home.html) ha "catturato dall'utente".
        // Se tutto va a buon fine, allora...
        {
            success: function (data) {
                $("div#id2").show();
                $albums = data.results.albummatches.album;
                for (var i = 0; i < 10; i++) {

                    if (i == 4) {
                        $('div#id2').append("<a href='Album.html' title='" + $albums[i].name + "'><img src='" + $albums[4]['image'][3]['#text'] + "' class='testingClass' id='" + $albums[4]['artist'] + "-" + $albums[4]['name'] + "' style=' width: 15%; margin-bottom: 0.5em;'></a><br>");
                    }
                    else {   //<p id='" + $albums[i]['artist'] + "-" + $albums[i]['name'] + ">
                        $('div#id2').append("<a href='Album.html' title='" + $albums[i].name + "'><img src='" + $albums[i]['image'][3]['#text'] + "' class='testingClass' id='" + $albums[i]['artist'] + "-" + $albums[i]['name'] + "' style=' width: 15%; margin-bottom: 0.5em;'></a>");
                    }
                }
            },
            // In caso di errore, si printa il messaggio di errore
            error: function (code, message) {
                console.log("Sono andato in errore");
                $("p#description").html(message + "<br/> Maybe you typed it in a wrong way?");
                console.log(message);
                //Magari far tornare indietro alla home in caso di errore ed incollare il messaggio sotto la search
            }
        });
}       
