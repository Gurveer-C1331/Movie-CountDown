import { getCookie, setCookie } from "./cookie.js";
var resultsDiv = document.getElementById("results-container");
var nextBtn = document.getElementById("next-btn");
var previousBtn = document.getElementById("previous-btn");
var addBtn, removeBtn;
//information for api use
const url = "https://api.themoviedb.org/3";
const apiKey = "8b44439b22495d003fe165611e34d4e5";

var currentPage = null; //current page user is on
var totalPages = null; //total # of pages user can browse
//assigning values from cookies
var movie_Collection = getCookie("movie_Collection") || [];
if (typeof movie_Collection == "string") movie_Collection = [movie_Collection];
var tv_Collection = getCookie("tv_Collection") || [];
if (typeof tv_Collection == "string") tv_Collection = [tv_Collection];

$("document").ready(async function() {
  //hide previous and next buttons by default
  $("#previous-btn").hide();
  $("#next-btn").hide();

  await getSearch(1);
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
    await getSearch(currentPage-=1);
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
  var search_response = await axios.get(url+"/discover/movie?api_key="+apiKey+"&region=US&sort_by=popularity.desc&primary_release_date.gte="+today.toJSON().substr(0,10)+"&release_date.gte="+today.toJSON().substr(0,10)+"&page="+page);
  var search_data = search_response.data;
  resultsDiv.innerHTML = ""; //clear results container

  if (search_data["total_results"] != 0) {
    currentPage = page;
    totalPages = search_data["total_pages"];
    var search_results = search_data["results"];
    
    //going through all the search results
    for (var i = 0; i < search_results.length; i++) {
      //getting data to create card
      var title =  search_results[i]["title"];
      var poster = search_results[i]["poster_path"];
      var id = search_results[i]["id"];
      resultsDiv.append(createCard(title, poster, id, "movie")); //append the searchCard to fill results container
    }

    addBtn = document.getElementsByClassName("add-text");
    //add event listener to every add button
    for (var i = 0; i < addBtn.length; i++) {
      addBtn[i].addEventListener("click", function(e) {
        var id = e.srcElement.parentElement.parentElement.children[2].innerHTML;
        //add the id and update the cookie
        movie_Collection.push(id);
        setCookie("movie_Collection", movie_Collection, 365);
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
        var index = movie_Collection.indexOf(id);
        movie_Collection.splice(index, 1);
        setCookie("movie_Collection", movie_Collection, 365);
        //update buttons (remove -> add)
        e.srcElement.parentElement.parentElement.children[4].style.display = null;
        e.srcElement.parentElement.parentElement.children[5].style.display = "none";
        e.preventDefault();
      });
    }

    //set previous & next button to hide or show (depending the # of resulting pages & current page being viewed)
    if (currentPage == 1 && currentPage == totalPages) {
      $("#previous-btn").hide();
      $("#next-btn").hide();
    }
    else if (currentPage == 1) {
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
