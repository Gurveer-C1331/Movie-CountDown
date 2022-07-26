import { getCookie, setCookie } from "./cookie.js";
import { sortList } from "./sort.js";
import { filterReset } from "./filter.js"
var container = document.getElementById('main-container'); //container to hold all cards
var options = document.getElementById('options-container'); //options bar

var sortDirectionDown = document.getElementById("sort-directionDown"); //down arrow button
var informationText = document.getElementById("info-text");
export var cardArr = []; //will hold all movie/tv series cards (html elements created in createCard)
//information for api use
const url = "https://api.themoviedb.org/3";
const apiKey = "8b44439b22495d003fe165611e34d4e5";

var movie_Collection, tv_Collection; //to hold values for movie and tv series cookies

$("document").ready(async function() {
  sortDirectionDown.style.display = "none"; //hide down arrow by default
    
  //display loading image
  container.classList.add("results-loader");
  container.innerHTML = "<div class='loader'></div>";

  //gets the movie collection (from the movie_Collection cookie)
  movie_Collection = getCookie("movie_Collection") || [];
  if (typeof movie_Collection == "string") movie_Collection = [movie_Collection];
  await displayMovies(movie_Collection);
  //gets the tv series collection (from the tv_Collection cookie)
  tv_Collection = getCookie("tv_Collection") || [];
  if (typeof tv_Collection == "string") tv_Collection = [tv_Collection];
  await displayTV(tv_Collection);
  
  //remove loading image
  container.innerHTML = "";
  container.classList.remove("results-loader");

  //sorts cardArr array by date of release by default (ascending)
  sortList("Release", "up");

  //display information text to the user if the collection is empty (new to the site)
  if (container.innerHTML == "") {
    informationText.style.display = null;
  }
  else { options.style.display = null; }

  //refreshes countdown every second
  setInterval(function() {
    var cards = document.getElementsByClassName("card-container");
    for (var i = 0; i < cards.length; i++) {
      setTime(cards[i]);
    }
  });
  //asking for notification permission
  Notification.requestPermission(function(status) {
    console.log(status);
  });

  soonRelease();
  filterReset();
});

//replaces old tv series ids with updated ones
function updateTVID() {
  var tv_Collection = getCookie("tv_Collection");
  for (x in tv_Collection) {
    console.log(tv_Collection[x]);
    tvID = tv_Collection[x].split("@");
    //console.log(tvID[0]);
    tv_Collection[x] = tvID[0];
  }
  setCookie("tv_Collection", tv_Collection, 365);
}

//goes through the movies list (from movie_Collection cookie) to add html card into cardArr
//movies -> list of movie ids
async function displayMovies(movies) {
  for (var i = 0; i < movies.length; i++) {
    var search_response = await axios.get(url+"/movie/"+movies[i]+"?api_key="+apiKey+"&region=CA");
    var search_data = search_response.data;
    cardArr.push(createCard(search_data, "Movie"));
  }
}

//goes through the tv series list (from tv_Collection cookie) to add html card into cardArr
//tv -> list of tv series ids
async function displayTV(tv) {
  for (var i = 0; i < tv.length; i++) {
    var tvID = tv[i].split("@");
    console.log(tvID);
    var search_response = await axios.get(url+"/tv/"+tvID[0]+"?api_key="+apiKey+"&region=CA");
    var search_data = search_response.data;
    //console.log(search_data)
    var seasons = search_data["seasons"];
    var last_episode = search_data["last_episode_to_air"];
    var next_episode = search_data["next_episode_to_air"];
    //next/final episode information
    if (!next_episode) { 
      search_data["air_date"] = search_data["last_air_date"];
      search_data["next_episode_season"] = last_episode["season_number"];
      search_data["next_episode_number"] = last_episode["episode_number"];
      search_data["next_episode_name"] = last_episode["name"];
      console.log(last_episode["name"]);
    }
    else {
      search_data["air_date"] = next_episode["air_date"];
      search_data["next_episode_season"] = next_episode["season_number"];
      search_data["next_episode_number"] = next_episode["episode_number"];
      search_data["next_episode_name"] = next_episode["name"];
      console.log(next_episode["name"]);
    }
    var season_number;
    if (seasons[search_data["next_episode_season"]]) season_number = search_data["next_episode_season"];
    else season_number = (search_data["seasons"].length)-1;
    //modifies the data for tv series (to specify the new/current season)
    search_data["name"] += " ("+seasons[season_number]["name"]+")";
    search_data["id"] = tv[i];
    search_data["poster_path"] = seasons[season_number]["poster_path"] || search_data["poster_path"];
    
    cardArr.push(createCard(search_data, "TV Series"));
  }
}

//create the html card for each movie/tv series data passed
//data -> movie/tv series data from the API
//return -> html elements that make up the card
function createCard(data, mediaType) {
  //assign variables needed to create card
  var title = data["title"] || data["name"];
  if (mediaType == "TV Series" && data["networks"][0]) var studio = (data["networks"][0]["name"]);
  else if (data["production_companies"][0]) var studio = data["production_companies"][0]["name"];
  else var studio = "";
  if (data["poster_path"]) var poster = data["poster_path"];
  else var poster = "";
  var releaseDate = data["release_date"] || data["air_date"];
  var id = data["id"];
  if (data["genres"][1]) var genre = data["genres"][0]["name"]+"/"+data["genres"][1]["name"];
  else var genre = data["genres"][0]["name"];
  //main container for each card
  var cardContainer = document.createElement("div");
  cardContainer.classList = "card-container";
  cardContainer.style.backgroundImage = "url(https://image.tmdb.org/t/p/w500"+poster+")";
  
  cardContainer.innerHTML = 
    `<div class="image-container">
      <img src="https://image.tmdb.org/t/p/w500`+poster+`" alt="" id="image">
    </div>
    <div class="text-container">
      <div class="top no-hover">
        <span class="title-text">`+title+`</span><br>
        <span class="episode-text"><strong class="episodeNum">`+"S"+data["next_episode_season"]+"E"+data["next_episode_number"]+": "+`</strong>`+data["next_episode_name"]+`</span>
        <br class="tv-lineBreak">
        <span class="studio-text">`+studio+`</span><br>
        <span class="movie-genre-text">`+genre+`</span>
      </div>
      <div class="middle no-hover">
        <span class="release-date" style="display: none">`+releaseDate+`</span>
        <table>
          <tbody>
            <tr>
              <td class="days"><span>360</span></td>
              <td class="days-text"><span>Days</span></td>
            </tr>
            <tr>
              <td colspan="2" class="date-text">
                <img src="assets/images/calendar.svg" alt="">
                <span>Dec. 17, 2021</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bottom no-hover">
        <span class="media-text">`+mediaType+`</span>
        <span class="id" style="display: none">`+id+`</span>
      </div>
      <a href="#" class="remove-text">
        <img src="assets/images/x.svg" alt="">
        <span>Remove</span>
      </a>
    </div>`;
  setRemoveBtn(cardContainer);
  setTime(cardContainer);
  return cardContainer;
}

//adds event listeners for remove button to element passed
function setRemoveBtn(element) {
  var removeBtn = element.getElementsByClassName("remove-text");
  removeBtn[0].addEventListener("click", function(e) {
    var id = element.getElementsByClassName("id")[0].innerHTML;
    //for movies (remove movie id from movie collection cookie)
    if (movie_Collection.includes(id)) {
      var index = movie_Collection.indexOf(id);
      movie_Collection.splice(index, 1);
      setCookie("movie_Collection", movie_Collection, 365);
    }
    //for tv series (remove tv series id from tv collection cookie)
    else if (tv_Collection.includes(id)) {
      var index = tv_Collection.indexOf(id);
      tv_Collection.splice(index, 1);
      setCookie("tv_Collection", tv_Collection, 365);
    }
    element.remove(); //remove entire card
    e.preventDefault();
  });
}

//sets the days, hours, minute, second and date for the element passed
function setTime(element) {
  var daysText = element.getElementsByClassName("days");
  var dateText = element.getElementsByClassName("date-text");
  var releaseDate = new Date(element.getElementsByClassName("release-date")[0].innerHTML+"T00:00:00");
  var today = new Date();
  var difference = releaseDate - today;

  var days = Math.floor(difference / (1000 * 60 * 60 * 24));
  var hours = "0" + Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = "0" + Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = "0" + Math.floor((difference % (1000 * 60)) / 1000);

  if (difference / (1000 * 60 * 60 * 24) < 0) { //movie/tv series released
    daysText[0].innerHTML = "Released";
    element.getElementsByClassName("days-text")[0].innerHTML = "";
    daysText[0].style.paddingBottom = ".2em";
    daysText[0].style.paddingTop = ".2em";
    daysText[0].style.fontSize = "2em";
  }
  else if (difference / (1000 * 60 * 60 * 24) < 1) { //less than a day away from release
    daysText[0].innerHTML = hours.slice(-2)+" : "+minutes.slice(-2)+" : "+seconds.slice(-2);
    element.getElementsByClassName("days-text")[0].innerHTML = "";
    daysText[0].style.paddingBottom = ".2em";
    daysText[0].style.paddingTop = ".2em";
  }
  else daysText[0].innerHTML = days;
  dateText[0].children[1].innerHTML = releaseDate.toDateString().substring(4,15);
}

//sends the user a notification if any of the movies/tv series in the user's collection is releasing in 7 days
function soonRelease() {
  var releaseStr = ""; //will hold movies/tv series titles
  var cards = document.getElementsByClassName("card-container");
  for (var i = 0; i < cards.length; i++) {
    var element = cards[i];
    var mediaType = element.getElementsByClassName("media-text")[0].innerHTML;
    var releaseDate = new Date(element.getElementsByClassName("release-date")[0].innerHTML+"T00:00:00");
    var today = new Date();
    var difference = releaseDate - today;
    //less than 7 days away from release
    if (difference / (1000 * 60 * 60 * 24) < 8 && difference / (1000 * 60 * 60 * 24) > 0 ) {
      var title = element.getElementsByClassName("title-text")[0].innerHTML;
      var titleText = title.split(" (");
      var episodeNum = element.getElementsByClassName("episodeNum")[0].innerHTML;
      if (mediaType == "TV Series") releaseStr += titleText[0] + " - " + episodeNum.replace(":", "") +"\n";
      else releaseStr += titleText[0]+"\n";
    }
  }
  console.log(releaseStr);
  if (releaseStr != "") {
    displayNotification(releaseStr);
  }
}

//displays a notification based on titles releasing in 7 days
//titles -> string containing movies/tv series titles
function displayNotification(titles) {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.register('serviceWorker.js').then(function(reg) {
      reg.showNotification('Releasing in 7 days', {
        body: titles, 
        icon: "assets/images/M.png"
      });
    });
  }
}