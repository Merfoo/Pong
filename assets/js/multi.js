// Muliplayer 

function initializeMulti()
{
    showStartMenu(false);
    m_bGameStatus.started = true;
    m_bGameStatus.multi = true;
    
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
            
            playBallMusic();
            m_iFlash.flashMode = true;
        }
        
        if(outOfBounds(m_iBalls[index]) == m_iMap.left || outOfBounds(m_iBalls[index]) == m_iMap.right)
        {            
            if(outOfBounds(m_iBalls[index]) == m_iMap.left)
                m_iScores.two++;

            else if(outOfBounds(m_iBalls[index]) == m_iMap.right)
                m_iScores.one++;

            m_iBalls = removeIndex(index, m_iBalls); 
            
            if(m_iBalls.length < 1)
                initializeBall();
        }
    }
    
    movePaddle(m_iPaddleOne);
    movePaddle(m_iPaddleTwo);
    paintToolbar(m_iMap.toolbarColor);
    writeMessage(m_iMessageAlignment.middle, "" + m_iBalls.length, "white");
    writeMessage(m_iMessageAlignment.left, "Player One: " + m_iScores.one, m_iScores.color);
    writeMessage(m_iMessageAlignment.right, "Player Two: " + m_iScores.two, m_iScores.color);
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
    // Paddle One
    if (event.keyCode == m_iKeyId.w)   // W was pressed.
        m_iPaddleOne.up = true;

    else if (event.keyCode == m_iKeyId.s)    // S was pressed.
        m_iPaddleOne.down = true;

    // Paddle Two
    if (event.keyCode == m_iKeyId.arrowUp)   // Up arrow key was pressed.
        m_iPaddleTwo.up = true;

    else if (event.keyCode == m_iKeyId.arrowDown)    // Down arrow key was pressed.
        m_iPaddleTwo.down = true;
}

function keyBoardUpMulti(event)
{
    // Paddle One
    if (event.keyCode == m_iKeyId.w)   // W was pressed.
        m_iPaddleOne.up = false;

    else if (event.keyCode == m_iKeyId.s)    // S was pressed.
        m_iPaddleOne.down = false;

    // Paddle Two
    if (event.keyCode == m_iKeyId.arrowUp)   // Up arrow key was pressed.
        m_iPaddleTwo.up = false;

    else if (event.keyCode == m_iKeyId.arrowDown)    // Down arrow key was pressed.
        m_iPaddleTwo.down = false;

    if (event.keyCode == m_iKeyId.space)
        m_bGameStatus.isPaused ? unPauseGameMulti() : pauseGameMulti();

    if (event.keyCode == m_iKeyId.esc) // Escape was pressed
    {
        pauseGameMulti();
        showStartMenu(true);
    }
}