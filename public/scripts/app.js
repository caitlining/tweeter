/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  /**
   * Takes in a string
   * Prevents XSS by converting the string to a text node
   * Returns the inner HTML of the created text node
   */
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  /**
   * Takes in a new tweet object
   * Returns a new html article, with all tweet information organized into correct elements
   */
  const createTweetElement = function(tweetObj) {
    const $tweet = $("<article>").addClass("tweet");
    const daysAgo = daysSinceTweet(tweetObj["created_at"]);

    const innerHTML = `
          <header>
              <img src= ${tweetObj.user.avatars}>
              <span>${tweetObj.user.name}</span>
              <span class="handle">${tweetObj.user.handle}</span>
          </header>
          <span>${escape(tweetObj.content.text)}</span>
          <footer>
            <span>${daysAgo} days ago</span>
            <span class="interactOptions"><i class="fab fa-font-awesome-flag"></i><i class="fas fa-retweet"></i><i class="fas fa-heart"></i></span>
          </footer>
          `;

    $tweet.append(innerHTML);
    return $tweet;
  };

  /**
   * Takes a date in epoch time
   * Returns the whole number of days difference between the input time and current date
   */
  const daysSinceTweet = function(epochOfTweet) {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const millisecondsInDay = 86400000;

    const timeDifference = currentTime - epochOfTweet;
    const dayDifference = timeDifference / millisecondsInDay;

    return Math.floor(dayDifference);
  };

  /**
   * Takes an array of tweet objects
   * Runs each tweet object through our createTweetElement function
   * Prepends each returned tweet element to the html section with class 'all-tweets'
   */
  const renderTweets = function(tweetObjArr) {
    for (const tweet of tweetObjArr) {
      const $tweet = createTweetElement(tweet);
      $('section.all-tweets').prepend($tweet);
    }
  };

  /**
   * Makes a GET request to the tweet database
   * Runs the returned tweet array through our renderTweets function
   */
  const loadTweets = function() {
    $.ajax('/tweets/', { method: 'GET' })
      .then(function(allTweets) {
        renderTweets(allTweets);
      });
  };

  loadTweets();

  /**
   * Triggered on submission of the form with the class 'new-tweet'
   * Empties and slides up any existing error messages
   * Checks the length of the text being submitted and runs error messages if necessary
   * If no errors from text length, makes POST request with form text to /tweets/
   * Then makes a GET request to /tweets/
   * Then resets the form and uses our renderTweets function to add the new tweet to the page 
   */
  $('.new-tweet form').submit(function(event) {
    event.preventDefault();
    $('.new-tweet p').empty().slideUp();
    const $form = $(this);
    const newTweetTextStr = $form.children('textarea').val();

    if (!newTweetTextStr) {
      $('.new-tweet p').append('<b>Error:</b> All tweets must contain at least one character. Your tweet currently does not.');
      setTimeout(() => {
        $('.new-tweet p').slideDown();
      }, 600);
    } else if (newTweetTextStr.length > 140) {
      $('.new-tweet p').append("<b>Error:</b> We do not accept tweets longer than 140 characters. Your tweet is currently too long.");
      setTimeout(() => {
        $('.new-tweet p').slideDown();
      }, 600);
    } else {
      const tweet = $form.serialize();
      $.ajax({ url: "/tweets/", method: 'POST', data: tweet })
      .then (function(successfulPost) {
        return $.ajax('/tweets/', { method: 'GET' })
      })
      .then (function(allTweetsArr) {
        $form[0].reset();
        $form.children('span').text(140);
        const latestTweet = [allTweetsArr[allTweetsArr.length - 1]];
        renderTweets(latestTweet);
      })
      .fail(function(err) {
        alert(err.responseJSON.error);
      })
    }
  })

  /**
   * Triggered on click of the button with id 'compose-new'
   * Toggles the html section with the class 'new-tweet'
   * Focuses on the text area of the html section with the class 'new-tweet'
   */
  $('#compose-new button').click(function() {
    $('section.new-tweet').slideToggle("slow");
    $('section.new-tweet textarea').focus();
  });

});
