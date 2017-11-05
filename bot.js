// define the dependencies
const twit = require('twit');

const config = {
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
}

const Twitter = new twit(config);
const stream = Twitter.stream('user');

// RETWEETER

// get latest tweet
let retweet = function() {
    let params = {
        q: '#webdev, #jobs',
        result_type: 'recent',
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
        if (!err) {
          let i = 0;
          let rtId = data.statuses[i].id_str;
            // Retweet
          Twitter.post('statuses/retweet/:id', {
            id: rtId
          }, function(err, response) {
            if (response) {
              console.log('Successfully retweeted');
              rtId = data.statuses[i+1].id_str;
            }
            if (err) {
              console.log(err);
              console.log(rtId);
            }
          });
        }
        else {
          console.log('Could not search tweets.');
        }
    });
}

retweet();
// retweet every 10 minutes
setInterval(retweet, 30000);

// SAY HELLO TO NEW FOLLOWERS

// Tweet back to each new follower

// call the callback when a new follow happens
stream.on('follow', followed);

// the followed callback
function followed(event) {
  console.log('Follow Event is running');
  //get their twitter handler (screen name)
  let name = event.source.name,
    screenName = event.source.screen_name;
  // function that replies back to the user who followed
  tweetNow('@' + screenName + ' Glad to see you followed me! Good luck on the job search.');
}

// the post action
function tweetNow(tweetTxt) {
  let tweet = {
      status: tweetTxt
  }
  Twitter.post('statuses/update', tweet, function(err, data, response) {
    if(err){
      console.log(err);
    }
    else{
      console.log("Said thank you to new follower");
    }
  });
}
