'use strict';

const Twitter = require('twitter');
const io = require('socket.io').listen(2999);

const twitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET, 
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET
});

io.on('connection', function(socket){
  console.log("got a connection!");

  socket.once('disconnect', function(){
    console.log("lost a connection");
  });

});

const twitterStream = twitter.stream(
  'statuses/filter',
  {
    track: "@united"
  },
  function(twitterStream){
    twitterStream.on(
      'data',
      function(tweet){
        if (!tweet.user){ 
          console.log(tweet);
          return;
        }
        const simplifiedTweet = {
          date: tweet.created_at,
          text: tweet.text,
          user: {
            name: tweet.user.name,
            screen_name: tweet.user.screen_name
          }
        };
        io.emit('tweet', simplifiedTweet)
      }
    );

    twitterStream.on(
      'error',
      function(err){
        oonsole.log(err);
        console.log(err.message);
      }
    );
  }
);
