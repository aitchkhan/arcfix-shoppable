# test-less

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## install heroku cli
Follow the instructions on the link for downloading and installing heroku cli:
[heroku-cli](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

## Build & development
Run for development: 
`$npm run grunt:serve`

Run for production build:
`$npm run grunt:build`

##Deployment
`$git add .`

`$git commit -m "Added a Procfile."`

`$heroku login`
Enter your Heroku credentials.
...

This creates a fresh project on heroku. This is only a one time activity.

`$heroku create`
Creating arcane-lowlands-8408... done, stack is cedar
http://arcane-lowlands-8408.herokuapp.com/ | git@heroku.com:arcane-lowlands-8408.git
Git remote heroku added

`$git push heroku develop:master`
...
-----> Node.js app detected
...
-----> Launching... done
       http://arcane-lowlands-8408.herokuapp.com deployed to Heroku
 
## Testing

Running `grunt test` will run the unit tests with karma.
`
