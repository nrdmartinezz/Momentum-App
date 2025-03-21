import alarmSound from "../assets/sounds/soymilk.mp3";

class FocusTimerController {
  constructor(workDuration, shortBreakDuration, longBreakDuration) {
    this.workDuration = workDuration * 60; // convert minutes to seconds
    this.shortBreakDuration = shortBreakDuration *60 ; // convert minutes to seconds
    this.longBreakDuration = longBreakDuration *60; // convert minutes to seconds
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
    switch (mode) {
      case "SHORT":
        this.mode = mode;
        this.timeRemaining = this.shortBreakDuration;
        break;
      case "LONG":
        this.mode = mode;
        this.timeRemaining = this.longBreakDuration;
        break;
      case "WORK":
        this.mode = mode;
        this.timeRemaining = this.workDuration;
        break;
    }
    this.startTimer(callback);
  }
}

export default FocusTimerController;
