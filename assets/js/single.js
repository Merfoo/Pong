// Singleplayer

function initializeSingle()
{
    showStartMenu(false);
    m_bGameStatus.started = true;
    m_bGameStatus.single = true;
    
    initializeBall();
    initializePaddles();
    
    // Initialize gameloop.
    if (m_IntervalId.game != null)
        clearInterval(m_IntervalId.game);

    m_IntervalId.game = window.setInterval("gameLoopSingle();", m_iSpeed.game);
}

// Runs all the functions required for the game to work.
function gameLoopSingle() 
{
    playBackgroundMusic();
    runBackgroundFlashing();
    paintMiddleLine();
    
    for(var index = 0;  index < m_iBalls.length; index++)
    {
        setUpBall(m_iBalls[index], m_iBalls[index].color);

        if(hitPaddleOne(m_iBalls[index]) || hitPaddleTwo(m_iBalls[index]))
        {    
            if(hitPaddleOne(m_iBalls[index]))
                ballDirectionChanger(m_iBalls[index], m_iPaddleOne);
            
            if(hitPaddleTwo(m_iBalls[index]))
                ballDirectionChanger(m_iBalls[index], m_iPaddleTwo);
            
            if(m_iBalls.length < m_iBallMax)
                m_iBalls.push(makeNewBall());
            
            if(++m_iScores.one > m_iScores.highestOne)
                m_iScores.highestOne = m_iScores.one;
            
            playBallMusic();            
            m_iFlash.flashMode = true;
        }

        if(outOfBounds(m_iBalls[index]) == m_iMap.left || outOfBounds(m_iBalls[index]) == m_iMap.right)
        {    
            m_iBalls = removeIndex(index, m_iBalls);
            m_iScores.one--;
            
            if(m_iBalls.length < 1)
                initializeBall();
        }
    }
    
    movePaddle(m_iPaddleOne);
    movePaddle(m_iPaddleTwo);
    paintToolbar(m_iMap.toolbarColor);
    writeMessage(m_iMessageAlignment.middle, "Balls on screen: " + m_iBalls.length, "white");
    writeMessage(m_iMessageAlignment.middle + 250, "Ball Limit: " + m_iBallMax, "white");
    writeMessage(m_iMessageAlignment.left, "Player One: " + m_iScores.one, m_iScores.color);
    writeMessage(m_iMessageAlignment.left + 250, "Highest: " + m_iScores.highestOne, m_iScores.color);
}

// Stops loop
function pauseGameSingle()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalId.game);
    m_bGameStatus.isPaused = true;
}

// Starts loop again
function unPauseGameSingle()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalId.game = window.setInterval("gameLoopSingle();", m_iSpeed.game);
    m_bGameStatus.isPaused = false;
}

// Handle keyboard events for multiplayer
function keyBoardDownSingle(event)
{
    // Paddle One
    if (event.keyCode == m_iKeyId.arrowUp)   // Up arrow key was pressed.
    {
        m_iPaddleOne.up = true;
        m_iPaddleTwo.up = true;
    }

    else if (event.keyCode == m_iKeyId.arrowDown)    // Down arrow key was pressed.
    {
        m_iPaddleOne.down = true;
        m_iPaddleTwo.down = true;
    }
}

function keyBoardUpSingle(event)
{
    // Paddle One
    if (event.keyCode == m_iKeyId.arrowUp)   // Up arrow key was pressed.
    {
        m_iPaddleOne.up = false;
        m_iPaddleTwo.up = false;
    }

    else if (event.keyCode == m_iKeyId.arrowDown)    // Down arrow key was pressed.
    {
        m_iPaddleOne.down = false;
        m_iPaddleTwo.down = false;
    }

    if (event.keyCode == m_iKeyId.space)
        m_bGameStatus.isPaused ? unPauseGameSingle() : pauseGameSingle();

    if (event.keyCode == m_iKeyId.esc) // Escape was pressed
    {
        pauseGameSingle();
        showStartMenu(true);
    }
}