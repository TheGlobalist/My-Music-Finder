
//Preso in input un'immagine ed una stringa, image() crea prima un elemento nel DOM, vi aggiunge il riferimento
//all'immagine passata in input (img.src = data) e poi, con jQuery, imposta l'immagine
function image(data, title) {
    var img = document.createElement("IMG");
    img.src = data;
    $('p#title').html(title + "<p style='text-align:center;'><img src='" + data + "'></p>");
}


// Questo è invece l'oggetto che contiene tutto il necessario per poter cercare brani, artisti, album etc

var lastfm = new LastFM({
    apiKey: '007bb7dc4b7d8eef22dddd17427dc720',
    apiSecret: '341b8690cb2f80336f49ba5bae9b5b69',
    cache: null
});

var albumToLook = localStorage.thingToLook;
// Il nome della variabile dice tutto. Il contenuto della funzione pure
var artistToLook = localStorage.artist;

// A questo punto comincio a prendere quello che mi serve

lastfm.album.getInfo(
    {
        album: albumToLook,
        artist: artistToLook
    },  
    // Passand come parametro della ricerca il nome dell'album e dell'artista, posso ottenere il risultato desiderato.
    // Se tutto va a buon fine, allora...
    {
        success: function (data) {
            // Costruisco una stringa che contiene un header h1 con il titolo dell'album e il nome dell'artista
            var title = "<h1> " + data.album.name + " (" + data.album.artist + ") " + "</h1>" + "<br />";
            image(data.album.image[3]['#text'], title); //Chiamo image passando il link all'immagine

            // C'è però un problema: non sempre il JSON "data" conterrà un wiki, cioè una sezione riassuntiva.
            //Con typeof, controllo se quel valore effettivamente esiste
            if (typeof data.album.wiki !== 'undefined') {
                //Se esiste, con jQuery aggiungo il riassunto
                $("p#description").html(data.album.wiki.summary);
            } else {
                //Altrimenti, sempre con jQuery, metto sulla pagina una sorta di messaggio di errore
                $("p#description").html("Sorry, there's no description available: perhaps this is a DVD?");
            }
            setTracklist(data.album.tracks.track); //Setto la tracklist
            iTunesLinkSetter(); // E il link per comprarlo
        },
        // In caso di errore, si printa il messaggio di errore
        error: function (code, message) {
            $("p#description").html(message + "<br /> Maybe you typed it in a wrong way?");
            console.log(message);
        }
    });

//la funzione setTracklist, preso in input l'array delle tracklist, riempie la pagina delle tracce
function setTracklist(tracklist) {
    if (tracklist.length === 0) { //Se, per assurdo, il JSON non dovesse contenere nessuna traccia...
        $('#tracklist').html('Stiamo avendo problemi nel caricare la tracklist. Riprova più tardi'); 
        //... aggiungiamo con jQuery un messaggio di errore
    }
    for (var i = 0; i < tracklist.length; i++) { 
        //Sennò...
        var time = calculateTime(tracklist[i]['duration']); //Per ogni stringa i-sima, prendo la durata in secondi e la converto in minuti
        $('#tracklist').append('<li> ' + tracklist[i]['name'] + " (" + time + ") " + '</li><br />'); //E con jQuery aggiungo 
    }


}

function iTunesLinkSetter() {
    //Uso una funzione di jQuery per catturare il JSON che le API di iTunes restituiscono.
    //Il link lo compongo perché, ovviamente, la ricerca varia in base all'artista che si cerca.
    //Il limite è stato impostato a 5
    $.getJSON('https://itunes.apple.com/search?term=' + localStorage.artist + '&limit=5&country=it&entity=musicTrack', function (data) {
        //Se ho successo, aggiungo un link che rimanda ad iTunes per l'acquisto in digitale
        $('#listaWhereToBuy').append("<li><a href='" + data.results[0]['artistViewUrl'] + "'> Acquista qui in formato digitale!</a></li> ");
    });
}

//Trasforma il tempo da secondi a minuti
function calculateTime(timeInSeconds) {
    var mins = 0;
    var secs = 0;
    //Fintanto che timeInSeconds è > 0...
    while (timeInSeconds > 0) {
        timeInSeconds -= 60; //Sottraggo 60 secondi, perché 60 secondi = 1 minuto
        if (timeInSeconds < 0) { //Se vado in "perdita", cioè diventa negativa...
            timeInSeconds += 60 //Riaggiungo i secondi tolti...
            secs = timeInSeconds; //E li aggiungo ai secondi da ritornare
            break; //Ed esco dal while
        }
        mins += 1; //Ed aggiungo un minuto alla variabile mins
    }
    secs = secs < 10 ? "0" + String(secs) : secs; //Se poi, i secondi sono meno di 10, invece di avere una cosa come "4:9" minuti, che in realtà sarebbe "4:09", modifico il valore di secondi in modo da riadattarlo
    return String(mins) + ":" + String(secs); //Ritorna la stringa dei minuti correttamente formattata
}
