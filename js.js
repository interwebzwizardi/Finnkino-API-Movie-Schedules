
//TAPAHTUMAKUUNTELIJAT

haeElokuviaBtn.addEventListener('click', haeElokuvat);


//FUNKTIOT

function haeElokuvat(){
  //Haetaan ensin käyttäjän valitseman teatterin id muuttujaan
  var teatteriID = document.getElementById('dropMenu').value;

  //Haetaan käyttäjän valitsema päivämäärä muuttujaan
  var pvm = document.getElementById('dateInput').value;
  //Järjestellään päivämäärä oikeaan muotoon Finnkino API:n vaatimusten mukaan (dd.mm.yyyy)
  var slicedPVM = pvm.slice(8,10) + "." + pvm.slice(5,7) + "." + pvm.slice(0,4);

  //Luodaan muuttuja API:n URLia varten
  var xmlURL = "https://www.finnkino.fi/xml/Schedule/?area=" + teatteriID + "&dt=" + slicedPVM;

  //AJAX-kysely
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET",xmlURL,true);
  xmlhttp.send();
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200){

      //Poistetaan mahdolliset vanhat hakutulokset
      $(elokuvatContainer).empty();

      //Tallennetaan vastauksena saatu data muuttujaan
      var xmlDoc = xmlhttp.responseXML;

      //Haetaan näytösten määrä muuttujaan
      var shows = xmlDoc.getElementsByTagName('Show');
      showsLength = shows.length;

      //Haetaan halutut tiedot omiin tauluihin
      var thumbnail = xmlDoc.getElementsByTagName('EventMediumImagePortrait');
      var title = xmlDoc.getElementsByTagName('Title');
      var prodYear = xmlDoc.getElementsByTagName('ProductionYear');
      var lenght = xmlDoc.getElementsByTagName('LengthInMinutes');
      var showStart = xmlDoc.getElementsByTagName('dttmShowStart');
      var theatreAndAuditorium = xmlDoc.getElementsByTagName('TheatreAndAuditorium');
      var lippujenOstoURL = xmlDoc.getElementsByTagName('ShowURL');
      var tietoaElokuvastaURL = xmlDoc.getElementsByTagName('EventURL');


      //Asetetaan tiedot näkyviin containeriin loopin avulla
      for(var i = 0; i <showsLength; i++){

        //Muotoillaan näytöksen alkamisajankohta muotoon hrhr-minmin dd-mm-yyy
        var slicedShowStart = showStart[i].childNodes[0].nodeValue.slice(11,16) + " " + showStart[i].childNodes[0].nodeValue.slice(8,10)
        + "." + showStart[i].childNodes[0].nodeValue.slice(5,7) + ".";

        //Luodaan uusi div, jonka sisälle asetetaan aina yhden näytöksen tiedot
        var newMovieElement = document.createElement('div');
        newMovieElement.setAttribute('class', 'movieElement');

        //Nappien käyttämät URLit muuttujiin
        var muuttujaOstoURL = lippujenOstoURL[i].childNodes[0].nodeValue;
        var muuttujaTietojaURL = tietoaElokuvastaURL[i].childNodes[0].nodeValue;

        newMovieElement.innerHTML = '<img alt="thumbnail" class="thumbnail" src="' + thumbnail[i].childNodes[0].nodeValue + '">';
        newMovieElement.innerHTML += '<h2 class="movieTitle">' + title[i].childNodes[0].nodeValue + '</h2>';
        newMovieElement.innerHTML += '<h2 class="showStartTitle">' + slicedShowStart + '</h2>';
        newMovieElement.innerHTML += '<p class="movieInfoP">' + theatreAndAuditorium[i].childNodes[0].nodeValue + ' - Kesto:' + lenght[i].childNodes[0].nodeValue +' Min</p>';
        newMovieElement.innerHTML += '<div id="formDiv"><form action="' + muuttujaOstoURL + '"><input type="submit" class="ostaLippujaBtn" value="Osta lippuja"/></form><form action="' + muuttujaTietojaURL + '"><input type="submit" class="tietojaElokuvastaBtn" value="Tietoja elokuvasta"/></form><div>';
        //newMovieElement.innerHTML +='<button class="ostaLippujaBtn" onclick="ostaLippuja">Osta lippuja</button><button class="tietojaElokuvastaBtn" onclick="tietojaElokuvasta">Tietoja Elokuvasta</button>';

        //Lisätään elementti elokuvien containeriin
        document.getElementById('elokuvatContainer').appendChild(newMovieElement);
      }
    }
  };
}
