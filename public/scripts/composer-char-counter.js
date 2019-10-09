$(document).ready(function() {

  // Compass says the event should be change, keydown, keyup, blur, or keypress
  //May need to come back and change before submission

  $('.new-tweet textarea').on('input', function() {
    let newTweetLength = $(this).val().length;
    let nearbyCounter = $(this).siblings('.counter');
    const tweetLengthLimit = 140

    if (newTweetLength > tweetLengthLimit) {
      nearbyCounter.addClass('tweetTooLong');
    } else if (newTweetLength <= tweetLengthLimit) {
      nearbyCounter.removeClass('tweetTooLong');
    }
    nearbyCounter.text(tweetLengthLimit - newTweetLength);
  });

});