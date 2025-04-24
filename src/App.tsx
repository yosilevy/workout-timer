import React, { useState } from 'react';
import { Timer } from './components/Timer';
import TimeInput from './components/TimeInput';
import './App.css';

// App version - update this when making significant changes
const APP_VERSION = '1.1.0';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [rounds, setRounds] = useState(3);
  const [roundsInput, setRoundsInput] = useState('3'); // New state for input value
  const [workMinutes, setWorkMinutes] = useState(1);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(0);
  const [restSeconds, setRestSeconds] = useState(30);
  const [key, setKey] = useState(0); // Key to force Timer component to reset

  const workDuration = workMinutes * 60 + workSeconds;
  const restDuration = restMinutes * 60 + restSeconds;

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const validateAndSaveRounds = () => {
    const parsedRounds = parseInt(roundsInput);
    if (!isNaN(parsedRounds) && parsedRounds >= 1 && parsedRounds <= 20) {
      setRounds(parsedRounds);
      return true;
    } else {
      // Reset to valid value
      setRoundsInput(rounds.toString());
      return false;
    }
  };

  const handleStartWorkout = () => {
    // Validate rounds before starting
    if (validateAndSaveRounds()) {
      // Increment key to force Timer component to reset
      setKey(prevKey => prevKey + 1);
      // Close settings panel
      setShowSettings(false);
    }
  };

  const handleCloseSettings = () => {
    // Validate rounds before closing
    validateAndSaveRounds();
    setShowSettings(false);
  };

  return (
    <div className="app">
      <Timer
        key={key}
        rounds={rounds}
        workDuration={workDuration}
        restDuration={restDuration}
        onSettingsClick={handleSettingsClick}
      />
      
      {showSettings && (
        <div className="settings-panel">
          <h2>Workout Settings</h2>
          <div className="settings-group">
            <label>Rounds:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={roundsInput}
              onChange={(e) => setRoundsInput(e.target.value)}
            />
          </div>
          <div className="settings-group">
            <label>Work Duration:</label>
            <TimeInput
              minutes={workMinutes}
              seconds={workSeconds}
              onMinutesChange={setWorkMinutes}
              onSecondsChange={setWorkSeconds}
            />
          </div>
          <div className="settings-group">
            <label>Rest Duration:</label>
            <TimeInput
              minutes={restMinutes}
              seconds={restSeconds}
              onMinutesChange={setRestMinutes}
              onSecondsChange={setRestSeconds}
            />
          </div>
          <button className="start-workout-button" onClick={handleStartWorkout}>
            Start Workout
          </button>
          <button className="close-settings" onClick={handleCloseSettings}>
            Close Settings
          </button>
          <div className="version-info">v{APP_VERSION}</div>
        </div>
      )}
    </div>
  );
}

export default App;
