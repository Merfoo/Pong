// This file conatins all variables used with different variations of the game, and some useful functions

// Map Related
var m_iMapWidth = 60;
var m_iMapHeight = 30;
var m_iTileWidth;
var m_iTileHeight;

// All colors/ borders
var m_iBackgroundBorderWidth = 0;
var m_iPaddleBorderWidth = 0;
var m_iBallBorderWidth = 0;
var m_cBackgroundColor = "#000";
var m_cBallColor = "#000";
var m_cPaddleColorMain = "blue";

// Paddle Lengths Related
var m_iPaddleOriginalLength = 5;

// Paddle One Related
var m_iPaddeOneID = 1;
var m_iPaddleStartXOne = 0;
var m_cPaddleColorOne = "red";
var m_iPaddleBodyOne = new Array(m_iPaddleOriginalLength);

// Paddle Two Related
var m_iPaddeTwoID = 2;
var m_iPaddleStartXTwo = m_iMapWidth - 1;
var m_cPaddleColorTwo = "red";
var m_iPaddleBodyTwo = new Array(m_iPaddleOriginalLength);

// Game speed
var m_iMenuSpeed = 60;
var m_iGameSpeedOriginal = 80;
var m_iGameSpeedMain = m_iGameSpeedOriginal;

// Scores
var m_iScoreOne = 0;
var m_iScoreTwo = 0;
var m_iHighestScoreOne = 0;
var m_iHighestScoreTwo = 0;

// Fast Speed
var m_iFastDivider = 4;
var m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);
var m_bFastMode = false;

// Ball
var m_cBallColor = "#FFF";
var m_iBallMain = { x: m_iMapWidth / 2, y: m_iMapHeight / 2 };

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
    m_iLeft = 1;
    m_iMiddle = Math.floor((m_iMapWidth / 2) - 6);
    m_iRight = Math.floor((m_iMapWidth) - 10);
}

// Paints a tile on the screen, handles converting pixel to tile.
function paintTile(x, y, color, borderThickness)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect((x * m_iTileWidth) + borderThickness, (y * m_iTileHeight) + borderThickness, m_iTileWidth - (borderThickness * 2), m_iTileHeight - (borderThickness * 2));
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
    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            paintTile(x, y, m_cBackgroundColor, 0);

    var tempArray = m_cP.concat(m_cO, m_cN, m_cG);

    for (var index = 0; index < tempArray.length; index++)
        paintTile(tempArray[index].x, tempArray[index].y, getRandomColor(1, 255), 0);
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
function setUpBallDirection(iBall, sDirection, iPaddleArray)
{
    // Checks if the ball has collided
    if (iBall.y <= 1)
    {
        if (sDirection == "up")
            sDirection = "down";

        else if (sDirection == "upLeft")
            sDirection = "downLeft";

        else if (sDirection == "upRight")
            sDirection = "downRight";

        return sDirection;
    }

    else if (iBall.y >= m_iMapHeight - 1)
    {
        if (sDirection == "down")
            sDirection = "up";

        else if (sDirection == "downLeft")
            sDirection = "upLeft";

        else if (sDirection == "downRight")
            sDirection = "upRight";

        return sDirection;
    }

    for (var index = 0; index < iPaddleArray.length; index++)
    {
        if (iBall.x == iPaddleArray[index].x && iBall.y == iPaddleArray[index].y)
        {
            if (sDirection == "upRight")
                sDirection = "upLeft";

            else if (sDirection == "downRight")
                sDirection = "downLeft";

            else if (sDirection == "upLeft")
                sDirection = "upRight";

            else if (sDirection == "downLeft")
                sDirection = "downRight";

            return sDirection;
        }
    }

    return sDirection;
}

function setUpBall(iBall, sDirection)
{
    paintTile(iBall.x, iBall.y, m_cBackroundColor, 0);

    if(sDirection == "up")
        iBall.y--;

    else if(sDirection == "down")
        iBall.y++;

    else if(sDirection == "left")
        iBall.x--;

    else if(sDirection == "right")
        iBall.x++;

    else if(sDirection == "upLeft")
    {
        iBall.x--;
        iBall.y--;
    }

    else if(sDirection == "upRight")
    {
        iBall.x++;
        iBall.y--;
    }

    else if(sDirection == "downLeft")
    {
        iBall.x--;
        iBall.y++;

    }
    else if(sDirection == "downRight")
    {
        iBall.x++;
        iBall.y++;
    }
}

// Checks if the snake hit the wall or itself
function checkCollision(snakeBody)
{
    // Checks if snake hit the borders
    if (snakeBody[0].x >= m_iMapWidth)
        return true;

    if (snakeBody[0].x < 0)
        return true;

    if (snakeBody[0].y >= m_iMapHeight)
        return true;

    if (snakeBody[0].y <= 0)
        return true;

    // Checks if the snakes hit themselves
    for (var index = 1; index < snakeBody.length; index++)
        if (snakeBody[0].x == snakeBody[index].x && snakeBody[0].y == snakeBody[index].y)
            return true;

    return false;
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