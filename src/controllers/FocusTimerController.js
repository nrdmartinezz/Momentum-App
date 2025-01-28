class FocusTimerController {
    constructor(workDuration, shortBreakDuration, longBreakDuration) {
        this.workDuration = workDuration * 60; // convert minutes to seconds
        this.shortBreakDuration = shortBreakDuration * 60; // convert minutes to seconds
        this.longBreakDuration = longBreakDuration * 60; // convert minutes to seconds
        this.timeRemaining = this.workDuration;
        this.timer = null;
        this.shortCount = 0;
        this.mode ="WORK"; // modes are "WORK" "SHORT" "LONG"
    }

    startTimer(callback) {
        if (this.timer) return; // Timer is already running

        this.timer = setInterval(() => {
            this.timeRemaining -= 1;
            if (this.timeRemaining <= 0 && this.shortCount < 3) {
               if(this.mode === "WORK"){
                this.mode = "SHORT";
                this.timeRemaining = this.shortBreakDuration;
                this.shortCount++;
               }else if (this.mode=== "SHORT"){
                this.mode = "WORK";
                this.timeRemaining = this.workDuration;
               }
            }else if(this.shortCount >= 3 && this.timeRemaining <= 0){
                if(this.mode === "WORK"){
                    this.mode = "LONG";
                    this.timeRemaining = this.longBreakDuration;
                }else if(this.mode ==="LONG"){
                    this.mode = "WORK";
                    this.timeRemaining = this.workDuration;
                    this.shortCount = 0;
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
        this.timeRemaining = this.workDuration;
    }

    getTimeRemaining() {
        return this.timeRemaining;
    }

    getMode() {
        return this.mode;
    }

    getShortCount(){
        return this.shortCount;
    }

    startShortBreak(callback){
        this.pauseTimer();
        this.mode = "SHORT";
        this.timeRemaining = this.shortBreakDuration;
        // this.startTimer(callback);
    }

    startLongBreak(callback){
        this.pauseTimer();
        this.mode = "LONG";
        this.timeRemaining = this.longBreakDuration;
        // this.startTimer(callback);
    }

    startWork(callback){
        this.pauseTimer();
        this.mode = "WORK";
        this.timeRemaining = this.workDuration;
        // this.startTimer(callback);
    }
}

export default FocusTimerController;