Eat-it source code includes both backend, frontend and development tools.

* Backend
** NodeJS (server)
** ExpressJS (skeleton)
** MongoDB (persistence)

* Frontend
** AngularJS (HTML - JS bindings)
** Jade (HTML)
** Bootstrap & less (CSS)
** jQuery (JS)

=Installation=

* System dependencies

**sudo apt-get install git-core**
** sudo apt-get install mongodb**

** sudo npm install grunt-cli -g**
** sudo npm install express -g**
** sudo npm install bower -g**
** sudo npm install express-generator -g**
** sudo npm install cordova -g****

** git user.name '$PROJECT_AUTHOR_NAME'**
** git user.email '$PROJECT_AUTHOR_EMAIL'**

* Download source code
**git clone git://bitbucket.org/eat-it.git eat-it**
**cd eat-it

* Install project dependencies
**npm install**


=Setup=

* Configure your MondoDB database (Backend).
** **cp config.json.dist config.json**

* Configure your frontend pointing to the backend URL (Frontend).
** **public/javascripts/shared/eatConfig.js**

* Create a virtual host to point to your dist/web dir.
<VirtualHost YOURHOSTNAME:80>
    DocumentRoot "/your/path/to/eat-it/dist/web"
    ServerName YOURHOSTNAME
    <Directory "/your/path/to/eat-it/dist/web">
        AllowOverride All
        Order Allow,Deny
    </Directory>
</VirtualHost>


=Development=

* Start development monitor
** **grunt run:dev**
* Frontend URL
** http://YOURHOSTNAME
* Backend server URL
** http://localhost:3000

==Info==

* CSS using less
** In public/stylesheets/**/*.less

* HTML views using Jade
** In public/views/**/*.jade

* Javascript
** Controllers in public/javascripts/controllers/**/*.js
** Models in public/javascripts/models/**/*.js
** All other shared code between web and mobile apps should go in public/javscripts/shared/**/*.js
** When a class differs between web and mobile apps two different classes should be created (A parent prototype in public/javascripts/shared can be used to extend common parts) one inside public/javascripts/web and another one inside public/javascripts/app sharing the same interface.
