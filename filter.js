import { cardArr } from "./home.js";
var filterMethod = document.getElementById('filter-method'); //filter text button

//user clicks the filter method text
filterMethod.addEventListener("click", function(e) {
  if (filterMethod.innerHTML == "All") {
    filterMethod.innerHTML = "Movies";
    filterMovies();
  }
  else if (filterMethod.innerHTML == "Movies") {
    filterMethod.innerHTML = "TV Series";
    filterTV();
  }
  else {
    filterMethod.innerHTML = "All";
    filterReset();
  }
});

//filters the list to only show tv shows
function filterTV() {
  for (var i = 0; i < cardArr.length; i++) {
    var mediaType = cardArr[i].getElementsByClassName("media-text")[0].innerHTML;
    if (mediaType == "Movie") {
      cardArr[i].style.display = "none";
    }
    else {
      cardArr[i].style.display = null;
    }
  } 
}

//filters the list to only show movies
function filterMovies() {
  for (var i = 0; i < cardArr.length; i++) {
    var mediaType = cardArr[i].getElementsByClassName("media-text")[0].innerHTML;
    if (mediaType == "TV Series") {
      cardArr[i].style.display = "none";
    }
    else {
      cardArr[i].style.display = null;
    }
  } 
}

//resets the filters applied
export function filterReset() {
  for (var i = 0; i < cardArr.length; i++) {
    cardArr[i].style.display = null;
  } 
}