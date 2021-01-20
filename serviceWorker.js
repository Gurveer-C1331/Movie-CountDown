self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var action = e.action;
  
  if (action === 'close') {
    notification.close();
  } 
  else {
    clients.openWindow('https://www.cs.ryerson.ca/~g3chahal/Movie%20CountDown/home.html');
    notification.close();
  }
});