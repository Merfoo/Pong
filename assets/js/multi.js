// Muliplayer Teleportic

function initializeMulti()
{
    showStartMenu(false);
    m_bGameStarted = true;
    m_bMulti = true;


    m_iBallMain.x = Math.floor(m_iMapWidth / 2);
    m_iBallMain.y = Math.floor(m_iMapHeight / 2);
    m_iBallMain.r = m_iBallRadiusOriginal;
    m_iBallMain.dr = "downRight";
    m_iPaddleBodyOne = new Array(2);
    m_iPaddleBodyTwo = new Array(2);

    // Head
    m_iPaddleBodyOne[0] = { x: m_iPaddleStartXOne, y: m_iPaddleStartY };
    m_iPaddleBodyTwo[0] = { x: m_iPaddleStartXTwo, y: m_iPaddleStartY };

    // Tail
    m_iPaddleBodyOne[1] = { x: m_iPaddleStartXOne, y: m_iPaddleStartY + m_iPaddleOriginalLength - 1};
    m_iPaddleBodyTwo[1] = { x: m_iPaddleStartXTwo, y: m_iPaddleStartY + m_iPaddleOriginalLength - 1 };

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            y == 0 ? paintTile(x, y, "#FFF", 0) : paintTile(x, y, m_cBackgroundColor, 0);

    for (var index = m_iPaddleStartY; index < m_iPaddleStartY + m_iPaddleOriginalLength; index++)
    {
        paintTile(m_iPaddleStartXOne, index, m_cPaddleColorMain, m_iPaddleBorderWidth);
        paintTile(m_iPaddleStartXTwo, index, m_cPaddleColorMain, m_iPaddleBorderWidth);
    }

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
    setUpBallDirection(m_iBallMain, m_iPaddleBodyOne.concat(m_iPaddleBodyTwo));
    setUpBall(m_iBallMain, getRandomColor(1, 255));
    setUpPaddleMulti();
    drawMapMulti();
}

// Draws everything on the canvas.
function drawMapMulti()
{
    // Food

    // Prints score on top of snake game
    //writeMessage(m_iLeft, m_cPaddleColorOne, "Score One: " + m_iScoreOne);
    //writeMessage(m_iLeft + 10, m_cPaddleColorTwo, "Score Two: " + m_iScoreTwo);
    //writeMessage(m_iMiddle + 5, m_cPaddleColorOne, "Total Score One: " + m_iPaddleBodyOne[0].y);
    //writeMessage(m_iMiddle + 15, m_cPaddleColorTwo, "Total Score Two: " + m_iPaddleBodyOne[1].y);
    setSoundPicVisible(m_bSoundOn);
}

// Sets up the paddles
function setUpPaddleMulti()
{
    if (m_iKeyMap[m_iWID] && m_iPaddleBodyOne[0].y > 1)
        setUpPaddle(m_iPaddleBodyOne, "up");

    else if (m_iKeyMap[m_iSID] && m_iPaddleBodyOne[1].y < m_iMapHeight - 1)
        setUpPaddle(m_iPaddleBodyOne, "down");

    if (m_iKeyMap[m_iArrowUpID] && m_iPaddleBodyTwo[0].y > 1)
        setUpPaddle(m_iPaddleBodyTwo, "up");

    else if (m_iKeyMap[m_iArrowDownID] && m_iPaddleBodyTwo[1].y < m_iMapHeight - 1)
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
    // ASDW Keys
    if (event.keyCode == m_iWID || event.keyCode == m_iSID)
    {
        // Paddle Two 
        if (event.keyCode == m_iWID)    // W was pressed
            m_iKeyMap[m_iWID] = true;

        else if (event.keyCode == m_iSID)   // S was pressed
            m_iKeyMap[m_iSID] = true;
    }

    // Arrow Controls
    if (event.keyCode == m_iArrowUpID || event.keyCode == m_iArrowDownID)
    {
        // Paddle One
        if (event.keyCode == m_iArrowUpID)  // Up arrow key was pressed.
            m_iKeyMap[m_iArrowUpID] = true;

        else if (event.keyCode == m_iArrowDownID)   // Down arrow key was pressed.   
            m_iKeyMap[m_iArrowDownID] = true;
    }
}

function keyBoardUpMultiplayer(event)
{
    // ASDW Controls
    if (event.keyCode == m_iWID || event.keyCode == m_iSID)
    {
        // Paddle One
        if (event.keyCode == m_iWID)   // W was pressed.
            m_iKeyMap[m_iWID] = false;

        else if (event.keyCode == m_iSID)    // S was pressed.
            m_iKeyMap[m_iSID] = false;
    }

    // Arrow Keys
    if (event.keyCode == m_iArrowUpID || event.keyCode == m_iArrowDownID)
    {
        // Paddle Two
        if (event.keyCode == m_iArrowUpID)   // Up arrow key was pressed.
            m_iKeyMap[m_iArrowUpID] = false;

        else if (event.keyCode == m_iArrowDownID)    // Down arrow key was pressed.
            m_iKeyMap[m_iArrowDownID] = false;
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