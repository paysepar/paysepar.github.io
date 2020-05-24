/********************************************************
By Payam Paysepar, last updated 10/11/2015


API: Functions, objects, and methods...


function drawCanvas()
// Function that clears canvas and draw contents repeatedly until animations are complete. Returns null.

function Instrument(name, keyCode, audioFile)
// Instrument object constructor with the name <string> of the instrument, the keyCode <integer> of the keyboard key that plays the instrument and the link to the instrument audio audioFile <string>. When an instrument is initialized, it randomly chooses a sound and animation to play whenever its .playSound() method is called.
    .playSound() method plays the sound corresponding to the instrument
    .playAnimation() plays the animation corresponding to the instrument

function Animations(numberOfConcurrentAnimations)
// Constructor for Animations object, which has an array of individual animationObjects and has methods for drawing the animations. numberOfConcurrentAnimations is the maximum number of animations to be concurrently drawn on the screen.
    .isOngoing() method checks if any animations are still being drawn
    .add(animationObject) method takes an animationObject as an argument and adds it to the array of animations

function ShootingStar(x, y, duration, radius)
// Constructor for shooting star animation object. Added to animations object through the animations.add method. Parameters are the x,y starting coordinates relative to the canvas, the duration of the animation in milliseconds, and the radius of the star in pixels.
    .draw() method draws the animation on canvas
    .isOngoing() method checks whether the animation is still being drawn

function TwinkleStar(x, y, duration, maxRadius)
// Twinkle star animation object. Added to animations object through the animations.add method. Parameters are the x,y starting coordinates relative to the canvas, the duration of the animation in milliseconds, and the radius of the star in pixels.
    .draw() method draws the animation on canvas
    .isOngoing() method checks whether the animation is still being drawn

function Firework(x, y, duration, maxRadius, color)
// Firework animation object. Added to the animations object through the animations.add method. Parameters are the x,y starting coordinates relative to the canvas, the duration of the animation in milliseconds, the radius of the firework in pixels, and rgb color of the firework (rgb colors must be a string formatted as 'r,g,b')
    .draw() method draws the animation on canvas
    .isOngoing() method checks whether the animation is still being drawn

function drawButton(instrument, index)
// Function that draws button that plays an instrument when touched or clicked. Location of the button is based on index <integer>, which is the instrument's position in the array of active instruments. Returns null.

********************************************************/



var socket = io() // socket io connection object
socket.emit('getAvailableInstruments')
var blankInstrumentAddOption = document.getElementById('blankInstrumentAddOption')
var blankInstrumentRemoveOption = document.getElementById('blankInstrumentRemoveOption')
var availableInstrumentsSelector = document.getElementById('availableInstrumentsSelector')
socket.on('availableInstrumentsList', function(instruments) {
    for (var i = 0; i < instruments.length; i++) {
        var option = document.createElement('option')
        option.text = instruments[i].name
        option.value = instruments[i].url
        availableInstrumentsSelector.add(option)
    }
})
var canvas = document.getElementById('canvas')
var context = canvas.getContext("2d")
var animations = new Animations(10) // instantiate Animations object
animations.add(new ShootingStar(0, 0, 800, 3)) // Instantiate ShootingStar object and add to animations array
animations.add(new Firework(150, 70, 1000, 50))
animations.add(new TwinkleStar(400, 400, 2000, 30))

var currentInstruments = new Array
currentInstruments.push(new Instrument('Bass Drum', 'A'.charCodeAt(0), "http://freewavesamples.com/files/Bass-Drum-1.wav"))
currentInstruments.push(new Instrument('Cymbal Crash', 'S'.charCodeAt(0), "http://freewavesamples.com/files/Crash-Cymbal-1.wav"))
currentInstruments.push(new Instrument('Closed Hi-Hat', 'D'.charCodeAt(0), "http://freewavesamples.com/files/Closed-Hi-Hat-1.wav"))
currentInstruments.push(new Instrument('Open Hi-Hat', 'F'.charCodeAt(0), "http://freewavesamples.com/files/Ensoniq-SQ-1-Open-Hi-Hat.wav"))

drawCanvas() // begin animation
function drawCanvas() { // clear canvas and draw contents repeatedly until animations are complete
    context.clearRect(0, 0, canvas.width, canvas.height)
    animations.draw()
    for (var i  = 0; i < currentInstruments.length; i++) { // draw instrument play buttons
        drawButton(currentInstruments[i], i)
    }
    if (animations.isOngoing()) {
        requestAnimationFrame(drawCanvas)
    }
    // if the animations are not ongoing, drawCanvas() stops being called. there is no need to clear the canvas because the animations.draw() method clears the canvas whenever it finds an animation that is no longer ongoing
}

var canvasTop = canvas.getBoundingClientRect().top // get the coordinates of the top left corner of the canvas relative to the browser window
var canvasLeft = canvas.getBoundingClientRect().left

canvas.addEventListener("mousedown", touchMouseClickHandling, false) // mouseclick handling
canvas.addEventListener('touchstart', touchMouseClickHandling, false)
function touchMouseClickHandling(event) {
    var canvasX = event.clientX - canvasLeft // transform the click event coordinates into coordinates of the canvas element
    var canvasY = event.clientY - canvasTop
    var radius = Math.floor((canvas.width > canvas.height) ? canvas.height/12 : canvas.width/12)
    for (var i = 0; i < currentInstruments.length; i++) {
        var xposButton = radius*2 + (radius*3) * i
        var yposButton = canvas.height - radius*2
        if (canvasX > (xposButton - radius) &&
           canvasX < (xposButton + radius) &&
           canvasY > (yposButton - radius) &&
           canvasY < (yposButton + radius) ) { // check whether the click/tap happened inside the bounds of one of the buttons
            currentInstruments[i].playSound()
            currentInstruments[i].playAnimation()
        }
    }
}
canvas.addEventListener('ondblclick', function(event) {
    event.preventDefault()
}, false) // prevent doubleclicking
canvas.addEventListener('touchmove', function(event) {
    event.preventDefault()
}, false) // prevent default touch dragging function (scrolling down page)

function drawButton(instrument, index) { // draw button corresponding to an instrument
    var radius = Math.floor((canvas.width > canvas.height) ? canvas.height/12 : canvas.width/12)
    var xpos = radius*2 + (radius*3) * index
    var ypos = canvas.height - radius*2
    var fontSize = Math.floor(radius*0.75)
    var name = instrument.name
    var playKey = String.fromCharCode(instrument.keyCode)
    var instrumentIconDim = radius
    var instrumentIconImage = document.getElementById(instrument.name)
    // draw the button:
    context.fillStyle = "#000"
    context.strokeStyle = "#fff"
    context.lineWidth = (radius < 25) ? 3 : 7
    context.beginPath()
    context.arc(xpos, ypos, radius, 0, 2 * Math.PI)
    context.stroke()
    context.fill()
    context.drawImage(instrumentIconImage, xpos-instrumentIconDim/2, ypos-instrumentIconDim/2, instrumentIconDim, instrumentIconDim)
    context.font = fontSize + "px sans-serif"
    context.fillStyle = "#fff"
    context.fillText(playKey, xpos + fontSize/2, ypos + fontSize/2)
}

function Animations(numberOfConcurrentAnimations) { // constructor for Animations object, which has an array of individual animationObjects and has methods for drawing the animations. numberOfConcurrentAnimations is the maximum number of animations to be concurrently drawn on the screen.
    this.animationObjects = new Array(numberOfConcurrentAnimations)
    this.add = function(newAnimationObject) { // add new animation to beginning of array and remove last animation
        this.animationObjects.unshift(newAnimationObject)
        this.animationObjects.pop()
    }
    this.draw = function() { // draws animations. whenever an animation's .isOnGoing() method returns true
        for (var i = 0; i < this.animationObjects.length; i++) {
            if (!!this.animationObjects[i]) {
                if (this.animationObjects[i].isOngoing()) {
                    this.animationObjects[i].draw()
                }
                else { // if an animation is no longer ongoing, set the reference to the animation to null and clear the canvas
                    this.animationObjects[i] = null
                    context.clearRect(0, 0, canvas.width, canvas.height)
                }
            }
        }
    }
    this.isOngoing = function() { // checks whether animations are still ongoing
        for (var i = 0; i < this.animationObjects.length; i++) {
            if (!!this.animationObjects[i]) { // if this.animationObjects[i] is not, not null
                return true
            }
        }
        return false // if all the animation objects were null, the function exits the for loop and gets to this line and returns false
    }
}

function adjustCanvasSize() { // adjust canvas height and width
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight * 0.7
    drawCanvas()
}

function isOngoing(animations) { // checks whether animations in animations array are still being drawn
    for (var i = 0; i < animations.length; i++) {
        if (animations[i].isOngoing()) {
            return true
        }
        else {return false}
    }
}
function ShootingStar(x, y, duration, radius) { // constructor for shooting star animation object
    this.startTime = new Date().getTime()
    this.x = x
    this.y = y
    this.currentX = x
    this.currentY = y
    this.duration = duration
    this.radius = radius
    this.draw = function() { // updates current position and draws the ShootingStar on canvas
        var currentTime = new Date().getTime()
        var elapsedTime = currentTime - this.startTime
        context.fillStyle = "#fff"
        this.currentX = this.x + (canvas.width-this.x) * elapsedTime/duration
        this.currentY = this.y + canvas.height * elapsedTime/duration
        context.beginPath()
        context.arc(this.currentX, this.currentY, this.radius, 0, 2 * Math.PI)
        context.fill()
    }
    this.isOngoing = function() { // checks whether the ShootingStar is off the canvas and returns boolean
        if ((this.currentX - this.radius) < canvas.width && (this.currentY - this.radius) < canvas.height) {
            return true
        }
        else {return false}
    }
}
function TwinkleStar(x, y, duration, maxRadius) { // twinkle star animation object
    this.startTime = new Date().getTime()
    this.x = x
    this.y = y
    this.duration = duration // duration of twinkle in millis
    this.maxRadius = maxRadius
    this.currentRadius
    this.draw = function() { // updates parameters for drawing the twinkle star and draws the twinkle star on canvas
        var currentTime = new Date().getTime()
        var elapsedTime = currentTime - this.startTime
        if (elapsedTime < duration * 0.75) {
            this.currentRadius = (-this.maxRadius/Math.pow((this.duration/2*0.75),2))*Math.pow((elapsedTime-this.duration/2*0.75),2) + this.maxRadius // this equation models the size of the star using a parabola
            if (this.currentRadius > 0) {
                context.fillStyle = "#fff"
                context.beginPath() // begin tracing star shape
                context.moveTo(this.x + this.currentRadius/5, this.y + this.currentRadius/5)
                context.lineTo(this.x, this.y + this.currentRadius)
                context.lineTo(this.x - this.currentRadius/5, this.y + this.currentRadius/5)
                context.lineTo(this.x - this.currentRadius, this.y)
                context.lineTo(this.x - this.currentRadius/5, this.y - this.currentRadius/5)
                context.lineTo(this.x, this.y - this.currentRadius)
                context.lineTo(this.x + this.currentRadius/5, this.y - this.currentRadius/5)
                context.lineTo(this.x + this.currentRadius, this.y)
                context.lineTo(this.x + this.currentRadius/5, this.y + this.currentRadius/5)
                context.fill()
            }
        }
        if (elapsedTime > duration*0.25) {
            this.currentRadius = (-this.maxRadius/Math.pow((this.duration/2*0.75),2))*Math.pow((elapsedTime-this.duration/2*0.75-this.duration/4),2) + this.maxRadius // duration/4 is subtracted from the elapsedTime after the elapsedTime passes duration/4; this models the second twinkle
            if (this.currentRadius > 0) { // don't draw if the radius < 0
                context.fillStyle = "#fff"
                context.beginPath() // begin tracing star shape
                context.moveTo(this.x, this.y + this.currentRadius/5/1.4) // 1.4 ~= sqrt(2)
                context.lineTo(this.x-this.currentRadius/1.4, this.y + this.currentRadius/1.4)
                context.lineTo(this.x - this.currentRadius/5/1.4, this.y)
                context.lineTo(this.x - this.currentRadius/1.4, this.y - this.currentRadius/1.4)
                context.lineTo(this.x, this.y - this.currentRadius/5/1.4)
                context.lineTo(this.x + this.currentRadius/1.4, this.y - this.currentRadius/1.4)
                context.lineTo(this.x + this.currentRadius/5/1.4, this.y)
                context.lineTo(this.x + this.currentRadius/1.4, this.y + this.currentRadius/1.4)
                context.lineTo(this.x, this.y + this.currentRadius/5/1.4)
                context.fill()
            }
        }
    }
    this.isOngoing = function() {
        var currentTime = new Date().getTime()
        var elapsedTime = currentTime - this.startTime
        if (elapsedTime > this.duration) {
            return false
        }
        else {return true}
    }
}
function Firework(x, y, duration, maxRadius, color) { // plays a firework animation on the canvas with a given x, y position, duration, maximum radius, and rgb colors (rgb colors must be a string formatted as 'r,g,b')
    this.startTime = new Date().getTime()
    this.x = x
    this.y = y
    this.duration = duration
    this.maxRadius = maxRadius
    this.color = color
    this.currentRadius
    this.elapsedTime
    this.draw = function() { // updates parameters for drawing the firework and draws it on canvas
        var currentTime = new Date().getTime()
        this.elapsedTime = currentTime - this.startTime
        this.currentRadius = -1/(this.elapsedTime/duration) + maxRadius
        if (this.currentRadius > 0) {
            for (var i = 0; i < 12; i++) {
                var angleOfFirework = 2*Math.PI/12*i
                context.fillStyle = "rgba(" + color + "," +  Math.pow(1 - Math.pow(this.elapsedTime/this.duration, 2), .5)*Math.random() + ")" // using graph of sqrt(1-x^2) to model the decrease in opacity of the firework. Multiply by Math.random() to cause flicker effect
                context.beginPath()
                context.arc(this.x + this.currentRadius*Math.cos(angleOfFirework), this.y + this.currentRadius*Math.sin(angleOfFirework), 5, 0, 2 * Math.PI) // individual circles that make up firework are placed along circle with radius=maxRadius and center at (x,y)
                context.fill()
            }
        }
    }
    this.isOngoing = function() {
        var currentTime = new Date().getTime()
        var elapsedTime = currentTime - this.startTime
        if (elapsedTime > this.duration) {
            return false
        }
        else {return true}
    }
}


function CircleGrow(x, y, duration, maxRadius) { // circle grow animation object
    this.startTime = new Date().getTime()
    this.x = x
    this.y = y
    this.duration = duration // duration of growth in millis
    this.maxRadius = maxRadius
    this.currentRadius
    this.draw = function() { // updates parameters for drawing the circle and draws it on canvas
        var currentTime = new Date().getTime()
        var elapsedTime = currentTime - this.startTime
        this.currentRadius = (-this.maxRadius/Math.pow((this.duration/2),2))*Math.pow((elapsedTime-this.duration/2),2) + this.maxRadius
        if (this.currentRadius > 0) {
            context.fillStyle = "#fff"
            context.beginPath()
            context.arc(this.x, this.y, this.currentRadius, 0, 2 * Math.PI)
            context.fill()
        }
    }
    this.isOngoing = function() {
        var currentTime = new Date().getTime()
        var elapsedTime = currentTime - this.startTime
        if (elapsedTime > this.duration) {
            return false
        }
        else {return true}
    }
}

window.addEventListener('load', adjustCanvasSize) // call makeCanvasProperSize on page load
window.addEventListener('resize', adjustCanvasSize) // call makeCanvasProperSize function whenever window is resized



// Instrument object constructor
function Instrument(name, keyCode, audioFile) { // create an instrument object with the name <string> of the instrument, the keyCode <integer> of the keyboard key that plays the instrument and the link to the instrument audio audioFile <string>
    this.name = name
    this.keyCode = keyCode
    this.audioFile = audioFile
    this.firstPlay = true // used to prevent audio from looping when key is continuously held down
    this.audioElement
    canvas.insertAdjacentHTML('afterEnd', "<audio id = 'audioElement" + currentInstruments.length + "' src = " + audioFile + " class = 'instrumentAudio'></audio>") // insert instrument audio into the page HTML
    blankInstrumentRemoveOption.insertAdjacentHTML('afterEnd', "<option value = '" + this.audioFile + "' " + "playKeyCode = '" + this.keyCode + "'" + ">" + this.name + " (" + String.fromCharCode(this.keyCode) + ")" + "</option>") // insert instrument into list of instruments in the instrument removal selector
    this.audioElement = document.getElementById('audioElement' + currentInstruments.length)
    this.audioElement.load() // load audio sound into memory
    this.playSound = function() { // plays sound of instrument
        if (this.audioElement.paused) {
            this.audioElement.play()
        }
        else {
            this.audioElement.currentTime = 0
        }
    }
    var animationRandomizer = Math.floor(Math.random() * 3) // random integer from 0 to 2 to choose animation
    if (animationRandomizer === 0) {
        var shootingStarY = 0
        var shootingStarDuration = 500
        var shootingStarRadius = 2
            this.playAnimation = function() {
                var shootingStarX = Math.floor(Math.random() * (canvas.width/2))
                animations.add(new ShootingStar(shootingStarX, shootingStarY, shootingStarDuration, shootingStarRadius)) // random placement of shooting star doesnt work because x position of shooting star does not depend on previous x position in calculation, only on time
                drawCanvas()
            }
    }
    if (animationRandomizer === 1) {

        var fireworkDuration = 500
        this.playAnimation = function() { // random (x,y) coordinates and color and radius whenever animation is played
            var fireworkColor = Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255)
            var fireworkRadius = Math.floor(Math.random()*100) + 50
            var fireworkX = Math.floor(Math.random()*(canvas.width-fireworkRadius*2)) + fireworkRadius
            var fireworkY = Math.floor(Math.random()*(canvas.height*0.75-fireworkRadius*2)) + fireworkRadius // keep fireworks in the top 3/4 of the screen
            animations.add(new Firework(fireworkX, fireworkY, fireworkDuration, fireworkRadius, fireworkColor))
            drawCanvas()
        }
    }
    if (animationRandomizer === 2) {
        var twinkleStarRadius = Math.floor(Math.random()*10) + 5
        var twinkleStarDuration = 500
        this.playAnimation = function() { // random (x,y) coordinate whenever animation is played
            var twinkleStarX = Math.floor(Math.random()*(canvas.width-twinkleStarRadius)) + twinkleStarRadius
            var twinkleStarY = Math.floor(Math.random()*(canvas.height*0.6-twinkleStarRadius)) + twinkleStarRadius // keep the twinkle stars in the top 6/10 of the screen
            animations.add(new TwinkleStar(twinkleStarX, twinkleStarY, twinkleStarDuration, twinkleStarRadius))
            drawCanvas()
        }
    }
}

// Adding instruments
addInstrumentButton.onclick = function() {
    var availableInstrumentsSelector = document.getElementById('availableInstrumentsSelector')
    var name = availableInstrumentsSelector[availableInstrumentsSelector.selectedIndex].text
    if (name !== '' && document.getElementById('audioFilePlayKeyInput').value !== '') {
        var audioFile = availableInstrumentsSelector.value
        var inputtedKeyCode = document.getElementById('audioFilePlayKeyInput').value.charCodeAt(0)
        var keyCode = (inputtedKeyCode >= 97 && inputtedKeyCode <= 122) ? (inputtedKeyCode - 32) : inputtedKeyCode
        availableInstrumentsSelector.selectedIndex = 0
        document.getElementById('audioFilePlayKeyInput').value = ''
        currentInstruments.push(new Instrument(name, keyCode, audioFile))
        drawCanvas() //draw canvas so that the instrument button is drawn
    }
    else {
        alert('Select an instrument and keyboard assignment, then click on the + button to add that instrument')
    }
}

removeInstrumentButton.onclick = function() {
    var instrumentRemovalSelector = document.getElementById('currentInstrumentsRemovalSelector')
    var selectedInstrumentURL = instrumentRemovalSelector.value
    if (selectedInstrumentURL !== '') {
        var selectedInstrumentKeyCode = instrumentRemovalSelector[instrumentRemovalSelector.selectedIndex].getAttribute('playKeyCode')
        for (var i = 0; i < currentInstruments.length; i++) {
            if (currentInstruments[i].audioFile == selectedInstrumentURL && currentInstruments[i].keyCode == selectedInstrumentKeyCode) {
                currentInstruments.splice(i, 1)
                // add line to remove the removed instrument from the instrument removal selector
                instrumentRemovalSelector.remove(instrumentRemovalSelector.selectedIndex)
                drawCanvas()
            }
        }
    }
    else {
        alert('Select an instrument to remove and then click the - button to remove that instrument.')
    }
}

// Keyboard presses
document.onkeydown = function(event) { // while a keyboard key is pressed down, this function loops
    for (i = 0; i < currentInstruments.length; i++) {
            if (event.keyCode === currentInstruments[i].keyCode && currentInstruments[i].firstPlay)
            {
                currentInstruments[i].playSound()
                currentInstruments[i].playAnimation()
                currentInstruments[i].firstPlay = false // set firstPlay1 to false after first playback of audio, so that the function will not loop audio if key is held down (onkeydown function loops while keys are pressed down)
            }
    }
}

document.onkeyup = function(event) { // reset firstPlay after key is released
    for (i = 0; i < currentInstruments.length; i++) {
            if (event.keyCode === currentInstruments[i].keyCode) {
                currentInstruments[i].firstPlay = true // set firstPlay1 to false after first playback of audio, so that the function will not loop audio if key is held down (onkeydown function loops when keys are held)
            }
    }
}