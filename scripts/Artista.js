//Preso in input un'immagine ed una stringa, image() crea prima un elemento nel DOM, vi aggiunge il riferimento
//all'immagine passata in input (img.src = data) e poi, con jQuery, imposta l'immagine
function image(data) {
    var img = document.createElement("IMG");
    img.src = data;
    $('#title').before("<p style='text-align:center;'><img src='" + data + "'></p>");
}

//Estrapola album top five
function getTopFive(jsonData) {
    var toReturn = []; //Array da ritornare
    for (var i = 0; i < 5; i++) {
        toReturn.push(
            [
                //Ad ogni iterazione, inserisco un altro array all'interno del tipo [Stringa, Stringa]
                jsonData.topalbums.album[i]['name'],
                jsonData.topalbums.album[i]['image'][2]['#text']
            ]
        );
    }
    return toReturn;
}

function getTopTen(jsonData) {
    var toReturn = []; //Array da ritornare
    for (var i = 0; i < 10; i++) {
        toReturn.push(
            //Ad ogni iterazione, inserisco una stringa contenente il nome della traccia
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

// Il nome della variabile dice tutto. Il contenuto pure 
var artistToLook = localStorage.artist;

// A questo punto comincio a prendere quello che mi serve
lastfm.artist.getInfo(
    { artist: artistToLook },  // Passando come parametro l'artista da cercare, avvio la ricerca
    // Se tutto va a buon fine, allora...
    {
        success: function (data) {

            $("p#title").html("<h1> " + data.artist.name + "</h1>" + "<br/>"); //Sostituisco l'html di questo paragrafo con il nome dell'artista
            $("p#description").html(data.artist.bio.summary); // Come sopra ma per la biografia
            image(data.artist.image[3]['#text']);
        },
        // In caso di errore, si printa il messaggio di errore
        error: function (code, message) {
            console.log("Sono andato in errore");
            $("p#description").html(message + "<br/> Maybe you typed it in a wrong way?");
            console.log(message);
        }
    });

//Cerca i dieci album migliori, che noi però scremiamo a top five...
lastfm.artist.getTopAlbums(
    { artist: artistToLook },
    {
        success: function (data) {

            var topFive = getTopFive(data); //... con questa funzione
            for (var i = 0; i < 5; i++) { //ed aggiungo tutto con jQuery
                $('#listaTopAlbum').append('<li> ' + topFive[i][0] + '<br/>' + "<img src='" + topFive[i][1] + "'>" + '</li><br/>');
            }

        },

        error: function (code, message) {

        }
    });

//Cerca le dieci migliori tracce...
lastfm.artist.getTopTracks(
    { artist: artistToLook },
    {
        success: function (data) {
            var topTen = getTopTen(data); //... con questa funzione
            for (var i = 0; i < 10; i++) { // ed aggiungo tutto con jQuery
                $('#listaTopTracks').append('<li> ' + topTen[i] + '<br/></li>');
            }

        },

        error: function (code, message) {

        }
    });

//Uso una funzione di jQuery per catturare il JSON che le API di iTunes restituiscono.
//Il link lo compongo perché, ovviamente, la ricerca varia in base all'artista che si cerca.
//Il limite è stato impostato a 5
$.getJSON('https://itunes.apple.com/search?term=muse&limit=5&country=it&entity=musicTrack', function (data)  {
    //Se ho successo, aggiungo un link che rimanda ad iTunes per l'acquisto in digitale
    $('#listaWhereToBuy').append("<li><a href='" + data.results[0]['artistViewUrl'] + "'> Acquista qui in formato digitale!</a></li> ");
});

