/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

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

  const loadTweets = function () {
    $.ajax('/tweets', { method: 'GET' })
    .then(function (allTweets) {
      renderTweets(allTweets);
    })
  }

  loadTweets();

  $('.new-tweet form').submit( function (event) {
    event.preventDefault();
    const $form = $(this);
    const tweet = $form.serialize()
    $.ajax({ url: "/tweets/", method: 'POST', data: tweet })
  })
});
