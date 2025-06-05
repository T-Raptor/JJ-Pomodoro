import { useState, useEffect, useRef } from 'react';
import katImage from '../assets/kat.jpg';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      if (isBreak) {
        // Break finished, start work session
        setIsBreak(false);
        setTimeLeft(workTime);
      } else {
        // Work session finished, start break
        setIsBreak(true);
        setTimeLeft(breakTime);
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, isBreak, workTime, breakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(workTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak ? breakTime : workTime;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const circumference = 2 * Math.PI * 160; // radius = 160
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="pomodoro-container">
      <div className="timer-header">
        <h1>{isBreak ? 'Break Time' : 'Focus Time'}</h1>
        <p>Stay focused and productive!</p>
      </div>
      
      <div className="timer-circle-container">        <svg className="timer-circle" width="360" height="360">
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
            stroke={isBreak ? "#E85A5A" : "#7B68EE"}
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
          <div className="time-display">
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
      </div>

      <div className="session-info">
        <div className="session-type">
          <span className={!isBreak ? 'active' : ''}>Work</span>
          <span className={isBreak ? 'active' : ''}>Break</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
