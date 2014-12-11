# Create a project in heroku.
heroku create eat-this-one

# Using mongolab.
heroku addons:add mongolab:sandbox
heroku addons:add logentries:tryit

# To manage configurations.
heroku plugins:install git://github.com/ddollar/heroku-config.git

# Set the database URI.
heroku config:set EAT_DB_URI=mongodb://eat-this-one:IMAPASSWORD@ds041248.mongolab.com:41248/heroku_app27373540

# To set 1 power unit.
heroku ps:scale web=1

# Send new release and deploy.
git push heroku master
