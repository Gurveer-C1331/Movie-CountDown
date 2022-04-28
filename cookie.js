//returns cookie value based on cookie name passed
//cookieName -> name of the cookie
//return -> value contained in the cookie
export function getCookie(cookieName) {
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

//sets cookies based on name, value and expires after specified days
export function setCookie(name, value, days) {
  var expireDate = new Date();
  expireDate.setTime(expireDate.getTime() + (days*24*60*60*1000));
  document.cookie = name+"="+value+";expires="+expireDate.toUTCString();
}