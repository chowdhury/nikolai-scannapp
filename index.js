const express = require('express');
const app = express();

app.use('/scan', express.static('scan'));
app.use(function(request, response) {
  response.send('You probably want /scan');
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
