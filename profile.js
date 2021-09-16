var searchBtn = document.getElementById("search-btn");
var searchBar = document.getElementById('search-bar');
var exportBtn = document.getElementById('export');
var importBtn = document.getElementById('import');

var movie_Collection, tv_Collection; //to hold values for movie and tv series cookies

$("document").ready(async function() {
  //gets the movie collection (from the movie_Collection cookie)
  movie_Collection = getCookie("movie_Collection") || [];
  //gets the tv series collection (from the tv_Collection cookie)
  tv_Collection = getCookie("tv_Collection") || [];
  //update collection.txt file
  saveCollectionData();
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

//returns cookie value based on cookie name passed
//cookieName -> name of the cookie
//return -> value contained in the cookie
function getCookie(cookieName) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].includes(cookieName)) {
      console.log(cookies[i].split('=')[1], cookieName);
      var cookie_value = cookies[i].split('=')[1];
      if (cookie_value.includes(',')) {
        return cookie_value.split(',');
      }
      return cookie_value;
    }
  }
}

// exportBtn.addEventListener('click', function(e) {
//   saveCollectionData();
//   e.preventDefault();
// });

//saves movie and tv collection data to a text file
function saveCollectionData() {
  var blob = new Blob([movie_Collection+";"+tv_Collection], {type: "text/plain;charset=utf-8"});
  var blobURL = URL.createObjectURL(blob);

  exportBtn.href = blobURL;
  exportBtn.download = "collection.txt";
  //document.body.appendChild(link); // Or append it whereever you want
}//

async function saveFile(f) 
{
    //let user = { name:'john', age:34 };
    let formData = new FormData();
    let file = f.files[0];      
         
    formData.append("file", file);
    //formData.append("user", JSON.stringify(user)); 
    
    const ctrl = new AbortController()    // timeout
    //setTimeout(() => ctrl.abort(), 5000);
    
    try {
       let r = await fetch('/assets/', 
         {method: "POST", body: formData}); 
       console.log('HTTP response code:',r.status); 
    } catch(e) {
       console.log('Huston we have problem...:', e);
    }
    
}