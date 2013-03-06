// This file conatins all variables used with different variations of the game, and some useful functions

// Contains map width, map height, color and toolbar thickness
var m_iMap;

// Middle line
var m_iMiddleLine;

// Paddle Related
var m_iPaddleOne;
var m_iPaddleTwo;

// Paddle Directions
var m_iDirection = { up: 1, right: 2, down: 3, left: 4, none: 0};

// Ball
var m_iBallMain;

// Contains speed variables like menu, game
var m_iSpeed = { menu: 60, gameOriginal: 33, game: 33 };

// Contains scores like current, highest
var m_iScores = { one: 0, two: 0, highestOne: 0, highestTwo: 0, color: "white"};

// Messages alignment for toolbar
var m_iMessageAlignment;

// Contains music list like ball, background
var m_Music;

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_IntervalId = { menu: null, game: null};

// Game status, like if it has started, which is current
var m_bGameStatus = { started: false, paused: false, multi: false};

// Keys
var m_iKeyId = { arrowUp: 38, arrowDown: 40, w: 87, s: 83, esc: 27, space: 32};

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
document.addEventListener("DOMContentLoaded", initializeGame, false);
document.documentElement.style.overflowX = 'hidden';	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = 'hidden';     // Vertical scrollbar will be hidden

// Initialize canvas
function initializeGame()
{
    setUpMusic();
    setCanvasSize();
    setUpLetters();
    
    m_iMessageAlignment = 
    {
        left: 5,
        middle: Math.floor(m_iMap.width / 2),
        right: Math.floor((m_iMap.width / 2) + (m_iMap.width / 2) / 2)
    };
    
    var isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
    
    if(!isChrome)
        alert("This game currently does not fully function in IE or Firefox, for best results try Google Chrome :D");

    showStartMenu(true);
}

// Starts game
function startGame(iGameVersion)
{
    if (iGameVersion == 1)
        initializeMulti();
}

// Changes gamespeed
function changeGameSpeed(intervalID, sFunction,gameSpeed)
{
    window.clearInterval(intervalID);
    intervalID = window.setInterval(sFunction, gameSpeed);

    return intervalID;
}

// Sets the canvas as big as the broswer size
function setCanvasSize()
{
    var iMaxWidth;
    var iMaxHeight;
    m_CanvasContext = document.getElementById("myCanvas").getContext("2d");
    
    // The more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined')
    {
        iMaxWidth = window.innerWidth;
        iMaxHeight = window.innerHeight;
    }
    
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
		&& typeof document.documentElement.clientWidth != 'undefined'
		&& document.documentElement.clientWidth != 0)
    {
        iMaxWidth = document.documentElement.clientWidth;
        iMaxHeight = document.documentElement.clientHeight;
    }

    // Older versions of IE
    else
    {
        iMaxWidth = document.getElementsByTagName('body')[0].clientWidth;
        iMaxHeight = document.getElementsByTagName('body')[0].clientHeight;
    }
    
    m_iMap = 
    {
        height: iMaxHeight, 
        width: iMaxWidth,
        toolbarThickness: Math.floor(iMaxHeight / 25),
        toolbarColor: "black",
        backgroundColor: "black",
        right: 1,
        left: -1,
        none: 0
    };
    
    var iMiddleX = Math.floor((m_iMap.width / 2) - (m_iMap.width / 250));
    var iMiddleHeight = Math.floor(m_iMap.height / 25);
    
    m_iMiddleLine = 
    {
        x: iMiddleX,
        width: (Math.floor(m_iMap.width / 2) - iMiddleX) * 2, 
        height: iMiddleHeight,
        spaceInBetween: 25,
        color: "gray"
    };
    
    m_CanvasContext.canvas.width = m_iMap.width;
    m_CanvasContext.canvas.height = m_iMap.height -= Math.floor(m_iMap.height/100);
}

// Sets up the music
function setUpMusic()
{
    var a = document.createElement('audio');
    var sDirectory = "assets/music/";
    var musicList = new Array(sDirectory + "Ephixia - Zelda Remix.mp3", sDirectory + "Song One.mp3", sDirectory + "Song Two.mp3", sDirectory + "Song Three.mp3");
    var iPrevIndex = getRandomNumber(0, musicList.length - 1);
    var ballMusic;
            
    // Sets up music
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
        ballMusic = new Audio(sDirectory + "Food.mp3");

    else
    {
        musicList = new Array(sDirectory + "Ephixia - Zelda Remix.ogg", sDirectory + "Song One.ogg", sDirectory + "Song Two.ogg", sDirectory + "Song Three.ogg");
        ballMusic = new Audio(sDirectory + "Food.ogg"); 
    }
	
    m_Music = 
    {
        musicList: musicList,
        prevIndex: iPrevIndex,
        background: new Audio(musicList[iPrevIndex]),
        ball: ballMusic,
        soundOn: true
    };
}

// Shows start menu, based on argument.
function showStartMenu(bVisible)
{
    if (bVisible)
    {
        paintTile(0, m_iMap.toolbarThickness, m_iMap.width, m_iMap.height - m_iMap.toolbarThickness, m_iMap.backgroundColor);
        showPausePic(false);
        resetGameStatus();
        resetScores();
        document.getElementById("startMenu").style.zIndex = 1;        
        m_IntervalMenu = window.setInterval("paintStartMenu();", m_iSpeed.menu);
    }

    else
    {
        document.getElementById("startMenu").style.zIndex = -1;
        window.clearInterval(m_IntervalMenu);
        paintToolbar(m_iMap.toolbarColor);
        paintTile(0, m_iMap.toolbarThickness, m_iMap.width, m_iMap.height - m_iMap.toolbarThickness, m_iMap.backgroundColor);
    }
}

// Paints toolbar back to regular
function paintToolbar(color)
{
    paintTile(0, 0, m_iMap.width, m_iMap.toolbarThickness, color);
}

// Paint the line in the middle
function paintMiddleLine()
{
    for(var y = m_iMap.toolbarThickness; y < m_iMap.height; y += m_iMiddleLine.height + m_iMiddleLine.spaceInBetween)
        paintTile(m_iMiddleLine.x, y, m_iMiddleLine.width, m_iMiddleLine.height, m_iMiddleLine.color);
}

// Paints a rectangle by pixels
function paintTile(startX, startY, width, height, color)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect(startX, startY, width, height);
}

// Paints a circle using pixels
function paintBall(iBall, color)
{
    m_CanvasContext.beginPath();
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.arc(iBall.x, iBall.y, iBall.radius, 0, 2 * Math.PI);
    m_CanvasContext.stroke();
    m_CanvasContext.closePath();
    m_CanvasContext.fill();
}

function paintStartMenu()
{
    // Paints Whole screen black
    paintTile(0, 0, m_iMap.width, m_iMap.height, m_iMap.color);
}

function paintPaddle(iPaddle, color)
{
    paintTile(iPaddle.leftX, iPaddle.topY, iPaddle.rightX - iPaddle.leftX, iPaddle.bottomY - iPaddle.topY, color);
}

// Shows pause pause if true, otherwise hides it.
function showPausePic(bVisible)
{
    if (bVisible)
        document.getElementById("pause").style.zIndex = 1;

    else
        document.getElementById("pause").style.zIndex = -1;
}

// Sets the sound on pause on visible
function setSoundPicVisible(bOn)
{
    m_Music.soundOn = bOn;

    if (m_Music.soundOn)
    {
        document.getElementById("soundOn").style.zIndex = 1;
        document.getElementById("soundOff").style.zIndex = -1;
    }

    else
    {
        document.getElementById("soundOn").style.zIndex = -1;
        document.getElementById("soundOff").style.zIndex = 1;
    }
}

// Writes message to corresponding tile, with specified colour
function writeMessage(startTile, message, color)
{
    m_CanvasContext.font = (m_iMap.toolbarThickness - 10)  + 'pt Calibri';
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillText(message, startTile, m_iMap.toolbarThickness - 5);
}

// Resets the status's about the game
function resetGameStatus()
{
    m_bGameStatus.started = false;
    m_bGameStatus.isPaused = false;
    m_bGameStatus.multi = false;
}

function resetScores()
{
    m_iScores.one = 0;
    m_iScores.two = 0;
    m_iScores.highestOne = 0;
    m_iScores.highestTwo = 0;
}

// Plays background music if mute is off
function playBackgroundMusic()
{
    
    if (m_Music.soundOn)
    {
        if (m_Music.background.ended)
        {
            var  iNewMusicIndex = getRandomNumber(0, m_Music.musicList.length - 1);

            while(iNewMusicIndex == m_Music.prevIndex)
                iNewMusicIndex = getRandomNumber(0, m_Music.musicList.length - 1);

            m_Music.prevIndex = iNewMusicIndex;
            m_Music.background.src = m_Music.musicList[m_Music.prevIndex];
        }

        m_Music.background.play();
    }

    else
        m_Music.background.pause();
}

// Stops background music
function stopBackgroundMusic()
{
    m_Music.background.pause();
}

// Plays food music
function playBallMusic()
{
    if(m_Music.soundOn)
        m_Music.ball.play();
}

// Handles the ball hitting the wall boundaries.
function setUpBall(iBall, ballColor)
{ 
    paintBall(iBall, m_iMap.backgroundColor);
    
    // Checks if the ball has collided with the walls
    if ((iBall.y - iBall.radius <= m_iMap.toolbarThickness && iBall.yV < 0) || (iBall.y + iBall.radius >= m_iMap.height && iBall.yV > 0))
         iBall.yV = -iBall.yV;

    iBall.x += iBall.xV;
    iBall.y += iBall.yV;

    paintBall(iBall, ballColor);
}

// Handles increasing the speed variable
function increaseSpeed(iGameSpeed)
{
    return (1.0 / ((1.0 / iGameSpeed) + 0.002));
}

// Handles the changing direction of the snake.
function doKeyDown(event) {

    if (m_bGameStatus.started && !m_bGameStatus.isPaused)
    {
        if (m_bGameStatus.multi)
            keyBoardDownMulti(event);
    }
}

// Handles key up events
function doKeyUp(event)
{
    if (m_bGameStatus.started)
    {
        if (m_bGameStatus.multi)
            keyBoardUpMulti(event);

        if (event.keyCode == 77)    // 'm' was pressed.
            m_Music.soundOn = !m_Music.soundOn;
    }
}

// Returns random color between iMin and iMax.
function getRandomColor(iMin, iMax)
{
    // creating a random number between iMin and iMax
    var r = getRandomNumber(iMin, iMax);
    var g = getRandomNumber(iMin, iMax);
    var b = getRandomNumber(iMin, iMax);

    // going from decimal to hex
    var hexR = r.toString(16);
    var hexG = g.toString(16);
    var hexB = b.toString(16);

    // making sure single character values are prepended with a "0"
    if (hexR.length == 1)
        hexR = "0" + hexR;

    if (hexG.length == 1)
        hexG = "0" + hexG;

    if (hexB.length == 1)
        hexB = "0" + hexB;

    // creating the hex value by concatenatening the string values
    var hexColor = "#" + hexR + hexG + hexB;
    return hexColor.toUpperCase();
}

// Returns random number between iMin and iMax.
function getRandomNumber(iMin, iMax)
{
    return Math.floor((Math.random() * (iMax - iMin)) + iMin);
}

function setUpLetters()
{
} 

function initializeBall()
{
    var iBallMaxVelocity = 20;
    var iBallRadius = Math.floor(((m_iMap.width / 60) + (m_iMap.height / 30)) / 4);
    var iBallStartX = Math.floor(m_iMap.width / 2);
    var iBallStartY = Math.floor(m_iMap.height / 2);
    
    m_iBallMain = 
    {
        x: iBallStartX,
        y: iBallStartY,
        radius: iBallRadius,
        xV: getRandomNumber(0, 10) > 5 ? iBallRadius: -iBallRadius,
        yV: getRandomNumber(0, 10) > 5 ? iBallRadius: -iBallRadius,
        maxVelocity: iBallMaxVelocity,
        color: "white"
    };
}

// Initializes the paddles
function initializePaddles()
{
    var iPaddleV = 3;
    var iPaddleMaxV = 24;
    var iPaddleThickness = Math.floor(m_iMap.width / 75);
    var iPaddleLenght = Math.floor(m_iMap.height / 4);
    var iPaddleDistance = 5;
    
    m_iPaddleOne = 
    {
        leftX: iPaddleDistance,
        rightX: iPaddleDistance + iPaddleThickness,
        topY: Math.floor(m_iMap.height / 2) - Math.floor(iPaddleLenght / 2),
        bottomY: Math.floor(m_iMap.height / 2) + Math.floor(iPaddleLenght / 2),
        velocity: iPaddleV,
        increaseRate: iPaddleV,
        maxV: iPaddleMaxV,
        up: false,
        down: false,
        color: "white"
    };
    
    m_iPaddleTwo = 
    {
        leftX: m_iMap.width - iPaddleThickness - iPaddleDistance,
        rightX: m_iMap.width - iPaddleDistance,
        topY: Math.floor(m_iMap.height / 2) - Math.floor(iPaddleLenght / 2),
        bottomY: Math.floor(m_iMap.height / 2) + Math.floor(iPaddleLenght / 2),
        velocity: iPaddleV,
        increaseRate: iPaddleV,
        maxV: iPaddleMaxV,
        up: false,
        down: false,
        color: "white"
    };
}

// Checks if the ball hit the first paddle
function hitPaddleOne(iBall)
{
    // Checks if the ball hit the paddle
    if(iBall.y + iBall.radius >= m_iPaddleOne.topY && iBall.y - iBall.radius <= m_iPaddleOne.bottomY)
       if(iBall.x - iBall.radius <= m_iPaddleOne.rightX && iBall.x - iBall.radius >= m_iPaddleOne.leftX && iBall.xV < 0)
           return true;
     
    return false;
}

// Checks if the ball hit the second paddle
function hitPaddleTwo(iBall)
{
    // Checks if the ball hit the paddle
    if(iBall.y + iBall.radius >= m_iPaddleTwo.topY && iBall.y - iBall.radius <= m_iPaddleTwo.bottomY)
       if(iBall.x + iBall.radius >= m_iPaddleTwo.leftX && iBall.x + iBall.radius <= m_iPaddleTwo.rightX && iBall.xV > 0)
            return true;
     
    return false;
}

// Checks if the ball went out of bounds
function outOfBounds(iBall)
{
    if(iBall.x - iBall.radius > m_iMap.width)
        return m_iMap.right;
    
    if(iBall.x + iBall.radius < 0)
        return m_iMap.left;
    
    return m_iMap.none;
}

// Handles changing ball direction if it paddle, including ball direction modification.
function ballDirectionChanger(iBall, iPaddle)
{
    iBall.xV = -iBall.xV;
    iBall.yV += iPaddle.velocity;
    
    if(iBall.yV > iBall.maxVelocity)
        iBall.yV = iBall.maxVelocity;
    
    else if(iBall.yV < -iBall.maxVelocity)
        iBall.yV = -iBall.maxVelocity;
}

// Moves the paddles
function movePaddle(iPaddle)
{
    var iCompensator = 10;
    
    if(iPaddle.up || iPaddle.down)
    {
        paintPaddle(iPaddle, m_iMap.backgroundColor);
        
        if(iPaddle.up)
        {
            if(iPaddle.velocity > 0)
                iPaddle.velocity = 0;
            
            if((iPaddle.velocity -= iPaddle.increaseRate) <= -iPaddle.maxV)
                iPaddle.velocity = -iPaddle.maxV;
            
            if(iPaddle.topY + iPaddle.velocity > m_iMap.toolbarThickness)
            {
                iPaddle.topY += iPaddle.velocity;
                iPaddle.bottomY += iPaddle.velocity;
            }
        }
        
        else if(iPaddle.down)
        {
            if(iPaddle.velocity < 0)
                iPaddle.velocity = 0;
            
            if((iPaddle.velocity += iPaddle.increaseRate) >= iPaddle.maxV)
                iPaddle.velocity = iPaddle.maxV;
            
            if(iPaddle.bottomY + iPaddle.velocity < m_iMap.height)
            {
                iPaddle.topY += iPaddle.velocity;
                iPaddle.bottomY += iPaddle.velocity;
            }
        }
    }
    
    else if(!iPaddle.up && !iPaddle.down || iPaddle.topY <= m_iMap.toolbarThickness + iCompensator || iPaddle.bottomY >= m_iMap.height - iCompensator)
        iPaddle.velocity = 0;
    
    paintPaddle(iPaddle, iPaddle.color);
}