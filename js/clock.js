function rotateClockHand () {
  // var seconds = new Date().getSeconds();
  const sdegree = (currentStep / steps) * (timerLength * 6)
  currentStep += 1
  const srotate = 'rotate(' + sdegree + 'deg)'

  if (currentStep <= steps) {
    $('#clock_hand').css({
      '-moz-transform': srotate,
      '-webkit-transform': srotate
    })
  } else {
    $('#answer_button').prop('disabled', false)
    clearInterval(countdown)
  }
}

let countdown
$('#start_timer').click(function () {
  const audio = new Audio('audio/countdown.mp3')
  audio.play()
  currentStep = 1
  countdown = setInterval(rotateClockHand, clockInterval)
  $('#start_timer').prop('disabled', true)
})
