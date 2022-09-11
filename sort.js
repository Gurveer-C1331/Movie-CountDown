import { cardArr } from "./home.js";
var container = document.getElementById('main-container'); //container to hold all cards
var sortMethod = document.getElementById("sort-method"); //sort text button
//direction arrow buttons 
var sortDirectionUp = document.getElementById("sort-directionUp");
var sortDirectionDown = document.getElementById("sort-directionDown");

//user clicks the sort method text
sortMethod.addEventListener("click", function(e) {
  //toggles to sort by to either by name or by release
  if (sortMethod.innerHTML == "Release") {
    sortMethod.innerHTML = "Name";
  }
  else {
    sortMethod.innerHTML = "Release";
  }
  sortDirectionDown.style.display = "none";
  sortDirectionUp.style.display = null;
  sortList(sortMethod.innerHTML, "up");
});

//user clicks the up arrow to indicate descending
sortDirectionUp.addEventListener("click", function(e) {
  sortList(sortMethod.innerHTML, "down")
  sortDirectionUp.style.display = "none";
  sortDirectionDown.style.display = null;
});

//user clicks the down arrow to indicate ascending
sortDirectionDown.addEventListener("click", function(e) {
  sortList(sortMethod.innerHTML, "up")
  sortDirectionDown.style.display = "none";
  sortDirectionUp.style.display = null;
});

//sorts the list of movies/tv series based on the sort options user choose
export function sortList(method, direction) {
  if (method == "Release" && direction == "up") { //by release (ascending)
    cardArr.sort(sortCardsByRelease);
  }
  else if (method == "Release" && direction == "down") { //by release (descending)
    cardArr.reverse(sortCardsByRelease);
  }
  else if (method == "Name" && direction == "up") { //by name (ascending)
    cardArr.sort(sortCardsByName);
  }
  else if (method == "Name" && direction == "down") { //by name (descending)
    cardArr.reverse(sortCardsByName);
  }
  container.innerHTML = ""; //clears main container
  //appends all cards into the main container
  for (var i = 0; i < cardArr.length; i++) {
    container.append(cardArr[i]);
    setText(cardArr[i]);   
  }
}

//updates how and what text is shown on individually cards
function setText(element) {
  var textContainer = element.getElementsByClassName("text-container");
  var textContainerWidth = parseFloat(window.getComputedStyle(textContainer[0]).width);
  var titleText = element.getElementsByClassName("title-text");
  var studioText = element.getElementsByClassName("studio-text");
  var episodeText = element.getElementsByClassName("episode-text");
  var movieGenre = element.getElementsByClassName("movie-genre-text");
  var tvlineBreak = element.getElementsByClassName("tv-lineBreak");
  var mediaText = element.getElementsByClassName("media-text");
  //sets animation for title, studio and episode texts longer than card's width
  if (titleText[0].scrollWidth > textContainerWidth) {
    titleText[0].style.animation = "scrollText 8s linear infinite";
  }
  if (studioText[0].scrollWidth > textContainerWidth) {
    studioText[0].style.animation = "scrollText 8s linear infinite";
  }
  if (episodeText[0].scrollWidth > textContainerWidth) {
    episodeText[0].style.animation = "scrollText 8s linear infinite";
  }
  if (mediaText[0].innerHTML == "Movie") {
    episodeText[0].style.display = "none";
    tvlineBreak[0].style.display = "none";
  }
  else {
    movieGenre[0].style.display = "none";
  }
}

//sort function to sort by release date
function sortCardsByRelease(elementA, elementB) {
  var releaseDateA = elementA.getElementsByClassName("release-date");
  var dayA = new Date(releaseDateA[0].innerHTML+"T00:00:00");
  var releaseDateB = elementB.getElementsByClassName("release-date");
  var dayB = new Date(releaseDateB[0].innerHTML+"T00:00:00");
  return dayA.getTime() - dayB.getTime();
}

//sort function to sort by title name
function sortCardsByName(elementA, elementB) {
  var titleA = elementA.getElementsByClassName("title-text")[0].innerHTML;
  var titleB = elementB.getElementsByClassName("title-text")[0].innerHTML;
  if(titleA < titleB) { return -1; }
  if(titleA > titleB) { return 1; }
  return 0;
}