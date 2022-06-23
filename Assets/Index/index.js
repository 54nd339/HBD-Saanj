let active, activeq = '#link'
function toggle(ele, id) {
    active = $('#'+id)
    $('.tab-pane[style*="display: block"]').fadeOut('fast',
        () => active.fadeIn('slow'))
    $('.menu.active').removeClass('active')

    if($(ele).hasClass('menu')) {
        if(activeq === '#tips') {
            $('#tips').fadeOut('fast',
            () => $('#link').fadeIn('slow'))
            activeq = '#link'
        }
        $(ele).addClass('active')
    }
    else {
        if(activeq === '#link') {
            $('#link').fadeOut('fast',
            () => $('#tips').fadeIn('slow'))
            activeq = '#tips'
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

let player, wasYT = false, isLoaded = false
function shuffled() {
    if(screen.width < 720 && isClicked) {
        isClicked = false
        sbToggle()
    }
    if(!wasYT){
        $('#view').fadeOut('300', () => {
            if(!isLoaded) {
                $('#YT').attr('src', 'https://www.youtube.com/iframe_api')
                isLoaded = true
            }
            else onYouTubePlayerAPIReady()
        })
        wasYT = true
    }
    else {
        $('#player').fadeOut('fast', () =>{
            player.destroy()
            setTimeout(onYouTubePlayerAPIReady, 10)
        })
    }
}
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        playerVars: { 
            'autoplay': 1,
            'autohide': 1,
            'rel': 0,
            'modestbranding': 1,
            'loop': 1,
            'origin': 'https://54nd339.github.io' || 'https://www.youtube.com'
        },
        events: {
            'onReady': event => {
                $('#player').fadeIn('slow')
                event.target.loadPlaylist({
                    listType:'playlist',
                    list:'PLu4obm2oOEJ3sUG3aUsTNEmZXdjlopXT4',
                    index: Math.floor((Math.random() * 20) + 1)
                })
                setTimeout(() => player.setShuffle(true), 1000);
            }
        }
    })
}

function setURL(ele, url) {
    if(screen.width < 720 && isClicked && !$(ele).hasClass('menu')) {
        isClicked = false
        sbToggle()
    }
    let viewPort = $('#view')
    if(wasYT) {
        viewPort.attr('src', url)
        setTimeout(() => $('#player').fadeOut('fast'), 100)
        player.destroy()
        wasYT = false
    }
    else viewPort.fadeOut('fast', () => viewPort.attr('src', url))
    viewPort.fadeIn('slow')
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

let sBar = true, isClicked = false
function slideRight() {
    $('#sidebar').animate({ width: 'toggle' }, 500, () => {
        $(active).fadeIn()
        $(activeq).fadeIn()
    })
}
function slideLeft() {
    $(activeq).fadeOut()
    $(active).fadeOut(() =>
        $('#sidebar').animate({ width: 'toggle' }, 500))
}
function sbToggle() {
    $('#frm-container').fadeToggle('fast', () =>
    $('#sidebar').animate({ height: 'toggle' }, 'fast'))
}
function bToggle(ele) {
    if(screen.width > 720){
        if(window.fscr) {
            sBar ? slideLeft() : slideRight()
            sBar = sBar ? false : true
        }
        else ele.href = '#header'
    }
    else {
        isClicked = true
        sbToggle()
    }
}
function hfToggle() {
    $('#header').animate({ height: 'toggle' }, 500)
    $('#footer').animate({ height: 'toggle' }, 500)
}

window.fscr = false
function exitFsc(ele) {
    document.documentElement.removeAttribute('class')
    if(!sBar) slideRight()
    $('#content').removeClass('mt-2').addClass('mt-3')
    ele.innerHTML = '<i class="fa-solid fa-expand"></i>'
    window.fscr = false
}
function goFsc(ele) {
    setTimeout(() => document.documentElement.setAttribute('class','stuck'), 1000)
    slideLeft(); sBar = false
    $('#content').removeClass('mt-3').addClass('mt-2')
    ele.innerHTML = '<i class="fa-solid fa-compress"></i>'
    window.fscr = true
}
function fsToggle(ele) {
    hfToggle()
    if(document.fullscreenElement) {
        document.exitFullscreen()
        exitFsc(ele)
    }
    else {
        document.documentElement.requestFullscreen()
        goFsc(ele)
    }
}

addEventListener('fullscreenchange', () => {
    if(window.fscr && !document.fullscreenElement){
        exitFsc($('#fscr').get(0))
        hfToggle()
    }
})
addEventListener("resize", resize)
addEventListener("storage", code, false)