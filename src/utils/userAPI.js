const API_ROUTE = "http://localhost:3000/api/users"

class UserStateController {
    constructor() {
        this.userStates = new Map({
            email:"",
            themeID:"846341",
            pomodoroDuration:25,
            shortBreakDuration:5,
            longBreakDuration:15,
        });
    }

    // Get the state of a user by ID
    login(email,pw) {
      try {
        fetch(API_ROUTE + "/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: pw,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            localStorage.setItem("token", data.token);  
            localStorage.setItem("user", JSON.stringify(data.name));
            localStorage.setItem("themeID", JSON.stringify(data.themeID));
            localStorage.setItem("pomodoroDuration", JSON.stringify(data.pomodoroDuration));
            localStorage.setItem("shortBreakDuration", JSON.stringify(data.shortBreakDuration));
            localStorage.setItem("longBreakDuration", JSON.stringify(data.longBreakDuration));    
            return data;
          });
      } catch (error) {
        console.log(error);
        
      }
    }

    // Set the state of a user by ID
    setUserState(userId, state) {
        this.userStates.set(userId, state);
    }

    // Remove the state of a user by ID
    removeUserState() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
    }

    // Clear all user states
    clearAllUserStates() {
       localStorage.clear();
    }
}

export default UserStateController;