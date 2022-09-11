var searchBtn = document.getElementById("search-btn");
var searchBar = document.getElementById('search-bar');

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