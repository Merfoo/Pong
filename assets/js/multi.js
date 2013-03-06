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
    if (m_IntervalId.paddle != null)
        clearInterval(m_IntervalId.paddle);
    
    if(m_IntervalId.ball != null)
        clearInterval(m_IntervalId.ball);

    m_IntervalId.paddle = window.setInterval("paddleLoopMulti();", m_iSpeed.paddle);
    m_IntervalId.ball = window.setInterval("ballLoopMulti();", m_iSpeed.ball);
}

// Runs all the functions required for the game to work.
function ballLoopMulti() 
{
    paintMiddleLine();
    setUpBall(m_iBallMain, m_iBallMain.color);
    
    if(hitPaddleOne(m_iBallMain))
    {    
        ballDirectionChanger(m_iBallMain, m_iPaddleOne);
        m_iSpeed.ball -= 3;//increaseSpeed(m_iSpeed.game);
        m_IntervalId.ball = changeGameSpeed(m_IntervalId.ball, "ballLoopMulti();", m_iSpeed.ball);
    }
    
    if(hitPaddleTwo(m_iBallMain))
    {    
        ballDirectionChanger(m_iBallMain, m_iPaddleTwo);
        m_iSpeed.ball--;//increaseSpeed(m_iSpeed.game);
        m_IntervalId.ball = changeGameSpeed(m_IntervalId.ball, "ballLoopMulti();", m_iSpeed.ball);
    }
    
    if(outOfBounds(m_iBallMain) == m_iMap.left || outOfBounds(m_iBallMain) == m_iMap.right)
    {
        if(outOfBounds(m_iBallMain) == m_iMap.left)
            m_iScores.two++;
        
        else if(outOfBounds(m_iBallMain) == m_iMap.right)
            m_iScores.one++;
            
        initializeBall();
    }
    
    paintPaddle(m_iPaddleOne, m_iPaddleOne.color);
    paintPaddle(m_iPaddleTwo, m_iPaddleTwo.color);
    
    paintToolbar(m_iMap.toolbarColor);
    writeMessage(m_iMessageAlignment.middle, "Game Speed: " + m_iSpeed.ball, "white");
    writeMessage(m_iMessageAlignment.left, "Player One: " + m_iScores.one, m_iScores.color);
    writeMessage(m_iMessageAlignment.right, "Player Two: " + m_iScores.two, m_iScores.color);
}

function paddleLoopMulti()
{
    playBackgroundMusic();
    movePaddle(m_iPaddleOne);
    movePaddle(m_iPaddleTwo);
}

// Stops loop
function pauseGameMulti()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalId.paddle);
    window.clearInterval(m_IntervalId.ball);
    m_bGameStatus.isPaused = true;
}

// Starts loop again
function unPauseGameMulti()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalId.paddle = window.setInterval("paddleLoopMulti();", m_iSpeed.paddle);
    m_IntervalId.ball = window.setInterval("ballLoopMulti();", m_iSpeed.ball);
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