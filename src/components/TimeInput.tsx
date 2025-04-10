import React from 'react';
import './TimeInput.css';

interface TimeInputProps {
  minutes: number;
  seconds: number;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ 
  minutes, 
  seconds, 
  onMinutesChange, 
  onSecondsChange 
}) => {
  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = parseInt(e.target.value);
    onMinutesChange(newMinutes);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeconds = parseInt(e.target.value);
    onSecondsChange(newSeconds);
  };

  // Generate options for minutes (0-10)
  const minuteOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={i} value={i}>{i}</option>
  ));

  // Generate options for seconds (0-59)
  const secondOptions = Array.from({ length: 60 }, (_, i) => (
    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
  ));

  return (
    <div className="time-input-container">
      <div className="time-input-fields">
        <div className="time-input-field">
          <select
            value={minutes}
            onChange={handleMinutesChange}
            className="time-select"
          >
            {minuteOptions}
          </select>
          <span className="time-input-label">min</span>
        </div>
        <div className="time-input-separator">:</div>
        <div className="time-input-field">
          <select
            value={seconds}
            onChange={handleSecondsChange}
            className="time-select"
          >
            {secondOptions}
          </select>
          <span className="time-input-label">sec</span>
        </div>
      </div>
    </div>
  );
};

export default TimeInput; 