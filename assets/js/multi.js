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
    
    if(hitPaddleOne(m_iBallMain))
        m_iBallMain.xV = -m_iBallMain.xV;
    
    if(hitPaddleTwo(m_iBallMain))
        m_iBallMain.xV = -m_iBallMain.xV;
    
    if(outOfBounds(m_iBallMain))
        initializeBall();
    
    paintToolbar(m_iMap.toolbarColor);
    writeMessage(m_iMessageAlignment.left, m_iBallMain.y + m_iBallMain.radius, "white");
}

// Sets up the paddles
function setUpPaddleMulti()
{
    // Paddle One
    if (m_iKeyMap[m_iKeyId.w] && m_iPaddleOne.topY > m_iMap.toolbarThickness)
    {
        if((m_iPaddleOne.velocity += m_iPaddleOne.increaseRate) >= m_iPaddleOne.maxV)
            m_iPaddleOne.velocity = m_iPaddleOne.maxV;
        
        setUpPaddle(m_iPaddleOne, m_iPaddleOne.velocity, "up");
    }

    else if (m_iKeyMap[m_iKeyId.s] && m_iPaddleOne.bottomY < m_iMap.height - 1)
    {
        if((m_iPaddleOne.velocity += m_iPaddleOne.increaseRate) >= m_iPaddleOne.maxV)
            m_iPaddleOne.velocity = m_iPaddleOne.maxV;
            
        setUpPaddle(m_iPaddleOne, m_iPaddleOne.velocity, "down");
    }
    
    else if (!m_iKeyMap[m_iKeyId.w] && !m_iKeyMap[m_iKeyId.s])
        m_iPaddleOne.velocity = 0;

    else if(m_iPaddleOne.topY <= m_iMap.toolbarThickness || m_iPaddleTwo.bottomY >= m_iMap.height - 1)
        m_iPaddleOne.velocity = 0;

    // Paddle Two
    if (m_iKeyMap[m_iKeyId.arrowUp] && m_iPaddleTwo.topY > m_iMap.toolbarThickness)
    {
       if((m_iPaddleTwo.velocity += m_iPaddleTwo.increaseRate) >= m_iPaddleTwo.maxV)
           m_iPaddleTwo.velocity = m_iPaddleTwo.maxV;
           
        setUpPaddle(m_iPaddleTwo, m_iPaddleTwo.velocity, "up");
    }

    else if (m_iKeyMap[m_iKeyId.arrowDown] && m_iPaddleTwo.bottomY < m_iMap.height - 1)
    {
        if((m_iPaddleTwo.velocity += m_iPaddleTwo.increaseRate) >= m_iPaddleTwo.maxV)
           m_iPaddleTwo.velocity = m_iPaddleTwo.maxV;
       
        setUpPaddle(m_iPaddleTwo, m_iPaddleTwo.velocity, "down");
    }
    
    else if(!m_iKeyMap[m_iKeyId.arrowUp] || !m_iKeyMap[m_iKeyId.arrowDown])
        m_iPaddleTwo.velocity = 0;

    else if (m_iPaddleTwo.topY <= m_iMap.toolbarThickness || m_iPaddleTwo.bottomY >= m_iMap.height - 1)
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