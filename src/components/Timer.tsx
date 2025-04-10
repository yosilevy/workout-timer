import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Timer.css';

interface TimerProps {
  rounds: number;
  workDuration: number; // in seconds
  restDuration: number; // in seconds
  onSettingsClick: () => void;
}

interface TimerState {
  isRunning: boolean;
  isWorkout: boolean;
  currentRound: number;
  timeLeft: number;
  isDone: boolean;
}

export const Timer: React.FC<TimerProps> = ({ rounds, workDuration, restDuration, onSettingsClick }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isWorkout: true,
    currentRound: 1,
    timeLeft: workDuration,
    isDone: false,
  });

  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Function to request wake lock to prevent screen from turning off
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.error('Wake Lock error:', err);
    }
  };

  // Function to release wake lock
  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release()
        .then(() => {
          wakeLockRef.current = null;
        });
    }
  };

  const startTimer = useCallback(() => {
    if (timerId) return;

    // Request wake lock when starting the timer
    requestWakeLock();

    // Set isRunning to true immediately
    setTimerState(prev => ({ ...prev, isRunning: true }));

    const id = setInterval(() => {
      setTimerState((prevState) => {
        if (prevState.timeLeft <= 1) {
          // Time's up for current period
          if (prevState.isWorkout) {
            // Check if this is the last round
            if (prevState.currentRound >= rounds) {
              // Workout complete
              clearInterval(id);
              // Release wake lock when workout is complete
              releaseWakeLock();
              return {
                isRunning: false,
                isWorkout: true,
                currentRound: rounds,
                timeLeft: 0,
                isDone: true,
              };
            }
            // Switching to rest
            return {
              isRunning: true,
              isWorkout: false,
              currentRound: prevState.currentRound,
              timeLeft: restDuration,
              isDone: false,
            };
          } else {
            // Switching to next round
            return {
              isRunning: true,
              isWorkout: true,
              currentRound: prevState.currentRound + 1,
              timeLeft: workDuration,
              isDone: false,
            };
          }
        }

        return {
          ...prevState,
          timeLeft: prevState.timeLeft - 1,
        };
      });
    }, 1000);

    setTimerId(id);
  }, [rounds, workDuration, restDuration, timerId]);

  const pauseTimer = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
      setTimerState((prev) => ({ ...prev, isRunning: false }));
    }
  }, [timerId]);

  const skipPeriod = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }

    setTimerState((prevState) => {
      if (prevState.isWorkout) {
        // Check if this is the last round
        if (prevState.currentRound >= rounds) {
          // Workout complete
          // Release wake lock when workout is complete
          releaseWakeLock();
          return {
            isRunning: false,
            isWorkout: true,
            currentRound: rounds,
            timeLeft: 0,
            isDone: true,
          };
        }
        // Skip to rest
        return {
          isRunning: true,
          isWorkout: false,
          currentRound: prevState.currentRound,
          timeLeft: restDuration,
          isDone: false,
        };
      } else {
        // Skip to next round
        return {
          isRunning: true,
          isWorkout: true,
          currentRound: prevState.currentRound + 1,
          timeLeft: workDuration,
          isDone: false,
        };
      }
    });

    // Start the timer immediately after skipping
    const id = setInterval(() => {
      setTimerState((prevState) => {
        if (prevState.timeLeft <= 1) {
          // Time's up for current period
          if (prevState.isWorkout) {
            // Check if this is the last round
            if (prevState.currentRound >= rounds) {
              // Workout complete
              clearInterval(id);
              // Release wake lock when workout is complete
              releaseWakeLock();
              return {
                isRunning: false,
                isWorkout: true,
                currentRound: rounds,
                timeLeft: 0,
                isDone: true,
              };
            }
            // Switching to rest
            return {
              isRunning: true,
              isWorkout: false,
              currentRound: prevState.currentRound,
              timeLeft: restDuration,
              isDone: false,
            };
          } else {
            // Switching to next round
            return {
              isRunning: true,
              isWorkout: true,
              currentRound: prevState.currentRound + 1,
              timeLeft: workDuration,
              isDone: false,
            };
          }
        }

        return {
          ...prevState,
          timeLeft: prevState.timeLeft - 1,
        };
      });
    }, 1000);

    setTimerId(id);
  }, [rounds, workDuration, restDuration, timerId]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up wake lock when component unmounts
  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
      releaseWakeLock();
    };
  }, [timerId]);

  // Determine background color based on workout/rest/done state
  const backgroundColor = timerState.isDone 
    ? 'var(--done-bg)' 
    : (timerState.isWorkout ? 'var(--workout-bg)' : 'var(--rest-bg)');

  return (
    <div className="timer-container" style={{ backgroundColor }}>
      <button className="settings-button" onClick={onSettingsClick}>
        <span className="hamburger">☰</span>
      </button>
      
      <div className="timer-content">
        <div className="timer-display">
          {timerState.isDone ? 'DONE!!!' : formatTime(timerState.timeLeft)}
        </div>
        <div className="timer-status">
          <div className="phase">
            {timerState.isDone 
              ? 'Workout Complete' 
              : (timerState.isWorkout ? 'Workout' : 'Rest')}
          </div>
          <div className="round">Round {timerState.currentRound} of {rounds}</div>
        </div>
      </div>
      
      <div className="timer-controls">
        {!timerState.isDone && (
          <>
            <button 
              onClick={timerState.isRunning ? pauseTimer : startTimer} 
              className="control-button"
            >
              {timerState.isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={skipPeriod} className="control-button">
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}; 