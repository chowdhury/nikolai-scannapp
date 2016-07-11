# Simple Server

This demonstrates setting up a simple server on Heroku to host static pages (in this case evrythng-scan from examples).
By taking advantage of mount points, the static pages are served via an Express based web application.

## Heroku

If you haven't already, go through the [Heroku tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).

## Package.json

The existence of package.json informs Heroku this is a Node application and almost all Heroku configuration can be
accomplished through the scripts section.  Specifically, a *start* script is needed:

    "scripts": {
      "start": "node index.js"
    }

The node version should also be specified:

    "engines": {
      "node": "4.2.2"
    }

## Procfile

It's a little redundant, but having a Procfile is useful to run the application locally with the *heroku local* command.  It will most likely match the *start* script.

    web: node index.js

## Index.js

I chose index.js, but this file can be called anything.  This base configuration sets up the server:

    const express = require('express');

    const app = express();

    app.use(function(req, res) {
      res.status(404).send('These are not the pages you seek');
    });

    app.set('port', (process.env.PORT || 5000));
    app.listen(app.get('port'), function() {
      console.log('Node app is running on port', app.get('port'));
    });

The *app.use()* function mounts a page on a path based on the first argument, which defaults to '/'.  The first matched
path wins.  In the case above, a catch all has been created to generate a custom 404 message.  If a custom 404 page is
available the above would look like

    app.use(function(req, res) {
      res.status(404).sendFile('PATH-TO-HTML', {root : __dirname});
    });

To mount scan/index.html on /scan add the following

    app.use('/scan', express.static('scan'));

The express.static function is not recursive but will provide access to all files in the directory (i.e. scan in this case).
Again note the first argument is the path and first path match wins.  So the order should look like

    app.use('/scan', express.static...
    app.use((function(req, res)...

## Tidbits

Let's say you had a directory structure like

    foo
      index.js
      my-app
        html
          primary-landing-page.html
          secondary-landing-page.html
          underlying-page.html
          custom-404.html
        js
          supporting-code.js
        css
          landing-pages.css

additional mount points are needed so that when path relative references are made to the JavaScript and CSS files, they
can be found

    app.use(express.static('my-app'));
    app.use(express.static('my-app/html'));

    app.use('/order', express.static('my-app/html/primary-landing-page'));
    app.use('/test', express.static('my-app/html/secondary-landing-page'));

    app.use(function(req, res) {
      res.status(404).sendFile('my-app/html/custom-404.html', {root : __dirname});
    });

