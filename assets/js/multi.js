// Muliplayer Teleportic

function initializeMulti()
{
    showStartMenu(false);
    m_bGameStarted = true;
    m_bMulti = true;

    // Ball
    m_iBallMain.x = m_iMaxPixelWidth/2;
    m_iBallMain.y = m_iMaxPixelHeight/2;
    m_iBallMain.r = m_iBallRadiusOriginal;
    m_iBallMain.xV = 30;
    m_iBallMain.yV = 30;

    // Paddles
    m_iPaddleOne = { x: m_iPaddleStartXOne, startY: m_iPaddleStartY, endY: m_iPaddleStartY + (m_iPaddleOriginalLength * m_iTileHeight) };
    m_iPaddleTwo = { x: m_iPaddleStartXTwo, startY: m_iPaddleStartY, endY: m_iPaddleStartY + (m_iPaddleOriginalLength * m_iTileHeight) };

    paintRawTile(0, 0, m_iMaxPixelWidth, m_iTileHeight, "#FFF", 0);
    paintRawTile(0, m_iTileHeight, m_iMapWidth * m_iTileWidth, (m_iMapHeight * m_iTileHeight) - m_iTileHeight, m_cBackgroundColor, m_iBackgroundBorderWidth);
    paintRawTile(m_iPaddleOne.x, m_iPaddleOne.startY, m_iPaddleWidth, m_iPaddleOne.endY - m_iPaddleOne.startY, m_cPaddleColorMain, m_iPaddleBorderWidth);
    paintRawTile(m_iPaddleTwo.x, m_iPaddleTwo.startY, m_iPaddleWidth, m_iPaddleTwo.endY - m_iPaddleTwo.startY, m_cPaddleColorMain, m_iPaddleBorderWidth);

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
    setUpBall(m_iBallMain, getRandomColor(1, 255), m_iPaddleOne, m_iPaddleTwo);
    //setUpBall(m_iBallMain, getRandomColor(1, 255));
    setUpPaddleMulti();
    drawMapMulti();
}

// Draws everything on the canvas.
function drawMapMulti()
{
    // Food

    // Prints score on top of snake game
    //writeMessage(m_iLeft, m_cPaddleColorMain, "Score One: " + m_iScoreOne);
    //writeMessage(m_iLeft + 10, m_cPaddleColorMain, "Score Two: " + m_iScoreTwo);
    //writeMessage(m_iMiddle + 5, m_cPaddleColorMain, "Total Score One: " + m_iPaddleOne[0].y);
    //writeMessage(m_iMiddle + 15, m_cPaddleColorMain, "Total Score Two: " + m_iPaddleOne[1].y);
    setSoundPicVisible(m_bSoundOn);
}

// Sets up the paddles
function setUpPaddleMulti()
{
    // Paddle One
    if (m_iKeyMap[m_iWID] && m_iPaddleOne.startY - m_iPaddleIncreaseOne > 1)
    {
        setUpPaddle(m_iPaddleOne, m_iPaddleIncreaseOne, "up");
        m_iPaddleIncreaseOne += m_iPaddleIncreaseRate;
    }

    else if (!m_iKeyMap[m_iWID] || m_iPaddleOne.startY - m_iPaddleIncreaseOne <= 1)
        m_iPaddleIncreaseOne = m_iPaddleIncreaseOriginal;

    if (m_iKeyMap[m_iSID] && m_iPaddleOne.endY + m_iPaddleIncreaseOne < m_iMaxPixelHeight - 1)
    {
        setUpPaddle(m_iPaddleOne, m_iPaddleIncreaseOne, "down");
        m_iPaddleIncreaseOne += m_iPaddleIncreaseRate;
    }

    else if (!m_iKeyMap[m_iSID] || m_iPaddleOne.endY + m_iPaddleIncreaseOne >= m_iMaxPixelHeight - 1)
        m_iPaddleIncreaseOne = m_iPaddleIncreaseOriginal;

    // Paddle Two
    if (m_iKeyMap[m_iArrowUpID] && m_iPaddleTwo.startY - m_iPaddleIncreaseTwo > 1)
    {
        setUpPaddle(m_iPaddleTwo, m_iPaddleIncreaseTwo, "up");
        m_iPaddleIncreaseTwo += m_iPaddleIncreaseRate;
    }

    else if(!m_iKeyMap[m_iArrowUpID] || m_iPaddleTwo.startY - m_iPaddleIncreaseTwo <= 1)
        m_iPaddleIncreaseTwo = m_iPaddleIncreaseOriginal;

    if (m_iKeyMap[m_iArrowDownID] && m_iPaddleTwo.endY + m_iPaddleIncreaseTwo < m_iMaxPixelHeight - 1)
    {
        setUpPaddle(m_iPaddleTwo, m_iPaddleIncreaseTwo, "down");
        m_iPaddleIncreaseTwo += m_iPaddleIncreaseRate;
    }

    else if (!m_iKeyMap[m_iArrowDownID] || m_iPaddleTwo.endY + m_iPaddleIncreaseTwo >= m_iMaxPixelHeight - 1)
        m_iPaddleIncreaseTwo = m_iPaddleIncreaseOriginal;
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