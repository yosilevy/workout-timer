import React, { useState, useEffect } from 'react';
import './TimeInput.css';

interface TimeInputProps {
  label: string;
  value: number; // in seconds
  onChange: (seconds: number) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange }) => {
  const [minutes, setMinutes] = useState<number>(Math.floor(value / 60));
  const [seconds, setSeconds] = useState<number>(value % 60);

  useEffect(() => {
    // Update the parent component when minutes or seconds change
    const totalSeconds = minutes * 60 + seconds;
    onChange(totalSeconds);
  }, [minutes, seconds, onChange]);

  useEffect(() => {
    // Update local state when the value prop changes
    setMinutes(Math.floor(value / 60));
    setSeconds(value % 60);
  }, [value]);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = parseInt(e.target.value);
    setMinutes(newMinutes);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeconds = parseInt(e.target.value);
    setSeconds(newSeconds);
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
      <label className="time-input-label">{label}</label>
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