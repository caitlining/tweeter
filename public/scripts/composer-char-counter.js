$(document).ready(function() {

 /**
 * Responds to input on textarea with the class new-tweet
 * Checks the length of the input to see if the 'tweetTooLong' styling class needs to be added or removed
 * Changes the text of the sibling with 'counter' class to be the current input length
 */
  $('.new-tweet textarea').on('input', function() {
    let newTweetLength = $(this).val().length;
    let nearbyCounter = $(this).siblings('.counter');
    const tweetLengthLimit = 140;

    if (newTweetLength > tweetLengthLimit) {
      nearbyCounter.addClass('tweetTooLong');
    } else if (newTweetLength <= tweetLengthLimit) {
      nearbyCounter.removeClass('tweetTooLong');
    }
    nearbyCounter.text(tweetLengthLimit - newTweetLength);
  });

});