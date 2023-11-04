// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file contains a set of helper functions

// create class for helper functions
class Helpers {
    // function to get the current date
    static getCurrentDate() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    // function to get the current time
    static getCurrentTime() {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    }

    // function to use a custom log
    static rlog(...args) {
        // append LOG_PREFIX to the arguments at the beginning
          args.unshift(LOG_PREFIX);
          console.log(...args);
          return;
    }

}