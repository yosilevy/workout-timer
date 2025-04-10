import React, { useState, useEffect, useCallback } from 'react';
import './Timer.css';

interface TimerProps {
  rounds: number;
  workDuration: number; // in seconds
  restDuration: number; // in seconds
}

interface TimerState {
  isRunning: boolean;
  isWorkout: boolean;
  currentRound: number;
  timeLeft: number;
  isDone: boolean;
}

export const Timer: React.FC<TimerProps> = ({ rounds, workDuration, restDuration }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isWorkout: true,
    currentRound: 1,
    timeLeft: workDuration,
    isDone: false,
  });

  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerId) return;

    const id = setInterval(() => {
      setTimerState((prevState) => {
        if (prevState.timeLeft <= 1) {
          // Time's up for current period
          if (prevState.isWorkout) {
            // Check if this is the last round
            if (prevState.currentRound >= rounds) {
              // Workout complete
              clearInterval(id);
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

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  // Determine background color based on workout/rest/done state
  const backgroundColor = timerState.isDone 
    ? 'var(--done-bg)' 
    : (timerState.isWorkout ? 'var(--workout-bg)' : 'var(--rest-bg)');

  return (
    <div className="timer-container" style={{ backgroundColor }}>
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
      <div className="timer-controls">
        {!timerState.isRunning && !timerState.isDone ? (
          <button onClick={startTimer} className="control-button">
            Start
          </button>
        ) : timerState.isRunning ? (
          <button onClick={pauseTimer} className="control-button">
            Pause
          </button>
        ) : null}
        {!timerState.isDone && (
          <button onClick={skipPeriod} className="control-button">
            Skip
          </button>
        )}
      </div>
    </div>
  );
}; 