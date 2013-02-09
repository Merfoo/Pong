// Muliplayer Teleportic

function initializeMulti()
{
    showStartMenu(false);
    m_bGameStarted = true;
    m_bMulti = true;

    m_iPaddleBodyOne = new Array(m_iPaddleOriginalLength);
    m_iPaddleBodyTwo = new Array(m_iPaddleOriginalLength);

    m_iPaddleBodyOne[0] = { x: m_iPaddleStartXOne, y: Math.floor((m_iMapHeight / 2) - (m_iPaddleOriginalLength / 2)) };
    m_iPaddleBodyTwo[0] = { x: m_iPaddleStartXTwo, y: Math.floor((m_iMapHeight / 2) - (m_iPaddleOriginalLength / 2)) };

    for (var index = 1; index < m_iPaddleOriginalLength; index++)
    {
        m_iPaddleBodyOne[index] = { x: m_iPaddleStartXOne, y: m_iPaddleBodyOne[index - 1].y + 1 };
        m_iPaddleBodyTwo[index] = { x: m_iPaddleStartXTwo, y: m_iPaddleBodyTwo[index - 1].y + 1 };
    }

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            y == 0 ? paintTile(x, y, "#FFF", 0) : paintTile(x, y, m_cBackgroundColor, 0);

    m_iHighestScoreOne = 0;
    m_iHighestScoreTwo = 0;
    drawMapMulti();
    gameLoopMulti();

    // Initialize gameloop.
    if (m_IntervalIDMain != null)
        clearInterval(m_IntervalIDMain);

    m_IntervalIDMain = window.setInterval("gameLoopMulti();", m_iGameSpeedMain);
}

// Runs all the functions required for the game to work.
function gameLoopMulti() 
{
    playBackgroundMusic();

    setUpPaddleMulti();
    drawMapMulti();
}

// Draws everything on the canvas.
function drawMapMulti()
{
    // Food
    m_cBallColor = getRandomColor(1, 255);
    paintTile(m_iBallMain.x, m_iBallMain, m_cBallColor, m_iBallBorderWidth);

    var paddleArray = m_iPaddleBodyOne.concat(m_iPaddleBodyTwo);
    
    for(var index = 0; index < paddleArray.length; index++)
        paintTile(paddleArray[index].x, paddleArray[index].y, m_cPaddleColorMain, m_iPaddleBorderWidth);

    // Prints score on top of snake game
    writeMessage(m_iLeft, m_cPaddleColorOne, "Score One: " + m_iScoreOne);
    writeMessage(m_iLeft + 10, m_cPaddleColorTwo, "Score Two: " + m_iScoreTwo);
    writeMessage(m_iMiddle + 5, m_cPaddleColorOne, "Total Score One: " + m_iHighestScoreOne);
    writeMessage(m_iMiddle + 15, m_cPaddleColorTwo, "Total Score Two: " + m_iHighestScoreTwo);
    setSoundPicVisible(m_bSoundOn);
}

// Sets up the paddles
function setUpPaddleMulti()
{
    if (m_iKeyMap[m_iArrowUpID])
        setUpPaddle(m_iPaddleBodyOne, "up");

    else if (m_iKeyMap[m_iArrowDownID])
        setUpPaddle(m_iPaddleBodyOne, "down");

    if (m_iKeyMap[m_iWID])
        setUpPaddle(m_iPaddleBodyTwo, "up");

    else if (m_iKeyMap[m_iSID])
        setUpPaddle(m_iPaddleBodyTwo, "down");
}

// Stops loop
function pauseGameMulti()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalIDMain);
    m_bIsPaused = true;
}

// Starts loop again
function unPauseGameMulti()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalIDMain = window.setInterval("gameLoopMulti();", m_iGameSpeedMain);
    m_bIsPaused = false;
}

// Handle keyboard events for multiplayer
function keyBoardDownMultiplayer(event)
{
    // ASDW Controls
    if (event.keyCode == m_iArrowUpID || event.keyCode == m_iArrowDownID)
    {
        // Snake 1
        if (event.keyCode == m_iArrowUpID && m_iPaddleBodyOne[0].y > 1)   // Up arrow key was pressed.
            m_iKeyMap[m_iArrowUpID] = true;

        else if (event.keyCode == m_iArrowDownID  && m_iPaddleBodyOne[m_iPaddleBodyOne.length - 1].y < m_iMapHeight - 1)    // Down arrow key was pressed.
            m_iKeyMap[m_iArrowDownID] = true;
    }

    // Arrow Keys
    if (event.keyCode == m_iWID || event.keyCode == m_iSID)
    {
        // Paddle Two 2
        if (event.keyCode == m_iWID && m_iPaddleBodyTwo[0].y > 1)   // W was pressed.
            m_iKeyMap[m_iWID] = true;

        else if (event.keyCode == m_iSID && m_iPaddleBodyTwo[m_iPaddleBodyTwo.length - 1].y < m_iMapHeight - 1)    // S was pressed.
            m_iKeyMap[m_iSID] = true;
    }
}

function keyBoardUpMultiplayer(event)
{
    // ASDW Controls
    if (event.keyCode == m_iArrowUpID || event.keyCode == m_iArrowDownID) {
        // Snake 1
        if (event.keyCode == m_iArrowUpID)   // Up arrow key was pressed.
            m_iKeyMap[m_iArrowUpID] = false;

        else if (event.keyCode == m_iArrowDownID)    // Down arrow key was pressed.
            m_iKeyMap[m_iArrowDownID] = false;
    }

    // Arrow Keys
    if (event.keyCode == m_iWID || event.keyCode == m_iSID) {
        // Paddle Two 2
        if (event.keyCode == m_iWID)   // W was pressed.
            m_iKeyMap[m_iWID] = false;

        else if (event.keyCode == m_iSID)    // S was pressed.
            m_iKeyMap[m_iSID] = false;
    }

    else if (event.keyCode == m_iSpaceID)
        m_bIsPaused ? unPauseGameMulti() : pauseGameMulti();

    else if (event.keyCode == m_iEscID) // Escape was pressed
    {
        pauseGameMulti();
        m_bIsPaused = false;
        showPausePic(false);
        showStartMenu(true);
        m_bMulti = false
        m_bGameStarted = false;
        m_iScoreOne = 0;
        m_iScoreTwo = 0;
        m_iHighestScoreOne = 0;
        m_iHighestScoreTwo = 0;
    }
}