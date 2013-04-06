// This file conatins all variables used with different variations of the game, and some useful functions

// Contains map width, map height, color and toolbar thickness
var m_iMap;
var m_iTitle;

// Credits
var m_Credits = { y: -600, startY: 100, minY: -600, yDecrease: 3, showing: false };

// Middle line
var m_iMiddleLine;

// Paddle Related
var m_iPaddleOne;
var m_iPaddleTwo;

// Paddle Directions
var m_iDirection = { up: 1, right: 2, down: 3, left: 4, none: 0};

// Flash limit, in miliseconds
var m_iFlash = { flashEnabled: false, flashMode: false, colorReseted: true, current: 0, limit: 2500 };

// Ball
var m_iBalls = new Array();
var m_iBallMax = 3;

// Contains speed variables like menu, game
var m_iSpeed = { menu: 60, gameOriginal: 33, game: 33, credits: 33 };

// Contains scores like current, highest
var m_iScores = { one: 0, highestOne: 0, two: 0, color: "white"};

// Messages alignment for toolbar
var m_iMessageAlignment;

// Contains music list like ball, background
var m_Music;

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_IntervalId = { menu: null, game: null, credits: null};

// Game status, like if it has started, which is current
var m_bGameStatus = { started: false, paused: false, single: false, multi: false};

// Keys
var m_iKeyId = { arrowUp: 38, arrowDown: 40, w: 87, s: 83, esc: 27, space: 32, m: 77, f: 70, o: 79, l: 76, h: 72};

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
    initializeLetters();
    
    alert("WARNING: If you have had epileptic seizures in the past, this game may cause one to occur again.\n\
            Play with Caution!");
    var isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
    
    if(!isChrome)
        alert("This game currently does not fully function in IE or Firefox, for best results try Google Chrome :D");

    showStartMenu(true);
}

// Starts game
function startGame(iGameVersion)
{
    if(iGameVersion == 0)
        initializeSingle();
    
    else if (iGameVersion == 1)
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
    m_CanvasContext.canvas.width = iMaxWidth = (window.innerWidth - Math.floor(window.innerWidth / 75)); 
    m_CanvasContext.canvas.height = iMaxHeight = (window.innerHeight - Math.floor(window.innerHeight / 36));
    
    m_iMap = 
    {
        height: iMaxHeight, 
        width: iMaxWidth,
        toolbarThickness: Math.floor(iMaxHeight / 25),
        backgroundColor: "black",
        originalBackgroundColor: "black",
        right: 1,
        left: -1,
        none: 0
    };
    
    m_iTitle = 
    {
        coordinates: new Array(),
        width: Math.floor(m_iMap.width / 60),
        height: Math.floor(m_iMap.height / 30),
        borderWidth: 2,
        colorMin: 1,
        colorMax: 255
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
    
    m_iMessageAlignment = 
    {
        left: 5,
        middle: Math.floor(m_iMap.width / 2),
        right: Math.floor((m_iMap.width / 2) + (m_iMap.width / 2) / 2)
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
        ballMusic = new Audio(sDirectory + "Ball.mp3");

    else
    {
        musicList = new Array(sDirectory + "Ephixia - Zelda Remix.ogg", sDirectory + "Song One.ogg", sDirectory + "Song Two.ogg", sDirectory + "Song Three.ogg");
        ballMusic = new Audio(sDirectory + "Ball.ogg"); 
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
        clearMainScreen();
        showPausePic(false);
        resetGameStatus();
        resetScores();
        setFlashEnabled(false);
        document.getElementById("startMenu").style.zIndex = 1;
        m_Credits.showing = false;
        
        if(m_IntervalId.credits != null)
        {
            window.clearInterval(m_IntervalId.credits);
            m_IntervalId.credits = null;
        }
        //m_IntervalId.menu = window.setInterval("paintStartMenu();", m_iSpeed.menu);
    }

    else
    {
        //window.clearInterval(m_IntervalId.menu);
        document.getElementById("startMenu").style.zIndex = -1; 
        clearMainScreen();
    }
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
function paintBall(iBall, color, borderColor, borderThickness)
{
    m_CanvasContext.beginPath();
    m_CanvasContext.lineWidth = borderThickness;
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.strokeStyle = borderColor;
    m_CanvasContext.arc(iBall.x, iBall.y, iBall.radius, 0, 2 * Math.PI);
    m_CanvasContext.fill();
    m_CanvasContext.stroke();
    m_CanvasContext.closePath();
}

// Paints a tile for the title
function paintTitleTile(x, y, color)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect(x * m_iTitle.width, y * m_iTitle.height, m_iTitle.width - (2 * m_iTitle.borderWidth), m_iTitle.height - (2 * m_iTitle.borderWidth));
}

function clearMainScreen()
{
    paintTile(0, 0, m_iMap.width, m_iMap.height, m_iMap.backgroundColor);
}

function paintStartMenu()
{
    for(var index = 0; index < m_iTitle.coordinates.length; index++)
        paintTitleTile(m_iTitle.coordinates[index].x, m_iTitle.coordinates[index].y, getRandomColor(m_iTitle.colorMin, m_iTitle.colorMax));
}

function initializeLetters()
{       
    // P
    m_iTitle.coordinates.push({ x: 19, y: 3});
    m_iTitle.coordinates.push({ x: 18, y: 3});
    m_iTitle.coordinates.push({ x: 17, y: 3});
    m_iTitle.coordinates.push({ x: 16, y: 3});      
    m_iTitle.coordinates.push({ x: 15, y: 3 });    // 5
    m_iTitle.coordinates.push({ x: 15, y: 4 });
    m_iTitle.coordinates.push({ x: 15, y: 5 });
    m_iTitle.coordinates.push({ x: 15, y: 6 });
    m_iTitle.coordinates.push({ x: 19, y: 6 });
    m_iTitle.coordinates.push({ x: 18, y: 6 });    // 10
    m_iTitle.coordinates.push({ x: 17, y: 6 });
    m_iTitle.coordinates.push({ x: 16, y: 6 });
    m_iTitle.coordinates.push({ x: 19, y: 7 });
    m_iTitle.coordinates.push({ x: 19, y: 8 });
    m_iTitle.coordinates.push({ x: 19, y: 9 });    // 15
    m_iTitle.coordinates.push({ x: 15, y: 9 });
    m_iTitle.coordinates.push({ x: 16, y: 9 });
    m_iTitle.coordinates.push({ x: 17, y: 9 });
    m_iTitle.coordinates.push({ x: 18, y: 9 });
    m_iTitle.coordinates.push({ x: 19, y: 9 });    // 20

    // O
    m_iTitle.coordinates.push({ x: 21, y: 3 });
    m_iTitle.coordinates.push({ x: 22, y: 3 });
    m_iTitle.coordinates.push({ x: 23, y: 3 });
    m_iTitle.coordinates.push({ x: 24, y: 3 });
    m_iTitle.coordinates.push({ x: 25, y: 3 });    // 5
    m_iTitle.coordinates.push({ x: 21, y: 4 });
    m_iTitle.coordinates.push({ x: 21, y: 5 });
    m_iTitle.coordinates.push({ x: 21, y: 6 });
    m_iTitle.coordinates.push({ x: 21, y: 7 });
    m_iTitle.coordinates.push({ x: 21, y: 8 });    // 10
    m_iTitle.coordinates.push({ x: 21, y: 9 });
    m_iTitle.coordinates.push({ x: 25, y: 4 });
    m_iTitle.coordinates.push({ x: 25, y: 5 });
    m_iTitle.coordinates.push({ x: 25, y: 6 });
    m_iTitle.coordinates.push({ x: 25, y: 7 });    // 15
    m_iTitle.coordinates.push({ x: 25, y: 8 });
    m_iTitle.coordinates.push({ x: 25, y: 9 });

    // N
    m_iTitle.coordinates.push({ x: 30, y: 3 });
    m_iTitle.coordinates.push({ x: 29, y: 3 });
    m_iTitle.coordinates.push({ x: 28, y: 3 });
    m_iTitle.coordinates.push({ x: 27, y: 4 });
    m_iTitle.coordinates.push({ x: 27, y: 5 });    // 5
    m_iTitle.coordinates.push({ x: 27, y: 6 });
    m_iTitle.coordinates.push({ x: 27, y: 7 });
    m_iTitle.coordinates.push({ x: 27, y: 8 });
    m_iTitle.coordinates.push({ x: 27, y: 9 }); 
    m_iTitle.coordinates.push({ x: 31, y: 4 });    // 10
    m_iTitle.coordinates.push({ x: 31, y: 5 });
    m_iTitle.coordinates.push({ x: 31, y: 6 });
    m_iTitle.coordinates.push({ x: 31, y: 7 });
    m_iTitle.coordinates.push({ x: 31, y: 8 });
    m_iTitle.coordinates.push({ x: 31, y: 9 });    // 15
    m_iTitle.coordinates.push({ x: 28, y: 6 });
    m_iTitle.coordinates.push({ x: 29, y: 6 });
    m_iTitle.coordinates.push({ x: 30, y: 6 });

    // G
    m_iTitle.coordinates.push({ x: 33, y: 3 });
    m_iTitle.coordinates.push({ x: 33, y: 4 });
    m_iTitle.coordinates.push({ x: 33, y: 5 });
    m_iTitle.coordinates.push({ x: 33, y: 6 });
    m_iTitle.coordinates.push({ x: 33, y: 7 });    // 5
    m_iTitle.coordinates.push({ x: 33, y: 8 });
    m_iTitle.coordinates.push({ x: 33, y: 9 });
    m_iTitle.coordinates.push({ x: 27, y: 8 });
    m_iTitle.coordinates.push({ x: 27, y: 9 });
    m_iTitle.coordinates.push({ x: 34, y: 6 });    // 10
    m_iTitle.coordinates.push({ x: 35, y: 5 });
    m_iTitle.coordinates.push({ x: 35, y: 7 });
    m_iTitle.coordinates.push({ x: 36, y: 4 });
    m_iTitle.coordinates.push({ x: 36, y: 8 });
    m_iTitle.coordinates.push({ x: 37, y: 3 });
    m_iTitle.coordinates.push({ x: 37, y: 9 });    // 15
}

function paintPaddle(iPaddle, color)
{
    paintTile(iPaddle.leftX, iPaddle.topY, iPaddle.rightX - iPaddle.leftX, iPaddle.bottomY - iPaddle.topY, color);
}

function clickedCredits()
{
    showStartMenu(false);
    m_Credits.showing = true;        
    m_IntervalId.credits = window.setInterval("showCredits();", m_iSpeed.credits);
    m_Credits.y = m_Credits.minY;
}

function showCredits()
{
    if(m_Credits.y <= m_Credits.minY)
        m_Credits.y = m_iMap.height + m_Credits.startY;
    
    paintTile(0, 0, m_iMap.width, m_iMap.height, m_iMap.backgroundColor);
    m_CanvasContext.fillStyle = "white";
    m_CanvasContext.font = (m_iMap.width / 40) + 'px san-serif';
    m_CanvasContext.textBaseline = 'bottom';
    m_CanvasContext.fillText('Head Developer: Fauzi Kliman', Math.floor(m_iMap.width / 3), m_Credits.y);
    m_CanvasContext.fillText('Assistant Developer: Pedro Morais', Math.floor(m_iMap.width / 3), m_Credits.y + 200);
    m_CanvasContext.fillText('Assistant Developer: Jacob Payne', Math.floor(m_iMap.width / 3), m_Credits.y + 400);
    m_Credits.y -= m_Credits.yDecrease;
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
    m_bGameStatus.single = false;
    m_bGameStatus.multi = false;
}

function resetScores()
{
    m_iScores.one = 0;
    m_iScores.highestOne = 0;
    m_iScores.two = 0;
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
    {
        var src = m_Music.ball.src;
        m_Music.ball = null;
        m_Music.ball = new Audio(src);
        m_Music.ball.play();
    }
}

// Handles the ball hitting the wall boundaries.
function setUpBall(iBall, ballColor)
{ 
    // Checks if the ball has collided with the walls
    if ((iBall.y - iBall.radius <= m_iMap.toolbarThickness && iBall.yV < 0) || (iBall.y + iBall.radius >= m_iMap.height && iBall.yV > 0))
         iBall.yV = -iBall.yV;

    iBall.x += iBall.xV;
    iBall.y += iBall.yV;
    paintBall(iBall, ballColor, m_iMap.backgroundColor, 3);
}

function setFlashEnabled(bEnabled)
{
    if(bEnabled)
    {
        document.getElementById("flash").style.zIndex = 3;
        document.getElementById("regular").style.zIndex = -3;
    }
    
    else
    {
        document.getElementById("flash").style.zIndex = -3;
        document.getElementById("regular").style.zIndex = 3;
    }
        
    m_iFlash.flashEnabled = bEnabled;
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
        if(m_bGameStatus.single)
            keyBoardDownSingle(event);
        
        else if (m_bGameStatus.multi)
            keyBoardDownMulti(event);
        
        if(event.keyCode == m_iKeyId.o)    // 'o' was pressed
            m_iBallMax++;
            
        if(event.keyCode == m_iKeyId.l && --m_iBallMax < 1)    // 'l' was pressed
            m_iBallMax = 1;
        
        if(event.keyCode == m_iKeyId.h && m_iBalls.length < m_iBallMax)
            m_iBalls.push(makeNewBall());
    }
    
    event.preventDefault();
    return false;
}

// Handles key up events
function doKeyUp(event)
{
    if (m_bGameStatus.started)
    {
        if(m_bGameStatus.single)
            keyBoardUpSingle(event);
        
        else if (m_bGameStatus.multi)
            keyBoardUpMulti(event);

        if (event.keyCode == m_iKeyId.m)    // 'm' was pressed.
            m_Music.soundOn = !m_Music.soundOn;
        
        else if(event.keyCode == m_iKeyId.f)    // 'f' was pressed
            setFlashEnabled(!m_iFlash.flashEnabled);
    }
    
    if(m_Credits.showing)
       if (event.keyCode == m_iKeyId.esc) // Escape was pressed
            showStartMenu(true);
    
    event.preventDefault();
    return false;
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

// Removes specified index of the array
function removeIndex(index, array)
{
    var returnArray = new Array();
    
    for(var iPos = 0; iPos < array.length; iPos++)
         if(iPos != index)
            returnArray.push(array[iPos]);
    
    return returnArray;
}

function initializeBall()
{
    m_iBalls = new Array();
    m_iBalls.push(makeNewBall());
}

function makeNewBall()
{
    var iBall;
    var iBallMaxVelocity = 20;
    var iBallRadius = Math.floor(((m_iMap.width / 60) + (m_iMap.height / 30)) / 4);
    var iBallStartX = Math.floor(m_iMap.width / 2);
    var iBallStartY = Math.floor(m_iMap.height / 2);
    
    iBall = 
    {
        x: iBallStartX,
        y: iBallStartY,
        radius: iBallRadius,
        xV: getRandomNumber(1, 10) > 5 ? iBallRadius : -iBallRadius,
        yV: getRandomNumber(1, 10) > 5 ? getRandomNumber(0, iBallRadius * 2) : -getRandomNumber(0, iBallRadius * 2),
        maxVelocity: iBallMaxVelocity,
        color: getRandomColor(1, 255),
        beforeColor: m_iMap.backgroundColor
    };
    
    return iBall;
}

// Initializes the paddles
function initializePaddles()
{
    var iPaddleV = 3;
    var iPaddleMaxV = 13;
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
        up: false,
        down: false,
        color: "white",
        originalColor: "white"
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
        color: "white",
        originalColor: "white"
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
        if(iPaddle.up)
        {
            if(iPaddle.velocity > 0)
                iPaddle.velocity = 0;
            
            if((iPaddle.velocity -= iPaddle.increaseRate) <= -iPaddle.maxV)
                iPaddle.velocity = -iPaddle.maxV;
        }
        
        else if(iPaddle.down)
        {
            if(iPaddle.velocity < 0)
                iPaddle.velocity = 0;
            
            if((iPaddle.velocity += iPaddle.increaseRate) >= iPaddle.maxV)
                iPaddle.velocity = iPaddle.maxV;
        }
        
        if((iPaddle.bottomY + iPaddle.velocity < m_iMap.height) && (iPaddle.topY + iPaddle.velocity > m_iMap.toolbarThickness))
        {
            iPaddle.topY += iPaddle.velocity;
            iPaddle.bottomY += iPaddle.velocity;
        }
    }
    
    else if(!iPaddle.up && !iPaddle.down || iPaddle.topY <= m_iMap.toolbarThickness + iCompensator || iPaddle.bottomY >= m_iMap.height - iCompensator)
        iPaddle.velocity = 0;
    
    paintPaddle(iPaddle, iPaddle.color);
}

function runBackgroundFlashing()
{
    if(m_iFlash.flashMode && m_iFlash.flashEnabled)
    {
        m_iFlash.colorReseted = false;
        m_iFlash.current += m_iSpeed.game;

        if(m_iFlash.current <= m_iFlash.limit)
        { 
            m_iMap.backgroundColor = getRandomColor(1, 255);

            for(var index = 0; index < m_iBalls.length; index++)
                m_iBalls[index].color = getRandomColor(1, 255);

            m_iMiddleLine.color = m_iMap.originalBackgroundColor;
            m_iPaddleOne.color = m_iMap.originalBackgroundColor;
            m_iPaddleTwo.color = m_iMap.originalBackgroundColor;
        }

        else
        {
            m_iFlash.flashMode = false;
            m_iFlash.current = 0;
        }
    }

    else if(!m_iFlash.flashMode || !m_iFlash.flashEnabled)
    {
        if(!m_iFlash.colorReseted)
        {
            m_iMap.backgroundColor = m_iMap.originalBackgroundColor;
            m_iFlash.colorReseted = true;
        }

        for(var index = 0; index < m_iBalls.length; index++)
            m_iBalls[index].color = getRandomColor(1, 255);

        m_iPaddleOne.color = getRandomColor(1, 255);
        m_iPaddleTwo.color = getRandomColor(1, 255);
        m_iMiddleLine.color = getRandomColor(1, 255);
    }
}
