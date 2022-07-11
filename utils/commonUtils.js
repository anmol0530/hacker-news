export function timeSince(date) {

    var seconds = Math.floor((new Date() - date * 1000) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export function debounce(fn, delay) {
    let timer;
    return function () {
        const context = this;
        const args = arguments;
        clearInterval(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    }
};