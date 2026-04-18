import React, { useState } from 'react';
import { Timer } from './components/Timer';
import TimeInput from './components/TimeInput';
import './App.css';

// App version - update this when making significant changes
const APP_VERSION = '1.2.0';

type RoundEndSound = 'off' | 'random' | 'softBeep' | 'alertChime' | 'miniSiren' | 'faultAlarm';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [rounds, setRounds] = useState(6);
  const [roundsInput, setRoundsInput] = useState('6'); // New state for input value
  const [workMinutes, setWorkMinutes] = useState(4);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(0);
  const [restSeconds, setRestSeconds] = useState(45);
  const [roundEndSound, setRoundEndSound] = useState<RoundEndSound>('off');
  const [soundRepeatCount, setSoundRepeatCount] = useState(2);
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
        roundEndSound={roundEndSound}
        soundRepeatCount={soundRepeatCount}
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
          <div className="settings-group">
            <label>Round End Sound:</label>
            <select
              value={roundEndSound}
              onChange={(e) => setRoundEndSound(e.target.value as RoundEndSound)}
            >
              <option value="off">Off</option>
              <option value="random">Random</option>
              <option value="softBeep">Soft Beep</option>
              <option value="alertChime">Alert Chime</option>
              <option value="miniSiren">Mini Siren</option>
              <option value="faultAlarm">Fault Alarm</option>
            </select>
          </div>
          <div className="settings-group">
            <label>Sound Repeats:</label>
            <select
              value={soundRepeatCount}
              onChange={(e) => setSoundRepeatCount(parseInt(e.target.value, 10))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
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
