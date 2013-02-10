// This file conatins all variables used with different variations of the game, and some useful functions

// Map Related
var m_iMapWidth = 60;
var m_iMapHeight = 30;
var m_iTileWidth;
var m_iTileHeight;
var m_iMaxPixelWidth;
var m_iMaxPixelHeight;
var m_iToolBarThickness;

// All colors/ borders
var m_iBackgroundBorderWidth = 0;
var m_iPaddleBorderWidth = 0;
var m_iBallBorderWidth = 0;
var m_cBackgroundColor = "#000";
var m_cBallColorMain = "#000";
var m_cPaddleColorMain = "blue";

// Paddle Lengths Related
var m_iPaddleIncreaseOriginal = 10;
var m_iPaddleIncreaseRate = 10;
var m_iPaddleWidth;
var m_iPaddleOriginalLength = 7;
var m_iPaddleStartY;

// Paddle One Related
var m_iPaddeOneID = 1;
var m_iPaddleIncreaseOne = m_iPaddleIncreaseOriginal;
var m_iPaddleStartXOne = 0;
var m_iPaddleOne = { x: m_iPaddleStartXOne, startY: m_iPaddleStartY, endY: m_iPaddleStartY + (m_iPaddleOriginalLength * m_iTileHeight) };

// Paddle Two Related
var m_iPaddeTwoID = 2;
var m_iPaddleIncreaseTwo = m_iPaddleIncreaseOriginal;
var m_iPaddleStartXTwo = m_iMapWidth - 1;
var m_iPaddleTwo = { x: m_iPaddleStartXTwo, startY: m_iPaddleStartY, endY: m_iPaddleStartY + (m_iPaddleOriginalLength * m_iTileHeight) };

// Game speed
var m_iMenuSpeed = 60;
var m_iGameSpeedOriginal = 80;
var m_iGameSpeedMain = m_iGameSpeedOriginal;

// Score
var m_iScoreOne = 0;
var m_iScoreTwo = 0;
var m_iHighestScoreOne = 0;
var m_iHighestScoreTwo = 0;

// Fast Speed
var m_iFastDivider = 4;
var m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);
var m_bFastMode = false;

// Ball
var m_iBallRadiusOriginal = ((m_iTileHeight + m_iTileWidth) / 2) / 2;
var m_cBallColorMain = "#FFF";
var m_iBallMain = { x: m_iMaxPixelWidth / 2, y: m_iMaxPixelHeight / 2, r: m_iBallRadiusOriginal, xV: 30, yV: 30 };//dr: "downRight"};

// Messages alignment
var m_iLeft;
var m_iMiddle;
var m_iRight;

// Teleporting Blocks
var m_cTeleporterColors = new Array("white", "red", "blue", "yellow", "green");
var m_iTeleporters = new Array()
var m_iTeleporteMax = 5;

// Sound Related
var m_sDirectory = "assets/music/";
var m_MusicList = new Array(m_sDirectory + "Ephixia - Zelda Remix.mp3", m_sDirectory + "Song One.mp3", m_sDirectory + "Song Two.mp3", m_sDirectory + "Song Three.mp3");
var m_iPrevMusicIndex = getRandomNumber(0, m_MusicList.length - 1);
var m_BallMusic = new Audio(m_sDirectory + "Food.mp3");
var m_BackgroundMusic = new Audio(m_MusicList[m_iPrevMusicIndex]);
var m_bSoundOn = true;

// Lettering
var m_cP = new Array(20);
var m_cO = new Array(17);
var m_cN = new Array(18);
var m_cG = new Array(15);

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_IntervalMenu;
var m_IntervalIDMain;

// Game version related.
var m_iGameVersion = 0;
var m_bGameStarted = false;
var m_bMulti = false;
var m_bIsPaused = false;
var m_bShownYet = false;

// Keys
var m_iKeyMap = new Array();
var m_iArrowUpID = 38;
var m_iArrowDownID = 40;
var m_iWID = 87;
var m_iSID = 83;
var m_iEscID = 27;
var m_iSpaceID = 32;

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
document.addEventListener("DOMContentLoaded", initializeCanvas, false);
document.documentElement.style.overflowX = 'hidden';	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = 'hidden';     // Vertical scrollbar will be hidden

// Initialize canvas
function initializeCanvas()
{
    // Get canvas context for drawing, add events
    m_CanvasContext = document.getElementById("myCanvas").getContext("2d");
    setCanvasSize();
    setUpLetters();
    m_iToolBarThickness = m_iTileHeight;
    m_iBallRadiusOriginal = ((m_iTileHeight + m_iTileWidth) / 2) / 2;
    m_iBallMain = { x: (m_iMapWidth * m_iTileWidth) / 2, y: (m_iMapHeight * m_iTileHeight) / 2, r: m_iBallRadiusOriginal, xV: 30, yV: 30 };
    m_iPaddleWidth = m_iTileWidth - 10;
    m_iPaddleStartXOne = 1;
    m_iPaddleStartXTwo = m_iMaxPixelWidth - m_iPaddleWidth;
    m_iPaddleStartY = Math.floor((m_iMaxPixelHeight / 2) - ((m_iPaddleOriginalLength * m_iTileHeight) / 2));

    var isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
    
    if(!isChrome)
        alert("This game currently does not fully function in IE or Firefox, for best results try Google Chrome :D");

    showStartMenu(true);
}

// Starts game
function startGame(iGameVersion)
{
    m_iGameVersion = iGameVersion;

    if (m_iGameVersion == 1)
        initializeMulti();

    m_iGameVersion = 1;
}

// Changes gamespeed
function changeGameSpeed(intervalID, sFunction,gameSpeed)
{
    window.clearInterval(intervalID);
    intervalID = window.setInterval(sFunction, gameSpeed);

    return intervalID;
}

// Sets the canvas as big as the broswer size.
function setCanvasSize()
{
    m_iTileWidth = Math.floor((window.innerWidth / m_iMapWidth));
    m_iTileHeight = Math.floor((window.innerHeight / m_iMapHeight)) - 1;
    m_CanvasContext.canvas.width = (m_iTileWidth * m_iMapWidth);
    m_CanvasContext.canvas.height = (m_iTileHeight * m_iMapHeight);
    m_iMaxPixelWidth = m_CanvasContext.canvas.width;
    m_iMaxPixelHeight = m_CanvasContext.canvas.height;
    m_iLeft = 1;
    m_iMiddle = Math.floor((m_iMapWidth / 2) - 6);
    m_iRight = Math.floor((m_iMapWidth) - 10);
}

// Paints a rectangle by pixels
function paintRawTile(startX, startY, width, height, color, borderThickness)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect(startX + borderThickness, startY + borderThickness, width - (borderThickness * 2), height - (borderThickness * 2));
}

// Paints a circle using pixels
function paintRawCircle(x, y, radius, color)
{
    m_CanvasContext.beginPath();
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.arc(x, y, radius, 0, 2 * Math.PI);
    m_CanvasContext.stroke();
    m_CanvasContext.closePath();
    m_CanvasContext.fill();
}

// Shows start menu, based on argument.
function showStartMenu(bVisible)
{
    if (!m_bShownYet && bVisible)
    {
        document.getElementById("startMenu").style.zIndex = 1;
        m_IntervalMenu = window.setInterval("paintStartMenu();", m_iMenuSpeed);
        m_bShownYet = true;
    }

    else
    {
        document.getElementById("startMenu").style.zIndex = -1;
        window.clearInterval(m_IntervalMenu);
        m_bShownYet = false;
    }
}

function paintStartMenu()
{
    // Paints Whole screen black
    paintRawTile(0, 0, m_iMaxPixelWidth, m_iMaxPixelHeight, m_cBackgroundColor, m_iBackgroundBorderWidth);

    var tempArray = m_cP.concat(m_cO, m_cN, m_cG);

    for (var index = 0; index < tempArray.length; index++)
        paintRawTile(tempArray[index].x * m_iTileWidth, tempArray[index].y * m_iTileHeight, m_iTileWidth, m_iTileHeight, getRandomColor(1, 255), 1);
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
    m_bSoundOn = bOn;

    if (m_bSoundOn)
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

// Sets the fast pause visible
function setFastPicVisible(bVisible)
{
    m_bFastMode = bVisible;

    if (m_bFastMode)
    {
        document.getElementById("fastMode").style.zIndex = 1;
        document.getElementById("slowMode").style.zIndex = -1;
    }

    else {
        document.getElementById("fastMode").style.zIndex = -1;
        document.getElementById("slowMode").style.zIndex = 1;
    }
}

// Hides fast pic, show slow pic
function hideFastPic()
{
    document.getElementById("fastMode").style.zIndex = -1;
    document.getElementById("slowMode").style.zIndex = -1;
}

// Writes message to corresponding tile, with specified colour
function writeMessage(startTile, color, message)
{
    m_CanvasContext.fillStyle = 'white';
    m_CanvasContext.fillRect(startTile * m_iTileWidth, 0, message.length * 12, m_iTileHeight);
    m_CanvasContext.font = '16pt Calibri';
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillText(message, startTile * m_iTileWidth, 20);
}

// Plays background music if mute is off
function playBackgroundMusic()
{
    if (m_bSoundOn)
    {
        if (m_BackgroundMusic.ended)
        {
            var  iNewMusicIndex = getRandomNumber(0, m_MusicList.length - 1);

            while(iNewMusicIndex == m_iPrevMusicIndex)
                iNewMusicIndex = getRandomNumber(0, m_MusicList.length - 1);

            m_iPrevMusicIndex = iNewMusicIndex;
            m_BackgroundMusic.src = m_MusicList[m_iPrevMusicIndex];
        }

        m_BackgroundMusic.play();
    }

    else
        m_BackgroundMusic.pause();
}

// Resets background music to zero
function resetBackgroundMusic()
{
    m_BackgroundMusic.currentTime = 0;
}

// Stops background music
function stopBackgroundMusic()
{
    m_BackgroundMusic.pause();
}

// Plays food music
function playFoodMusic()
{
    if(m_bSoundOn)
        m_FoodMusic.play();
}

// Checks if the snake it a teleporter, if so teleports it
function runTeleporters(iBall)
{
    for (var index = 0; index < m_iTeleporters.length; index++)
    {
        if (iBall.x == m_iTeleporters[index].x && iBall.y == m_iTeleporters[index].y)
        {
            if (index % 2 == 0)
            {
                index++;
                iBall.x = m_iTeleporters[index].x;
                iBall.y = m_iTeleporters[index].y;
            }

            else
            {
                index--;
                iBall.x = m_iTeleporters[index].x;
                iBall.y = m_iTeleporters[index].y;
            }
        }
    }
}

// Creates a pair of teleporters
function createTeleportingBlocks()
{
    var teleporterColor = m_cTeleporterColors[m_iTeleporters.length / 2];
    var newTeleporterA = { x: getRandomNumber(2, m_iMapWidth - 2), y: getRandomNumber(2, m_iMapHeight - 2), color: teleporterColor };
    m_iTeleporters.push(newTeleporterA);
    var newTeleporterB = { x: getRandomNumber(2, m_iMapWidth - 2), y: getRandomNumber(2, m_iMapHeight - 2), color: teleporterColor };
    m_iTeleporters.push(newTeleporterB);
}

// Sets up the snake body based on direction
function setUpBall(iBall, ballColor, iPaddleOne, iPaddleTwo)
{
    paintRawCircle(iBall.x, iBall.y, iBall.r, ballColor);

    // Checks if the ball has collided
    if (iBall.y <= m_iToolBarThickness || iBall.y >= m_iMaxPixelHeight)
        iBall.yV = -iBall.yV;

    if (iBall.x <= 0 || iBall.x >= m_iMaxPixelWidth)
        iBall.xV = -iBall.xV;

    if (iBall.x == iPaddleOne.x + 1 && iBall.y >= iPaddleOne.startY && iBall.y <= iPaddleOne.endY)
        iBall.xV = -iBall.xV;

    if (iBall.x == iPaddleTwo.x - 1 && iBall.y >= iPaddleTwo.startY && iBall.y <= iPaddleTwo.endY) 
        iBall.xV = -iBall.xV;

    iBall.x += iBall.xV;
    iBall.y += iBall.yV;

    paintRawCircle(iBall.x, iBall.y, iBall.r, ballColor);
}

// Handles setting up up paddle
function setUpPaddle(paddleBody, iAmountIncrease, sDirection)
{
    if (sDirection == "up")
    {
        paintRawTile(paddleBody.x * m_iTileWidth, paddleBody.startY, m_iPaddleWidth, paddleBody.endY - paddleBody.startY, m_cBackgroundColor, m_iBackgroundBorderWidth);
        paddleBody.startY -= iAmountIncrease;
        paddleBody.endY -= iAmountIncrease;paintRawTile(paddleBody.x * m_iTileWidth, paddleBody.startY, m_iPaddleWidth, paddleBody.endY - paddleBody.startY, m_cPaddleColorMain, m_iPaddleBorderWidth);
    }

    else if (sDirection == "down")
    {
        paintRawTile(paddleBody.x * m_iTileWidth, paddleBody.startY, m_iPaddleWidth, paddleBody.endY - paddleBody.startY, m_cBackgroundColor, m_iBackgroundBorderWidth);
        paddleBody.startY += iAmountIncrease;
        paddleBody.endY += iAmountIncrease;
    }

    paintRawTile(paddleBody.x * m_iTileWidth, paddleBody.startY, m_iPaddleWidth, paddleBody.endY - paddleBody.startY, m_cPaddleColorMain, m_iPaddleBorderWidth);
}

// Handles increasing the speed variable
function increaseSpeed(iGameSpeed)
{
    return (1.0 / ((1.0 / iGameSpeed) + 0.002));
}

// Handles the changing direction of the snake.
function doKeyDown(event) {

    if (m_bGameStarted && !m_bIsPaused)
    {
        if (m_bMulti)
            keyBoardDownMultiplayer(event);
    }
}

// Handles key up events
function doKeyUp(event)
{
    if (m_bGameStarted)
    {
        if (m_bMulti)
            keyBoardUpMultiplayer(event);

        if (event.keyCode == 77)    // 'm' was pressed.
            m_bSoundOn = !m_bSoundOn;
    }
}

// Returns random color between iMin and iMax.
function getRandomColor(iMin, iMax)
{
    // creating a random number between iMin and iMax
    var r = getRandomNumber(iMin, iMax)
    var g = getRandomNumber(iMin, iMax)
    var b = getRandomNumber(iMin, iMax)

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

// Capitalizes first leter of string.
function capitalizeFirst(sArg)
{
    return sArg.charAt(0).toUpperCase() + sArg.slice(1);
}

function setUpLetters()
{
    var index = 0;

    // P
    m_cP[index++] = {x: 19, y: 3};
    m_cP[index++] = {x: 18, y: 3};
    m_cP[index++] = {x: 17, y: 3};
    m_cP[index++] = {x: 16, y: 3};      
    m_cP[index++] = { x: 15, y: 3 };    // 5
    m_cP[index++] = { x: 15, y: 4 };
    m_cP[index++] = { x: 15, y: 5 };
    m_cP[index++] = { x: 15, y: 6 };
    m_cP[index++] = { x: 19, y: 6 };
    m_cP[index++] = { x: 18, y: 6 };    // 10
    m_cP[index++] = { x: 17, y: 6 };
    m_cP[index++] = { x: 16, y: 6 };
    m_cP[index++] = { x: 19, y: 7 };
    m_cP[index++] = { x: 19, y: 8 };
    m_cP[index++] = { x: 19, y: 9 };    // 15
    m_cP[index++] = { x: 15, y: 9 };
    m_cP[index++] = { x: 16, y: 9 };
    m_cP[index++] = { x: 17, y: 9 };
    m_cP[index++] = { x: 18, y: 9 };
    m_cP[index++] = { x: 19, y: 9 };    // 20
    index = 0;

    // N
    m_cO[index++] = { x: 21, y: 3 };
    m_cO[index++] = { x: 22, y: 3 };
    m_cO[index++] = { x: 23, y: 3 };
    m_cO[index++] = { x: 24, y: 3 };
    m_cO[index++] = { x: 25, y: 3 };    // 5
    m_cO[index++] = { x: 21, y: 4 };
    m_cO[index++] = { x: 21, y: 5 };
    m_cO[index++] = { x: 21, y: 6 };
    m_cO[index++] = { x: 21, y: 7 };
    m_cO[index++] = { x: 21, y: 8 };    // 10
    m_cO[index++] = { x: 21, y: 9 };
    m_cO[index++] = { x: 25, y: 4 };
    m_cO[index++] = { x: 25, y: 5 };
    m_cO[index++] = { x: 25, y: 6 };
    m_cO[index++] = { x: 25, y: 7 };    // 15
    m_cO[index++] = { x: 25, y: 8 };
    m_cO[index++] = { x: 25, y: 9 };
    index = 0;

    // N
    m_cN[index++] = { x: 30, y: 3 };
    m_cN[index++] = { x: 29, y: 3 };
    m_cN[index++] = { x: 28, y: 3 };
    m_cN[index++] = { x: 27, y: 4 };
    m_cN[index++] = { x: 27, y: 5 };    // 5
    m_cN[index++] = { x: 27, y: 6 };
    m_cN[index++] = { x: 27, y: 7 };
    m_cN[index++] = { x: 27, y: 8 };
    m_cN[index++] = { x: 27, y: 9 }; 
    m_cN[index++] = { x: 31, y: 4 };    // 10
    m_cN[index++] = { x: 31, y: 5 };
    m_cN[index++] = { x: 31, y: 6 };
    m_cN[index++] = { x: 31, y: 7 };
    m_cN[index++] = { x: 31, y: 8 };
    m_cN[index++] = { x: 31, y: 9 };    // 15
    m_cN[index++] = { x: 28, y: 6 };
    m_cN[index++] = { x: 29, y: 6 };
    m_cN[index++] = { x: 30, y: 6 };
    index = 0;

    // G
    m_cG[index++] = { x: 33, y: 3 };
    m_cG[index++] = { x: 33, y: 4 };
    m_cG[index++] = { x: 33, y: 5 };
    m_cG[index++] = { x: 33, y: 6 };
    m_cG[index++] = { x: 33, y: 7 };    // 5
    m_cG[index++] = { x: 33, y: 8 };
    m_cG[index++] = { x: 33, y: 9 };
    m_cG[index++] = { x: 27, y: 8 };
    m_cG[index++] = { x: 27, y: 9 };
    m_cG[index++] = { x: 34, y: 6 };    // 10
    m_cG[index++] = { x: 35, y: 5 };
    m_cG[index++] = { x: 35, y: 7 };
    m_cG[index++] = { x: 36, y: 4 };
    m_cG[index++] = { x: 36, y: 8 };
    m_cG[index++] = { x: 37, y: 3 };
    m_cG[index++] = { x: 37, y: 9 };    // 15
    index = 0;
} 