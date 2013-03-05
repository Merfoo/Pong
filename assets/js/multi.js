// Muliplayer Teleportic

function initializeMulti()
{
    showStartMenu(false);
    m_bGameStatus.started = true;
    m_bGameStatus.multi = true;
    m_iScores.highestOne = 0;
    m_iScores.highestTwo = 0;
    
    initializeBall();
    initializePaddles();
    
    // Initialize gameloop.
    if (m_IntervalId.game != null)
        clearInterval(m_IntervalId.game);

    m_IntervalId.game = window.setInterval("gameLoopMulti();", m_iSpeed.game);
}

// Runs all the functions required for the game to work.
function gameLoopMulti() 
{
    playBackgroundMusic();
    setUpBall(m_iBallMain, getRandomColor(1, 255));
    setUpPaddleMulti();
    paintPaddle(m_iPaddleOne, m_iPaddleOne.color);
    paintPaddle(m_iPaddleTwo, m_iPaddleTwo.color);
}

// Sets up the paddles
function setUpPaddleMulti()
{
    // Paddle One
    if (m_iKeyMap[m_iKeyId.w] && m_iPaddleOne.topY > m_iMap.toolbarThickness)
    {
        m_iPaddleOne.velocity += m_iPaddleOne.increaseRate;
        setUpPaddle(m_iPaddleOne, m_iPaddleOne.velocity, "up");
    }

    if (!m_iKeyMap[m_iKeyId.w] || m_iPaddleOne.topY <= m_iMap.toolbarThickness)
        m_iPaddleOne.velocity = 0;

    if (m_iKeyMap[m_iKeyId.s] && m_iPaddleOne.bottomY < m_iMap.height - 1)
    {
        m_iPaddleOne.velocity += m_iPaddleOne.increaseRate;
        setUpPaddle(m_iPaddleOne, m_iPaddleOne.velocity, "down");
    }

    if (!m_iKeyMap[m_iKeyId.s] || m_iPaddleOne.bottomY >= m_iMap.height - 1)
        m_iPaddleOne.velocity = 0;

    // Paddle Two
    if (m_iKeyMap[m_iKeyId.arrowUp] && m_iPaddleTwo.topY > m_iMap.toolbarThickness)
    {
        m_iPaddleTwo.velocity += m_iPaddleTwo.increaseRate;
        setUpPaddle(m_iPaddleTwo, m_iPaddleTwo.velocity, "up");
    }

    if(!m_iKeyMap[m_iKeyId.arrowUp] || m_iPaddleTwo.topY <= m_iMap.toolbarThickness)
        m_iPaddleTwo.velocity = 0;

    if (m_iKeyMap[m_iKeyId.arrowDown] && m_iPaddleTwo.bottomY < m_iMap.height - 1)
    {
        m_iPaddleTwo.velocity += m_iPaddleTwo.increaseRate;
        setUpPaddle(m_iPaddleTwo, m_iPaddleTwo.velocity, "down");
    }

    if (!m_iKeyMap[m_iKeyId.arrowDown] || m_iPaddleTwo.bottomY >= m_iMap.height - 1)
        m_iPaddleTwo.velocity = 0;
}

// Stops loop
function pauseGameMulti()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalId.game);
    m_bGameStatus.isPaused = true;
}

// Starts loop again
function unPauseGameMulti()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalId.game = window.setInterval("gameLoopMulti();", m_iSpeed.game);
    m_bGameStatus.isPaused = false;
}

// Handle keyboard events for multiplayer
function keyBoardDownMulti(event)
{
    // ASDW Controls
    if (event.keyCode == m_iKeyId.w || event.keyCode == m_iKeyId.s)
    {
        // Paddle One
        if (event.keyCode == m_iKeyId.w)   // W was pressed.
            m_iKeyMap[m_iKeyId.w] = true;

        else if (event.keyCode == m_iKeyId.s)    // S was pressed.
            m_iKeyMap[m_iKeyId.s] = true;
    }

    // Arrow Keys
    if (event.keyCode == m_iKeyId.arrowUp || event.keyCode == m_iKeyId.arrowDown)
    {
        // Paddle Two
        if (event.keyCode == m_iKeyId.arrowUp)   // Up arrow key was pressed.
            m_iKeyMap[m_iKeyId.arrowUp] = true;

        else if (event.keyCode == m_iKeyId.arrowDown)    // Down arrow key was pressed.
            m_iKeyMap[m_iKeyId.arrowDown] = true;
    }
}

function keyBoardUpMulti(event)
{
    // ASDW Controls
    if (event.keyCode == m_iKeyId.w || event.keyCode == m_iKeyId.s)
    {
        // Paddle One
        if (event.keyCode == m_iKeyId.w)   // W was pressed.
            m_iKeyMap[m_iKeyId.w] = false;

        else if (event.keyCode == m_iKeyId.s)    // S was pressed.
            m_iKeyMap[m_iKeyId.s] = false;
    }

    // Arrow Keys
    if (event.keyCode == m_iKeyId.arrowUp || event.keyCode == m_iKeyId.arrowDown)
    {
        // Paddle Two
        if (event.keyCode == m_iKeyId.arrowUp)   // Up arrow key was pressed.
            m_iKeyMap[m_iKeyId.arrowUp] = false;

        else if (event.keyCode == m_iKeyId.arrowDown)    // Down arrow key was pressed.
            m_iKeyMap[m_iKeyId.arrowDown] = false;
    }

    if (event.keyCode == m_iKeyId.space)
        m_bGameStatus.isPaused ? unPauseGameMulti() : pauseGameMulti();

    if (event.keyCode == m_iKeyId.esc) // Escape was pressed
    {
        pauseGameMulti();
        showStartMenu(true);
    }
}