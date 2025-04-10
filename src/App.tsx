import React, { useState } from 'react';
import { Timer } from './components/Timer';
import TimeInput from './components/TimeInput';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [rounds, setRounds] = useState(3);
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

  const handleStartWorkout = () => {
    // Increment key to force Timer component to reset
    setKey(prevKey => prevKey + 1);
    // Close settings panel
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
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value) || 1)}
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
          <button className="close-settings" onClick={handleSettingsClick}>
            Close Settings
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
