// This file conatins all variables used with different variations of the game, and some useful functions

// Contains map width, map height, color and toolbar thickness
var m_iMap;

// Paddle Related
var m_iPaddleOne;
var m_iPaddleTwo;

// Ball
var m_iBallMain;

// Contains speed variables like menu, game
var m_iSpeed = { menu: 60, gameOriginal: 80, game: 80 };

// Contains scores like current, highest
var m_iScores = { one: 0, two: 0, highestOne: 0, highestTwo: 0};

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
var m_iKeyMap = new Array();
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
        backgroundColor: "black"
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
        soundOn: false
    };
}

// Shows start menu, based on argument.
function showStartMenu(bVisible)
{
    if (bVisible)
    {
        showPausePic(false);
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

// Paints a rectangle by pixels
function paintTile(startX, startY, width, height, color)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect(startX, startY, width, height);
}

// Paints a circle using pixels
function paintCircle(iBall, color)
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
    m_bGameStatus.paused = false;
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
            var  iNewMusicIndex = getRandomNumber(0, m_MusicList.length - 1);

            while(iNewMusicIndex == m_iPrevMusicIndex)
                iNewMusicIndex = getRandomNumber(0, m_MusicList.length - 1);

            m_iPrevMusicIndex = iNewMusicIndex;
            m_Music.background.src = m_MusicList[m_iPrevMusicIndex];
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
        m_BallMusic.play();
}

// Handles the ball hitting the wall boundaries.
function setUpBall(iBall, ballColor)
{ 
    paintCircle(iBall, m_iMap.backgroundColor);
    
    // Checks if the ball has collided with the walls
    if ((iBall.y - iBall.radius <= m_iMap.toolbarThickness && iBall.yV < 0) || (iBall.y + iBall.radius >= m_iMap.height && iBall.yV > 0))
         iBall.yV = -iBall.yV;

    if ((iBall.x - iBall.radius <= 0 && iBall.x < 0) || (iBall.x + iBall.radius >= m_iMap.width && iBall.x > 0))
        iBall.xV = -iBall.xV;
    
    iBall.x += iBall.xV;
    iBall.y += iBall.yV;

    paintCircle(iBall, ballColor);
}

// Handles setting up up paddle
function setUpPaddle(iPaddle, iAmountIncrease, sDirection)
{
    paintPaddle(iPaddle, m_iMap.backgroundColor);
    
    if (sDirection == "up")
    {
        iPaddle.topY -= iAmountIncrease;
        iPaddle.bottomY -= iAmountIncrease;
    }

    else if (sDirection == "down")
    {
        iPaddle.topY += iAmountIncrease;
        iPaddle.bottomY += iAmountIncrease;
    }

    paintPaddle(iPaddle, iPaddle.color);
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
    var iBallRadius = Math.floor(((m_iMap.width / 60) + (m_iMap.height / 30)) / 4);
    var iBallStartX = Math.floor(m_iMap.width / 2);
    var iBallStartY = Math.floor(m_iMap.height / 2);
    
    m_iBallMain = 
    {
        x: iBallStartX,
        y: iBallStartY,
        radius: iBallRadius,
        xV: iBallRadius,
        yV: iBallRadius,
        color: "blue"
    };
}
// Initializes the paddles
function initializePaddles()
{
    var iPaddleMaxV = 25;
    var iPaddleV = 10;
    var iPaddleThickness = Math.floor(m_iMap.width / 100);
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
        color: "red"
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
        color: "blue"
    };
}