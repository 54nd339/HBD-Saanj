var flag = false
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
    }
    else {
        if(!flag){
            $('#link').fadeOut('fast',
            () => $('#tips').fadeIn('slow'))
            flag = true
        }
    }
}

var currentPlayer
function EvalSound(soundobj) {
    if(soundobj === 'stop') {
        currentPlayer.pause()
        currentPlayer.currentTime = 0
        return
    }
    var thissound = $('#'+soundobj).get(0)
    if(currentPlayer && currentPlayer != thissound)
        currentPlayer.pause()
    if (thissound.paused)
        thissound.play()
    if (currentPlayer != thissound)
        thissound.currentTime = 0
    currentPlayer = thissound
}

function setURL(url){
    $('#view').attr('src', url)
}
function check() {
    if(screen.width >= 720)
        setURL('Assets/Blank.html')
    else
        setURL('https://www.youtube.com/embed/zdXiSlRrgWQ?list=PLu4obm2oOEJ3sUG3aUsTNEmZXdjlopXT4&autoplay=1&loop=1')
}
function resize() {
    var x = $('#menu')
    if(screen.width < 720)
        x.removeClass('btn-group-lg')
    else 
        x.addClass('btn-group-lg')
}

function code() {
    const codes = []; var x = $('#game-code')
    x.removeClass('text-success').addClass('text-white')
    codes[0] = localStorage.getItem('2048Code') == null ? '#' : localStorage.getItem('2048Code')
    codes[1] = localStorage.getItem('DinoCode') == null ? '#' : localStorage.getItem('DinoCode')
    codes[2] = localStorage.getItem('MixCode') == null ? '#' : localStorage.getItem('MixCode')
    codes[3] = localStorage.getItem('SnakeCode') == null ? '#' : localStorage.getItem('SnakeCode')
    codes[4] = localStorage.getItem('WordCode') == null ? '#' : localStorage.getItem('WordCode')
    x.text('Use full screen for better experience.\nYour Code Pieces are : '+codes)

    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
    if(countOccurrences(codes, '#') == 0){
        x.append('\n Rearrange them to get the final code.')
        x.removeClass('text-white').addClass('text-success')
    }
}
onload = () => {
    setTimeout(() => { EvalSound('Music1') }, 1000)
    resize(); code()
    $('#start').click()
}
function compareText(ele) {
    var text = $('#text').val()
    if (text.toUpperCase() === '5A4NJ' || text.toUpperCase() === '54ANJ') {
        setURL('Assets/Text/')
        EvalSound('Music2')
        setTimeout(() => { EvalSound('stop') }, 70000)
        toggle(ele, 'secret')
        $('#special').removeClass('disabled')
    } else 
        alert('Invalid Code. Access Denied. Try Again.')
}
function checkEnter(event, ele, text) {
    if (event.key === 'Enter') {
        compareText(ele)
        return false
    }
}