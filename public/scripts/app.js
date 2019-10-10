/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  //function to escape unsafe characters in tweets
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const createTweetElement = function(tweetObj) {
    const $tweet = $("<article>").addClass("tweet");
    const daysAgo = daysSinceTweet(tweetObj["created_at"])

    const innerHTML = `
          <header>
              <img src= ${tweetObj.user.avatars}>
              <span>${tweetObj.user.name}</span>
              <span class="handle">${tweetObj.user.handle}</span>
          </header>
          <span>${escape(tweetObj.content.text)}</span>
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
      $('section.all-tweets').prepend($tweet);
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
    const newTweetTextStr = $form.children('textarea').val();

    if (!newTweetTextStr) {
      alert("All tweets must contain at least one character. Your tweet currently does not.");
    } else if (newTweetTextStr.length > 140) {
      alert("We do not accept tweets longer than 140 characters. Your tweet is currently too long.");
    } else {

      const tweet = $form.serialize();
      $.ajax({ url: "/tweets/", method: 'POST', data: tweet })
      .then (function (successfulPost) {
        return $.ajax('/tweets', { method: 'GET' })
      })
      .then (function (allTweetsArr) {
        $form[0].reset();
        $form.children('span').text(140);
        const latestTweet = [allTweetsArr[allTweetsArr.length - 1]];
        renderTweets(latestTweet);
      })
      .fail(function (err) {
        alert(err.responseJSON.error);
      })
    }
  })

  $('#compose-new button').click(function () {
    $('section.new-tweet').slideToggle("slow");
    $('section.new-tweet textarea').focus();
  })

});
