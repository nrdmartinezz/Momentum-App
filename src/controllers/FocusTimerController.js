class FocusTimerController {
    constructor(workDuration, shortBreakDuration, longBreakDuration) {
        this.workDuration = workDuration * 60; // convert minutes to seconds
        this.shortBreakDuration = shortBreakDuration * 60; // convert minutes to seconds
        this.longBreakDuration = longBreakDuration * 60; // convert minutes to seconds
        this.isWorkTime = true;
        this.timeRemaining = this.workDuration;
        this.timer = null;
        this.shortCount = 0;
    }

    startTimer(callback) {
        if (this.timer) return; // Timer is already running

        this.timer = setInterval(() => {
            this.timeRemaining -= 1;
            if (this.timeRemaining <= 0 && this.shortCount < 3) {
                this.isWorkTime = !this.isWorkTime;
                this.timeRemaining = this.isWorkTime ? this.workDuration : this.shortBreakDuration;
               if (this.isWorkTime) {this.shortCount++;}
            }else if(this.shortCount >= 3 && this.timeRemaining <= 0){
                this.isWorkTime = !this.isWorkTime;
                this.timeRemaining = this.isWorkTime ? this.workDuration : this.longBreakDuration;
                this.shortCount = 0;
            }
            callback(this.timeRemaining, this.isWorkTime);
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
        this.timeRemaining = this.workDuration;
    }

    getTimeRemaining() {
        return this.timeRemaining;
    }

    isWorkPeriod() {
        return this.isWorkTime;
    }

    getShortCount(){
        return this.shortCount;
    }

    startShortBreak(callback){
        this.pauseTimer();
        this.isWorkTime = false;
        this.timeRemaining = this.shortBreakDuration;
        this.startTimer(callback);
    }

    startLongBreak(callback){
        this.pauseTimer();
        this.isWorkTime = false;
        this.timeRemaining = this.longBreakDuration;
        this.startTimer(callback);
    }
}

export default FocusTimerController;