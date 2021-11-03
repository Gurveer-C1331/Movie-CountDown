var searchBtn = document.getElementById("search-btn");
var searchBar = document.getElementById('search-bar');
var resultsDiv = document.getElementById("results-container");
var nextBtn = document.getElementById("next-btn");
var previousBtn = document.getElementById("previous-btn");
var addBtn, removeBtn;
//information for api use
const url = "https://api.themoviedb.org/3";
const apiKey = "8b44439b22495d003fe165611e34d4e5";

var currentPage = null; //current page user is on
var previousPage = []; //holds previous page #s
var totalPages = null; //total # of pages user can browse
//assigning values from cookies
var movie_Collection = getCookie("movie_Collection") || [];
if (typeof movie_Collection == "string") movie_Collection = [movie_Collection];
var tv_Collection = getCookie("tv_Collection") || [];
if (typeof tv_Collection == "string") tv_Collection = [tv_Collection];

//returns cookie value based on cookie name passed
//cookieName -> name of the cookie
//return -> value contained in the cookie
function getCookie(cookieName) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].includes(cookieName)) {
      console.log(cookieName);
      console.log(cookies[i].split('=')[1]);
      var cookie_value = cookies[i].split('=')[1];
      if (cookie_value.includes(',')) {
        return cookie_value.split(',');
      }
      return cookie_value;
    }
  }
}

//sets cookies based on name, value and expires after specified days
function setCookie(name, value, days) {
  var expireDate =  new Date();
  expireDate.setTime(expireDate.getTime() + (days*24*60*60*1000));
  document.cookie = name+"="+value+";expires="+expireDate.toUTCString();
}

$("document").ready(async function() {
  //hide previous and next buttons by default
  $("#previous-btn").hide();
  $("#next-btn").hide();

  await getSearch(1);
});

searchBtn.addEventListener("click", async function (e) {
  if (searchBar.value) {
    document.cookie = "searchTyped="+searchBar.value;
    window.location.href = "search.html";
  }
  e.preventDefault();
});

//user presses "Enter" when typing in the search bar
searchBar.addEventListener("keyup", async function(e) {
  if (e.keyCode == 13) {
    if (searchBar.value) {
      document.cookie = "searchTyped="+searchBar.value;
      window.location.href = "search.html";
    }
    e.preventDefault();
  }
});

//next button to go to more search results
nextBtn.addEventListener("click", async function(e) {
  if (currentPage < totalPages) {
    await getSearch(currentPage+=1);
    scroll(0,0);
  }
  else {
    console.log("No more results");
  }
  e.preventDefault();
});

//previous to go to previous search results
previousBtn.addEventListener("click", async function(e) {
  if (currentPage > 1) {
    console.log(previousPage);
    previousPage.pop();
    await getSearch(previousPage.pop());
    scroll(0,0);
  }
  else {
    console.log("At the start of results");
  }
  e.preventDefault();
});

//getting search results 
//searchString -> string typed inside the search bar
//page -> page number (of the API) to get results
async function getSearch(page) {
  var today =  new Date();
  var search_response = await axios.get(url+"/discover/tv?api_key="+apiKey+"&air_date.gte="+today.toJSON().substr(0,10)+"&page="+page);
  var search_data = search_response.data;
  resultsDiv.innerHTML = ""; //clear results container

  if (search_data["total_results"] != 0) {
    currentPage = page;
    totalPages = search_data["total_pages"];
    var search_results = search_data["results"];

    //hide previous and next buttons
    $("#previous-btn").hide();
    $("#next-btn").hide();
    //display loading image
    resultsDiv.classList.add("results-loader");
    resultsDiv.innerHTML = "<div class='loader'></div>";

    var search_results = await combineResults(); //get filtered results

    //remove loading image
    resultsDiv.innerHTML = "";
    resultsDiv.classList.remove("results-loader");
    
    //going through all the search results
    for (var i = 0; i < search_results.length; i++) {
      //getting data to create card
      var title =  search_results[i]["name"];
      var poster = search_results[i]["poster_path"];
      var id = search_results[i]["id"];
      resultsDiv.append(createCard(title, poster, id+"@"+String(search_results[i]["currentSeason"])+"@"+String(search_results[i]["currentEpisode"]), "tv")); //append the searchCard to fill results container
    }

    addBtn = document.getElementsByClassName("add-text");
    //add event listener to every add button
    for (var i = 0; i < addBtn.length; i++) {
      addBtn[i].addEventListener("click", function(e) {
        var id = e.srcElement.parentElement.parentElement.children[2].innerHTML;
        //add the id and update the cookie
        tv_Collection.push(id);
        setCookie("tv_Collection", tv_Collection, 365);
        //update buttons (add -> remove)
        e.srcElement.parentElement.parentElement.children[4].style.display = "none";
        e.srcElement.parentElement.parentElement.children[5].style.display = null;
        e.preventDefault();
      });
    }
    removeBtn = document.getElementsByClassName("remove-text");
    //add event listener to every remove button
    for (var i = 0; i < removeBtn.length; i++) {
      removeBtn[i].addEventListener("click", function(e) {
        var id = e.srcElement.parentElement.parentElement.children[2].innerHTML;
        //remove the id and update the cookie
        var index = tv_Collection.indexOf(id);
        tv_Collection.splice(index, 1);
        setCookie("tv_Collection", tv_Collection, 365);
        //update buttons (remove -> add)
        e.srcElement.parentElement.parentElement.children[4].style.display = null;
        e.srcElement.parentElement.parentElement.children[5].style.display = "none";
        e.preventDefault();
      });
    }

    //set previous & next button to hide or show (depending the # of resulting pages & current page being viewed)
    if (previousPage.length == 1 && currentPage == totalPages) {
      $("#previous-btn").hide();
      $("#next-btn").hide();
    }
    else if (previousPage.length == 1) {
      $("#previous-btn").hide();
      $("#next-btn").show();
    }
    else if (currentPage == totalPages) {
      $("#previous-btn").show();
      $("#next-btn").hide();
    }
    else {
      $("#previous-btn").show();
      $("#next-btn").show();
    }
  }

  //no results (API returns no movies/tv series)
  else {  
    resultsDiv.innerHTML += "<span id='no-results-text'>No Search Results</span>";
    $("#previous-btn").hide();
    $("#next-btn").hide();
  }
  
}

//creates div element which will be the movie/tv series card
//title, poster, id, mediaType -> data of the movie/tv series neccessary to create the card
//return -> div element (card)
function createCard(title, poster, id, mediaType) {
  var searchCard = document.createElement('div');
  searchCard.classList = "search-card";
  var searchItem = document.createElement('div');
  searchItem.classList = "search-item";

  //adding data into searchItem div
  if (poster != null ) searchItem.innerHTML += "<img src=https://image.tmdb.org/t/p/w500/"+poster+" class='no-hover poster'>";
  else searchItem.innerHTML += "<img src='' alt='poster image' class='no-hover' style='padding: 1em'>";
  searchItem.innerHTML += "<div class='no-hover'><span>"+title+"</span></div>";
  searchItem.innerHTML += "<span style='display:none'>"+id+"</span>";
  searchItem.innerHTML += "<span style='display:none'>"+mediaType+"</span>";
  //display add or remove buttons depending on if the user has added the movie/tv series to their collection
  if ((movie_Collection.includes(String(id)) && mediaType == "movie") || (tv_Collection.includes(String(id)) && mediaType == "tv")) {
    searchItem.innerHTML += "<a href='#' class='add-text' style='display:none'><img src='assets/images/plus.svg' alt=''><span>Add</span></a>";
    searchItem.innerHTML += "<a href='#' class='remove-text'><img src='assets/images/x.svg' alt=''><span>Remove</span></a>";
  } 
  else {
    searchItem.innerHTML += "<a href='#' class='add-text'><img src='assets/images/plus.svg' alt=''><span>Add</span></a>";
    searchItem.innerHTML += "<a href='#' class='remove-text' style='display:none'><img src='assets/images/x.svg' alt=''><span>Remove</span></a>";
  }
  searchCard.style.backgroundImage = "url('https://image.tmdb.org/t/p/w500/"+poster+"')";
  searchCard.append(searchItem);
  return searchCard;
}

//combine results from different pages (of the API) to gather 20 movies/tv series to fill page
//each page is filtered to only retrieve data for upcoming and ongoing (with future episodes) tv series
//currentPage -> current results page returned by the API
//totalPages -> total number of pages returned by the API
//return -> array containing all future releasing movies and tv series
async function combineResults() {
  //filtering results will lead to each result page combining a varying # of API pages
  //Ex. Page 1 maybe combine 2 page worth of data, while Page 2 might combine 10 page worth of data from the API
  previousPage.push(currentPage); //save previous page # to make prev. and next page possible
  var resultsArr = [];
  
  while (currentPage != totalPages+1 && resultsArr.length < 20) {
    var today = new Date();
    var search_response = await axios.get(url+"/discover/tv?api_key="+apiKey+"&air_date.gte="+today.toJSON().substr(0,10)+"&page="+currentPage);
    var search_data = search_response.data;
    for (var i = 0; i < search_data["results"].length; i++) {
      var searchItem = search_data["results"][i];
      if (await checkTv(searchItem)) {
          resultsArr.push(searchItem);
      }
    }
    currentPage += 1;
  }
  currentPage -= 1;
  return resultsArr;
}

//checks tv series to check for any future seasons or ongoing seasons with future episodes
//searchItem -> tv series object (retrieved from API)
//return -> true (if there exists a future season) along with season object OR false (no future seasons)
async function checkTv(searchItem) {
  var search_response = await axios.get(url+"/tv/"+searchItem["id"]+"?api_key="+apiKey);
  var search_data = search_response.data;
  console.log(search_data);
  if (!search_data["next_episode_to_air"]) return false;
  var next_episode = search_data["next_episode_to_air"];
  var season_number = next_episode["season_number"];
  var season = search_data["seasons"][season_number] || search_data["seasons"][season_number-1];
  var today = new Date();
  var airDate = new Date(next_episode["air_date"]+"T00:00:00");
  //if there is a planned episode for the future
  if (today.getTime() < airDate.getTime() && next_episode) {
    //modify data (for the specific season)
    searchItem["name"] += " ("+season["name"]+")";
    searchItem["currentSeason"] = season_number;
    searchItem["currentEpisode"] = next_episode["episode_number"];
    searchItem["poster_path"] = season["poster_path"] || search_data["poster_path"];
    return true;
  }
  return false;
}