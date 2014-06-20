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

=System dependencies=

**sudo apt-get install git-core**
** sudo apt-get install mongodb**

** sudo npm install grunt-cli -g**
** sudo npm install express -g**
** sudo npm install bower -g**
** sudo npm install express-generator -g**
** sudo npm install cordova -g****

** git user.name '$PROJECT_AUTHOR_NAME'**
** git user.email '$PROJECT_AUTHOR_EMAIL'**

=Development setup=

* Install dependencies
**npm install**

* Configure your MondoDB database (Backend).
** **cp config.json.dist config.json**

* Configure your frontend pointing to the backend URL (Frontend).
** **public/javascripts/shared/eatConfig.js**

* Create a virtual host to point to your dist/web dir.
<VirtualHost yourhostname:80>
    DocumentRoot "/your/path/to/eat-it/dist/web"
    ServerName win
    <Directory "/your/path/to/eat-it/dist/web">
        AllowOverride All
        Order Allow,Deny
    </Directory>
</VirtualHost>

