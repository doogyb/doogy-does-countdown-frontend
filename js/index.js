import { randomLetter, randomNumber } from './random.js'
import { solveLetters } from './solutions.js'

$(function () {
  const timerLength = 30
  const steps = timerLength * 100
  const clockInterval = (1000 * timerLength) / steps

  let gameType = 'letters'

  $('#answer_display').hide()

  $('#numbers_container').hide()
  $('#number_buttons').hide()

  $('#number_selector').click(function () {
    gameType = 'numbers'

    $('#number_selector').prop('disabled', true)
    $('#letter_selector').prop('disabled', false)

    $('#numbers_container').show()
    $('#number_buttons').show()
    $('#letters_container').hide()
    $('#letter_buttons').hide()

    reset()
  })

  $('#letter_selector').on('click', function () {
    gameType = 'letters'

    $('#number_selector').prop('disabled', false)
    $('#letter_selector').prop('disabled', true)

    $('#numbers_container').hide()
    $('#number_buttons').hide()
    $('#letters_container').show()
    $('#letter_buttons').show()

    reset()
  })

  function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  let currentScramble = 0
  const scrambleLimit = 20
  let randomInt

  function randomScramble () {
    if (currentScramble <= scrambleLimit) {
      randomInt = getRandomInt(1000)
      $('#target').html(randomInt)
      currentScramble += 1
    } else {
      clearInterval(scramble)
      $('#start_timer').prop('disabled', false)
      letters += randomInt.toString()
    }
  }

  let currentStep = 1

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

  let scramble
  $('#generate').click(function () {
    currentScramble = 0
    scramble = setInterval(randomScramble, 100)
  })

  let currentLetter = 0

  function reset () {
    $('#answer_button').prop('disabled', true)
    $('#start_timer').prop('disabled', true)
    $('#answer_display').hide()
    $('.letter_button').prop('disabled', false)
    $('#generate').prop('disabled', true)

    currentLetter = 0
    letters = ''

    $('#letters')
      .children()
      .each(function () {
        $(this).find('.letter_box').text('')
      })
    $('#numbers')
      .children()
      .each(function () {
        $(this).find('.letter_box').text('')
      })
    $('#target').text('')
    $('#clock_hand').css({
      '-moz-transform': 'rotate(0deg)',
      '-webkit-transform': 'rotate(0deg)'
    })
  }

  $('#reset_timer').click(reset)

  let letters = ''

  function addLetter (letterType) {
    randomLetter(letterType.data).then(onLetterSuccess, null)
    function onLetterSuccess (data) {
      letters += data
      $('#letters')
        .children()
        .eq(currentLetter)
        .find('.letter_box')
        .text(data.toUpperCase())
      currentLetter += 1
      if (currentLetter === 9) {
        $('#start_timer').prop('disabled', false)
        $('.letter_button').prop('disabled', true)
      }
    }
  }

  function addNumber (numberType) {
    randomNumber(numberType.data).then(onNumberSuccess, null)
    function onNumberSuccess (data) {
      letters += data + ','
      $('#numbers')
        .children()
        .eq(currentLetter)
        .find('.letter_box')
        .text(data)
      currentLetter += 1
      if (currentLetter === 6) {
        $('#generate').prop('disabled', false)
        $('.letter_button').prop('disabled', true)
      }
    }
  }

  $('#vowel').click('vowel', addLetter)
  $('#consonant').click('consonant', addLetter)
  $('#large').click('large', addNumber)
  $('#small').click('small', addNumber)

  // const answerLimit = 5

  function displayLetterAnswers (data) {
    let content = "<table class='table table-hover table-striped'>"
    content += '<thead><tr>'
    const answers = []

    $.each(data, function (index, value) {
      content += "<th scope = 'col'>" + index + '</th>'
      answers.push(value)
    })
    content += '</tr></thead>'
    content += '<tbody>'

    for (let row = 0; row < 150; row++) {
      let filled = false
      let ans
      $.each(data, function (key, value) {
        if (row < value.length) {
          ans = value[row]
          filled = true
        } else {
          ans = ''
        }

        content += '<td>' + ans + '</td>'
      })
      content += '</tr>'
      if (!filled) {
        break
      }
    }

    content += '</thead></table>'
    $('#answer_display').html(content)
    $('#answer_display').show()

    $('html, body').animate(
      {
        scrollTop: $(document).height()
      },
      50
    )
  }

  function displayNumberAnswers (data) {
    console.log(data)

    let content =
      "<div class='row'><div class='number_display col d-flex justify-content-center'>"
    content += data[0] + '</div></div>'
    content +=
      "<div class='row'><div class='number_display col d-flex justify-content-center'>"
    content += data[1].replaceAll('\n', '<br>') + '</div></div>'

    $('#answer_display').html(content)
    $('#answer_display').show()

    $('html, body').animate(
      {
        scrollTop: $(document).height()
      },
      50
    )
  }

  $('#answer_button').click(function () {
    if (gameType === 'letters') {
      solveLetters(letters).then(displayLetterAnswers, null)
    }
    if (gameType === 'numbers') {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/answers/numbers/' + letters,
        contentType: 'text/plain',
        success: displayNumberAnswers
      })
    }
  })
})
