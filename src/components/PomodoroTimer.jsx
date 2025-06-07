import { useState, useEffect, useRef } from 'react';
import katImage from '../assets/kat.jpg';
import chimeSound from '../assets/chime-alert.mp3';
import AdminMenu from './AdminMenu';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  // Settings state
  const [settings, setSettings] = useState({
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    sessionsUntilLongBreak: 4
  });

  // Timer state
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
    // Admin menu state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Time adjustment popup state
  const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(new Audio(chimeSound));const workTime = settings.workMinutes * 60;
  const breakTime = settings.breakMinutes * 60;
  const longBreakTime = settings.longBreakMinutes * 60;
    // Function to play the chime sound
  const playChime = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play()
      .then(() => {
        // Flash a visual cue when the chime plays
        const timerContent = document.querySelector('.timer-content');
        if (timerContent) {
          timerContent.classList.add('chime-playing');
          setTimeout(() => {
            timerContent.classList.remove('chime-playing');
          }, 1000);
        }
      })
      .catch(err => console.log('Audio play error:', err));
  };
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished - play chime sound
      playChime();
      setIsActive(false);
      
      if (isBreak || isLongBreak) {
        // Break finished, start work session
        setIsBreak(false);
        setIsLongBreak(false);
        setTimeLeft(workTime);
      } else {
        // Work session finished
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);
        
        if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
          // Time for long break
          setIsLongBreak(true);
          setTimeLeft(longBreakTime);
        } else {
          // Time for short break
          setIsBreak(true);
          setTimeLeft(breakTime);
        }
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, isBreak, isLongBreak, completedSessions, settings, workTime, breakTime, longBreakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setCompletedSessions(0);
    setTimeLeft(workTime);
  };
  // Navigation functions for admin menu
  const skipToBreak = () => {
    setIsActive(false);
    setIsBreak(true);
    setIsLongBreak(false);
    setTimeLeft(breakTime);
    playChime(); // Play chime on session switch
  };

  const skipToLongBreak = () => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(true);
    setTimeLeft(longBreakTime);
    playChime(); // Play chime on session switch
  };

  const skipToWork = () => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setTimeLeft(workTime);
    playChime(); // Play chime on session switch
  };

  const goBackSession = () => {
    if (completedSessions > 0) {
      setCompletedSessions(completedSessions - 1);
    }
    setIsActive(false);
    playChime(); // Play chime on session switch
    setIsBreak(false);
    setIsLongBreak(false);
    setTimeLeft(workTime);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Reset timer with new settings if not active
    if (!isActive) {
      setIsBreak(false);
      setIsLongBreak(false);
      setCompletedSessions(0);
      setTimeLeft(newSettings.workMinutes * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const getProgress = () => {
    let totalTime;
    if (isLongBreak) {
      totalTime = longBreakTime;
    } else if (isBreak) {
      totalTime = breakTime;
    } else {
      totalTime = workTime;
    }
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  const getSessionType = () => {
    if (isLongBreak) return 'Long Break';
    if (isBreak) return 'Break Time';
    return 'Focus Time';
  };

  // Open time adjustment popup
  const openTimePopup = () => {
    // Initialize with current time values
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    setInputMinutes(mins);
    setInputSeconds(secs);
    setIsTimePopupOpen(true);
  };

  // Apply the adjusted time
  const applyTimeAdjustment = () => {
    // Calculate seconds from input
    const totalSeconds = (inputMinutes * 60) + inputSeconds;
    
    // Validate against current session type
    let maxTime;
    if (isLongBreak) {
      maxTime = settings.longBreakMinutes * 60;
    } else if (isBreak) {
      maxTime = settings.breakMinutes * 60;
    } else {
      maxTime = settings.workMinutes * 60;
    }
    
    // Set time within valid range for current session
    setTimeLeft(Math.min(totalSeconds, maxTime));
    setIsTimePopupOpen(false);
  };

  const circumference = 2 * Math.PI * 160; // radius = 160
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;
  return (
    <div className="pomodoro-container">
      {/* Hidden audio element as fallback for mobile devices */}
      <audio src={chimeSound} style={{ display: 'none' }} />
      
      {/* Time adjustment popup */}
      {isTimePopupOpen && (
        <div className="time-popup-overlay">
          <div className="time-popup">
            <div className="time-popup-header">
              <h3>Adjust Timer</h3>
              <button className="close-btn" onClick={() => setIsTimePopupOpen(false)}>×</button>
            </div>
            
            <div className="time-popup-content">
              <div className="time-input-group">
                <label htmlFor="minutes">Minutes:</label>
                <input
                  id="minutes"
                  type="number"
                  min="0"
                  max={isLongBreak ? settings.longBreakMinutes : (isBreak ? settings.breakMinutes : settings.workMinutes)}
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(Number(e.target.value))}
                />
              </div>
              
              <div className="time-input-group">
                <label htmlFor="seconds">Seconds:</label>
                <input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(Number(e.target.value))}
                />
              </div>
              
              <div className="time-popup-buttons">
                <button className="apply-btn" onClick={applyTimeAdjustment}>Apply</button>
                <button className="cancel-btn" onClick={() => setIsTimePopupOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Subtle settings icon in corner */}
      <div className="settings-icon" onClick={() => setIsAdminOpen(!isAdminOpen)}>
        ⚙️
      </div>
        <AdminMenu 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onSkipToBreak={skipToBreak}
        onSkipToLongBreak={skipToLongBreak}
        onSkipToWork={skipToWork}
        onGoBackSession={goBackSession}
        currentState={{ isBreak, isLongBreak, completedSessions }}
      />

      <div className="timer-header">
        <h1>{getSessionType()}</h1>
        <p>Stay focused and productive!</p>
        {completedSessions > 0 && (
          <p className="session-counter">Sessions completed: {completedSessions}</p>
        )}
      </div>
        <div className="timer-circle-container">
        <svg className="timer-circle" viewBox="0 0 360 360" width="360" height="360">
          {/* Background circle */}
          <circle
            cx="180"
            cy="180"
            r="160"
            fill="none"
            stroke="#8B7355"
            strokeWidth="12"
            opacity="0.4"
          />
          
          {/* Progress circle */}
          <circle
            cx="180"
            cy="180"
            r="160"
            fill="none"
            stroke={isBreak || isLongBreak ? "#E85A5A" : "#7B68EE"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 180 180)"
            className="progress-circle"
          />
        </svg>
          <div className="timer-content">
          <img src={katImage} alt="Cat" className="cat-image" />
          <div className="time-display" onClick={openTimePopup}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <button 
          className={`control-btn start-pause ${isActive ? 'pause' : 'start'}`}
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          className="control-btn reset"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>      <div className="session-info">
        <div className="session-type">
          <span className={!isBreak && !isLongBreak ? 'active' : ''}>Work</span>
          <span className={isBreak ? 'active' : ''}>Break</span>
          <span className={isLongBreak ? 'active' : ''}>Long Break</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
