//Preso in input un'immagine ed una stringa, image() crea prima un elemento nel DOM, vi aggiunge il riferimento
//all'immagine passata in input (img.src = data) e poi, con jQuery, imposta l'immagine
function image(data, title) {
    var img = document.createElement("IMG");
    img.src = data;
    $('p#title').html(title + "<p style='text-align:center;'><img src='" + data + "'></p>");
}

//Estrapola album top five
function getTopFive(jsonData) {
    var toReturn = []; //Array da ritornare
    for (var i = 0; i < 5; i++) {
        //Ad ogni iterazione, inserisco un altro array all'interno del tipo [Stringa, Stringa]
        toReturn.push(
            [
                jsonData.topalbums.album[i]['name'],
                jsonData.topalbums.album[i]['image'][2]['#text']
            ]
        );
    }
    return toReturn;
}

//Ritorna le top ten
function getTopTen(jsonData) {
    var toReturn = []; //Array da ritornare
    for (var i = 0; i < 10; i++) {
        //Ad ogni iterazione, inserisco una stringa contenente il nome della traccia
        toReturn.push(
            jsonData.toptracks.track[i]['name']
        );
    }
    return toReturn;
}




// Questo è invece l'oggetto che contiene tutto il necessario per poter cercare brani, artisti, album etc

var lastfm = new LastFM({
    apiKey: '007bb7dc4b7d8eef22dddd17427dc720',
    apiSecret: '341b8690cb2f80336f49ba5bae9b5b69',
    cache: null
});

var artistToLook = localStorage.artist;
var trackToLook = localStorage.thingToLook;

// A questo punto comincio a prendere quello che mi serve

lastfm.track.getInfo(
    {
        track: trackToLook,
        artist: artistToLook
    },
        // Passand come parametro della ricerca il nome della traccia e dell'artista, posso ottenere il risultato desiderato.
    // Se tutto va a buon fine, allora...
    {
        success: function (data) {
            // Costruisco una stringa che contiene un header h1 con il titolo della traccia e il nome dell'artista
            var title = "<h1> " + data.track.name + " -  " + data.track.artist['name'] + "</h1>" + "<br/>";
            image(data.track.album.image[2]['#text'], title); //Chiamo image passando il link all'immagine

            // C'è però un problema: non sempre il JSON "data" conterrà un wiki, cioè una sezione riassuntiva.
            //Con typeof, controllo se quel valore effettivamente esiste
            if (typeof data.track.wiki !== 'undefined') {
                $("p#description").html(data.track.wiki.summary);
            } else {
                $("p#description").html("Sorry, there's no description available: perhaps this is a DVD?");
            }
            localStorage.artist = data.track.artist['name'];
            localStorage.album = data.track.album.title;
            $('#albumSong').append('<li> ' + data.track.album.title + '<br/>' + "<a href='Album.html'><img src='" + data.track.album.image[2]['#text'] + "'></a>" + '</li><br/>');
            iTunesLinkSetter();
            console.log(data.track.artist['name']);
            artistSetter(data.track.artist['name']);
        }
    },
    {
        error: function (code, message) {
            console.log("Oh no!");
        }
    });



function iTunesLinkSetter() {
    //Uso una funzione di jQuery per catturare il JSON che le API di iTunes restituiscono.
    //Il link lo compongo perché, ovviamente, la ricerca varia in base all'artista che si cerca.
    //Il limite è stato impostato a 5
    $.getJSON('https://itunes.apple.com/search?term=' + localStorage.artist + '&limit=5&country=it&entity=musicTrack', function (data) {
        //Se ho successo, aggiungo un link che rimanda ad iTunes per l'acquisto in digitale
        $('#listaWhereToBuy').append("<li><a href='" + data.results[0]['artistViewUrl'] + "'> Acquista qui in formato digitale!</a></li> ");
    });
}
function artistSetter(artist) {
    localStorage.artist = artist;
    $('p#artistDescription').html("<h2> <a href='Artista.html'>" + artist + "</a></h2>");
}
