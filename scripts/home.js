var chooser = "";
var id = "";


//Seconda istruzione in jQuery.
//In sostanza, scegliendo il tag <HTML>, proibisco (cioè 'bind') il keypress di qualcosa. Il qualcosa è il keyCode 13, ovvero "Enter"
$('html').bind('keypress', function (e) {
    if (e.keyCode == 13) { // Se ho premuto Enter...
        return false; // ... ignoralo
    }
});

//Al click in qualsiasi posizione del documento, su un qualsiasi oggetto che abbia come classe "testingClass", avvia la seguente funzione anonima
$(document).on("click", " .testingClass", function () {
    debugger;
    chooser = $("#testRadio input[type='radio']:checked").val(); //Ottiene il valore del radio button spuntato
    //Se la scelta fatta è uguale ad Artista (ovvero, l'unico che vuole un solo valore salvato nel local storage)...
    if (chooser === "Artista") {
        id = $(this).attr('id'); //Estrapolo dall'oggetto con classe "testingClass" appena clickato il suo id...
        localStorage.artist = id; //...e lo metto nel localstorage
    } else {
        id = $(this).attr('id');  //Estrapolo dall'oggetto con classe "testingClass" appena clickato il suo id...
        var artist = id.split('-')[0];  //Stavolta è però un id composto, del tipo artista-CosaDaCercare. Qui prendo il valore di destra dell'id...
        var toSearch = id.split('-')[1]; //... E qui quello di sinistra
        localStorage.artist = artist; // E salvo tutto nel local storage
        localStorage.thingToLook = toSearch;
    }
});


$('button#premilo').click(function() {
    debugger;
    var argToSearch = $('#searchArtists').val(); //Si capisce dal nome della variabile. Prende fonte dalla search bar
    //In base alla scelta, lo switch reindirizza per proporre la giusta cosa
    chooser = $("#testRadio input[type='radio']:checked").val();
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
    $('form').attr('action', chooser + ".html");    
});


//Ogni qualvolta viene premuto il bottone "Wrote Wrong", questo jQuery pulisce il contenuto del div id2
$('input#rese').click(function () {
    $('div#id2').empty();
    $('div#id2').html('<p id="title" style="align-content: center;"></p>'); //e ci rimette l'HTML.
});

//Ogni qualvolta viene premuto un radio button, questo jQuery pulisce il contenuto del div id2
$('input[name=ric]').click(function () {
    $('div#id2').empty();
    $('div#id2').html('<p id="title" style="align-content: center;"></p>');
})

//L'oggetto che mi permette di effettuare le chiamate a Last.FM
var lastfm = new LastFM({
    apiKey: '007bb7dc4b7d8eef22dddd17427dc720',
    apiSecret: '341b8690cb2f80336f49ba5bae9b5b69',
    cache: null
});

//Funzione per la proposta dell'artista
function proposeArtist(artistOfInterest) {
    lastfm.artist.search(
        { artist: artistOfInterest }, //Passo l'artista che mi interessa
        {
            success: function (data) { //In caso di successo, in "data" sarà contenuto un JSON di risposta
                console.log(data);
                $artists = data.results.artistmatches.artist; //Ne prendo quindi l'array contenente i risultati degli artisti
                $('div#id2').show(); // mostro il div id2
                for (var i = 0; i < 10; i++) { // e carico i primi dieci risultati, generando il title, estrapolando l'immagine e definendo la classe + l'id (in questo caso, del tipo id="nomeArtista"), proporzionandolo adeguatamente allo schermo
                    if (i == 4) { //Se sto inserendo il quinto elemento, aggiungo un break line per mandare gli altri cinque elementi a capo
                        $('div#id2').append("<a href='Artista.html' title='" + $artists[i].name + "'><img src='" + $artists[4]['image'][3]['#text'] + "' class='testingClass' id='" + $artists[4]['name'] + "' style=' width: 15%; margin-bottom: 0.5em;'/></a><br/>");
                    } else { // Else continuo a procedere su una riga
                        $('div#id2').append("<a href='Artista.html' title='" + $artists[i].name + "'><img src='" + $artists[i]['image'][3]['#text'] + "' class='testingClass' id='" + $artists[i]['name'] + "' style=' width: 15%; margin-bottom: 0.5em;'/></a>");
                    }
                }
            }
        },
        {
            error: function (code, message) { //In caso di fallimento, si stampa questo
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
                console.log(data);
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
        { album: albumOfInterest },  // Passando come parametro 'albumOfInterest', gli sto dicendo di prendere quello che l'utente ha scritto
                // Se tutto va a buon fine, allora...
        {
            success: function (data) {
                console.log(data);
                $("div#id2").show();
                $albums = data.results.albummatches.album;
                for (var i = 0; i < 10; i++) {

                    if (i == 4) {
                        $('div#id2').append("<a href='Album.html' title='" + $albums[i].name + "'><img src='" + $albums[4]['image'][3]['#text'] + "' class='testingClass' id='" + $albums[4]['artist'] + "-" + $albums[4]['name'] + "' style=' width: 15%; margin-bottom: 0.5em;'></a><br>");
                    }
                    else {   
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
// Non ho commentato proposeTrack e proposeAlbum perché la loro logica è uguale a proposeArtist
