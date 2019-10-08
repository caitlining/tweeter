$(document).ready(function() {

  // Compass says the event should be change, keydown, keyup, blur, or keypress
  //May need to come back and change before submission

  $('.new-tweet textarea').on('input', function() {
    let newTweetLength = $(this).val().length;
    let nearbyCounter = $(this).siblings('.counter');

    if (newTweetLength > 139) {
      nearbyCounter.addClass('tweetTooLong');
    } else if (newTweetLength <= 139) {
      nearbyCounter.removeClass('tweetTooLong');
    }
    nearbyCounter.text(139 - newTweetLength);
  });

});