let flag = false
function toggle(ele, id) {
    $('.tab-pane[style*="display: block"]').fadeOut('fast',
        () => $('#'+id).fadeIn('slow'))
    $('.menu.active').removeClass('active')

    if($(ele).hasClass('menu')) {
        if(flag){
            $('#tips').fadeOut('fast',
            () => $('#link').fadeIn('slow'))
            flag = false
        }
        $(ele).addClass('active')
    } else {
        if(!flag){
            $('#link').fadeOut('fast',
            () => $('#tips').fadeIn('slow'))
            flag = true
        }
    }
}

let currentPlayer, isMuted = false
function EvalSound(soundobj) {
    if(soundobj === 'stop') {
        currentPlayer.pause()
        currentPlayer.currentTime = 0
        return
    }
    let thissound = $('#'+soundobj).get(0)
    if(currentPlayer && currentPlayer != thissound)
        currentPlayer.pause()
    if(currentPlayer != thissound || currentPlayer.paused) {
        thissound.currentTime = 0
        thissound.play()
    }
    currentPlayer = thissound
    currentPlayer.muted = isMuted
}
function EvalMute(ele) {
    ele.innerHTML = isMuted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-low"></i>'
    isMuted = isMuted ? false : true
    currentPlayer.muted = isMuted
}

function shuffled() {
    let rand = Math.floor((Math.random() * 20) + 1)
    $('#yt'+rand).click()
}

function setURL(url){ $('#view').attr('src', url) }
function check() {
    setURL(screen.width >= 720 ? 'Assets/Index/Blank.html'
    : 'https://www.youtube.com/embed/zdXiSlRrgWQ?list=PLu4obm2oOEJ3sUG3aUsTNEmZXdjlopXT4&autoplay=1&loop=1')
}
function resize() {
    screen.width < 720
        ? $('#menu').removeClass('btn-group-lg')
        : $('#menu').addClass('btn-group-lg')
}
function code() {
    const codes = []
    let game = $('#game-code')
    game.removeClass('text-success').addClass('text-white')
    codes[0] = localStorage.getItem('2048Code') == null ? '#' : localStorage.getItem('2048Code')
    codes[1] = localStorage.getItem('DinoCode') == null ? '#' : localStorage.getItem('DinoCode')
    codes[2] = localStorage.getItem('MixCode') == null ? '#' : localStorage.getItem('MixCode')
    codes[3] = localStorage.getItem('SnakeCode') == null ? '#' : localStorage.getItem('SnakeCode')
    codes[4] = localStorage.getItem('WordCode') == null ? '#' : localStorage.getItem('WordCode')
    game.text('Your Code Pieces are : '+codes)

    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
    if(countOccurrences(codes, '#') == 0) {
        game.append('\n Rearrange them to get the final code.')
        game.removeClass('text-white').addClass('text-success').css('border','solid 1px #198754')
    }
}

function showAlert() {
	const alert = document.createElement('div')
	alert.textContent = 'Invalid Code. Access Denied. Try Again.'
	alert.classList.add('alert')
	$('[data-alert-container]').prepend(alert)

    setTimeout(() => {
        alert.classList.add('hide')
        alert.addEventListener('transitionend', alert.remove())
    }, 5000)
}
function accessText() {
    if ($('#passcode').val() === btoa('5A4nj')) {
        $('.passcode').fadeOut('fast', () => {
            $.when(setTimeout(() => {
                new Audio('Assets/Music/Meow/enter.mp3').play()
            }, 1000)).then(() => $('#start').click())
            $('#main-content').fadeIn(2500)
            $('.cats').slideUp(2000, () => {
                $('html, body').animate({
                    scrollTop: $('.trigger').offset().top+0.45
                }, 500)
            })
        })
        resize(); code()
    }
    else showAlert()
}
function compareText(ele) {
    let text = $('#text').val()
    if (text.toUpperCase() === '5A4NJ' || text.toUpperCase() === '54ANJ') {
        setURL('Assets/Text/')
        EvalSound('Music2')
        setTimeout(() => { EvalSound('stop') }, 70000)
        toggle(ele, 'secret')
        $('#special').removeClass('disabled')
    }
    else showAlert()
}
function checkEnter(event, ele, text) {
    if (event.key === 'Enter') {
        (text === 'passcode') ? accessText() : compareText(ele)
        return false
    }
}

let sBar = false
function bToggle(ele) {
    if(window.fscr) {
        if(sBar) {
            sBar = false
            $('#sidebar').removeClass('d-lg-block')
        } else {
            sBar = true
            $('#sidebar').addClass('d-lg-block')
        }
    }
    else ele.href = '#header'
}

window.fscr = false
function exitFsc(ele) {
    document.documentElement.removeAttribute('class')
    $('#header').css('display', 'block')
    $('#footer').css('display', 'block')
    $('#sidebar').addClass('d-lg-block')
    $('#content').removeClass('mt-2').addClass('mt-3')
    ele.innerHTML = '<i class="fa-solid fa-expand"></i>'
    window.fscr = false
}
function goFsc(ele) {
    setTimeout(() => document.documentElement.setAttribute('class','stuck'), 100)
    $('#header').css('display', 'none')
    $('#footer').css('display', 'none')
    $('#sidebar').removeClass('d-lg-block')
    $('#content').removeClass('mt-3').addClass('mt-2')
    ele.innerHTML = '<i class="fa-solid fa-compress"></i>'
    window.fscr = true
}
function fsToggle(ele) {
    if(document.fullscreenElement) {
        document.exitFullscreen()
        exitFsc(ele)
    } else {
        document.documentElement.requestFullscreen()
        goFsc(ele)
    }
}

addEventListener('fullscreenchange', () => {
    if(window.fscr && !document.fullscreenElement)
        exitFsc($('#fscr').get(0))
})
addEventListener("resize", resize)
addEventListener("storage", code, false)