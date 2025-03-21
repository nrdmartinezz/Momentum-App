// src/utils/getDurations.js
export function getDurations() {
  const workDuration = localStorage.getItem('workDuration') || 25 * 60;
  const shortBreakDuration = localStorage.getItem('shortBreakDuration') || 5 * 60;
  const longBreakDuration = localStorage.getItem('longBreakDuration') || 15 * 60;

  return {
    workDuration: parseInt(workDuration, 10),
    shortBreakDuration: parseInt(shortBreakDuration, 10),
    longBreakDuration: parseInt(longBreakDuration, 10),
  };
}