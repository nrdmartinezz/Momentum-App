import alarmSound from "../assets/sounds/notification-momentum.mp3";

class FocusTimerController {
  constructor(workDuration, shortBreakDuration, longBreakDuration) {
    this.workDuration = workDuration; // convert minutes to seconds
    this.shortBreakDuration = shortBreakDuration; // convert minutes to seconds
    this.longBreakDuration = longBreakDuration; // convert minutes to seconds
    this.timeRemaining = this.workDuration ;
    this.timer = null;
    this.shortCount = 0;
    this.mode = "WORK"; // modes are "WORK" "SHORT" "LONG"
    this.alarm = new Audio(alarmSound);
  }

  startTimer(callback) {
    if (this.timer) return; // Timer is already running

    this.timer = setInterval(() => {
      this.timeRemaining -= 1;

      if (this.timeRemaining <= 0) {
        this.ringAlarm();
      }

      if (this.timeRemaining <= 0 && this.shortCount < 2) {
        if (this.mode === "WORK") {
          this.mode = "SHORT";
          this.timeRemaining = this.shortBreakDuration;
          this.shortCount++;
        } else if (this.mode === "SHORT") {
          this.mode = "WORK";
          this.timeRemaining = this.workDuration;
        }
      } else if (this.shortCount >= 2 && this.timeRemaining <= 0) {
        if (this.mode === "WORK") {
          this.mode = "LONG";
          this.timeRemaining = this.longBreakDuration;
          this.shortCount++;
        } else if (this.mode === "LONG") {
          this.mode = "WORK";
          this.timeRemaining = this.workDuration;
          this.shortCount = 0;
        } else if (this.mode === "SHORT") {
          this.mode = "WORK";
          this.timeRemaining = this.workDuration;
        }
      }
      callback(this.timeRemaining, this.mode);
    }, 1000);
  }

  pauseTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.pauseTimer();

    switch (this.mode) {
      case "SHORT":
        this.timeRemaining = this.shortBreakDuration;
        break;
      case "LONG":
        this.timeRemaining = this.longBreakDuration;
        break;
      case "WORK":
        this.timeRemaining = this.workDuration;
        break;
    }
  }

  ringAlarm() {
    this.alarm.play();
  }

  getTimeRemaining() {
    return this.timeRemaining;
  }

  getMode() {
    return this.mode;
  }

  getShortCount() {
    return this.shortCount;
  }

  startMode(callback, mode) {
    this.pauseTimer();
    this.mode = mode;
    this.timeRemaining = this.getDurationForMode(mode);
    callback(this.timeRemaining, this.mode);
  }

  changeMode(mode) {
    this.pauseTimer();
    this.mode = mode;
    this.timeRemaining = this.getDurationForMode(mode);
  }

  getDurationForMode(mode) {
    switch (mode) {
      case "SHORT":
        return this.shortBreakDuration;
      case "LONG":
        return this.longBreakDuration;
      case "WORK":
        return this.workDuration;
      default:
        return this.workDuration;
    }
  }

  setDurations(workDuration, shortBreakDuration, longBreakDuration) {
    this.workDuration = workDuration;
    this.shortBreakDuration = shortBreakDuration;
    this.longBreakDuration = longBreakDuration;
    
    // Update timeRemaining if timer is not running
    if (!this.timer) {
      this.timeRemaining = this.getDurationForMode(this.mode);
    }
  }
}

export default FocusTimerController;
