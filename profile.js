import { getCookie, setCookie } from "./cookie.js";
var exportBtn = document.getElementById('export');
var importField = document.getElementById('import-field');
var submitBtn = document.getElementById('submit-btn');
var message = document.getElementById('message');

var movie_Collection, tv_Collection; //to hold values for movie and tv series cookies

$("document").ready(async function() {
  //gets the movie collection (from the movie_Collection cookie)
  movie_Collection = getCookie("movie_Collection") || [];
  //gets the tv series collection (from the tv_Collection cookie)
  tv_Collection = getCookie("tv_Collection") || [];
  //update collection.txt file
  saveCollectionData();
});

submitBtn.addEventListener("click", async function (e) {
  var cookies = importField.value;
  cookies = cookies.split(";");
  var movie_Collection = cookies[0];
  var tv_Collection = cookies[1];
  
  setCookie("movie_Collection", movie_Collection, 365);
  setCookie("tv_Collection", tv_Collection, 365);
 
  message.innerText = "Cookie Set"
  e.preventDefault();
});

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