/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // const data = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": "https://i.imgur.com/73hZDYK.png"
  //       ,
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants. "
  //     },
  //     "created_at": 1461116232227
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@rd" },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1570391390081
  //   },
  //   {
  //     "user": {
  //       "name": "Caitlin",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@me_ing" },
  //     "content": {
  //       "text": "I am testing an additional object!"
  //     },
  //     "created_at": 1461113959088
  //   }
  // ]


  const createTweetElement = function(tweetObj) {
    const $tweet = $("<article>").addClass("tweet");
    const daysAgo = daysSinceTweet(tweetObj["created_at"])

    const innerHTML = `
          <header>
              <img src= ${tweetObj.user.avatars}>
              <span>${tweetObj.user.name}</span>
              <span class="handle">${tweetObj.user.handle}</span>
          </header>
          <span>${tweetObj.content.text}</span>
          <footer>
            <span>${daysAgo} days ago</span>
            <span class="interactOptions">PIN RETWEET HEART</span>
          </footer>
          `;

    $tweet.append(innerHTML);
    return $tweet;
  };

  const daysSinceTweet = function(epochOfTweet) {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const millisecondsInDay = 86400000;

    const timeDifference = currentTime - epochOfTweet;
    const dayDifference = timeDifference/millisecondsInDay;

    return Math.floor(dayDifference);
  }

  const renderTweets = function(tweetObjArr) {
    for (const tweet of tweetObjArr) {
      const $tweet = createTweetElement(tweet);
      $('section.all-tweets').append($tweet);
    }
  };

  // renderTweets(data);


  $('.new-tweet form').submit( function (event) {
    event.preventDefault();
    const $form = $(this);
    const tweet = $form.serialize()
    $.ajax({ url: "/tweets/", method: 'POST', data: tweet })
  })
});
