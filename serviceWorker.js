self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var action = e.action;
  
  if (action === 'close') {
    notification.close();
  } 
  else {
    clients.openWindow('https://gurveer-c1331.github.io/Movie-CountDown');
    notification.close();
  }
});