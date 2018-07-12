class Bot {
    makeMove(gamestate) {
        const pt = 100*Math.random();
        if (pt<20) {
            return 'R';
        } else if (pt<40) {
            return 'S';
        } else if (pt<60) {
            return 'P';
        } else if (pt<80) {
            return 'W';
        } else {
            return 'D';
        }
    }
}

module.exports = new Bot();