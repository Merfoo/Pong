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
    movePaddle(m_iPaddleOne);
    movePaddle(m_iPaddleTwo);
    
    if(hitPaddleOne(m_iBallMain))
    {    
        ballDirectionChanger(m_iBallMain, m_iPaddleOne);
    
    }
    
    if(hitPaddleTwo(m_iBallMain))
    {
        ballDirectionChanger(m_iBallMain, m_iPaddleTwo);
        
    }
    
    if(outOfBounds(m_iBallMain))
        initializeBall();
    
    paintToolbar(m_iMap.toolbarColor);
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