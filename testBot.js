const probTotal = 100;

class Bot {
    constructor () {
        this.dynamiteCount = 100;
        this.enemyDynamite = 100;
        this.scores = new Map([['R', 100], ['P', 100], ['S', 100], ['W', 100], ['D', 100]]);
        this.probabilities = new Map();
        this.boundaries = new Map();//
        this.prevOpponentMove = undefined;
    }

    adjustMapValueBy(map, key, i) {
        map.set(key, map.get(key)+i);
    }

    recalculateProbabilities() {
        let total = 0;
        this.scores.forEach((value, key) => {
            total += value;
        });
        this.scores.forEach((value, key) => {
            const newProb = value*100/total;
            this.probabilities.set(key, newProb);
        })
    }

    recalculateBoundaries() {
        let runningTotal = 0;
        this.probabilities.forEach((value, key) => {
            runningTotal += value;
            this.boundaries.set(key, runningTotal);
        });
    }

    updateScores(lastRound) {
        if (this.dynamiteCount <= 0) {this.scores.set('D', 0);}
        if (lastRound.p2 = 'D') {this.enemyDynamite--; this.adjustMapValueBy(this.scores, 'W', -1)}
    }

    makeMove(gamestate) {
        const pt = 100*Math.random();
        const lastRound = gamestate.rounds[gamestate.rounds.length -1];
        if (lastRound !== undefined) {
            this.updateScores(lastRound);
        }
        this.recalculateProbabilities();
        this.recalculateBoundaries();
        //if (this.dynamiteCount > 0) {
        //these if statements must follow the order of the maps, for the boundaries to be correct, I'm working on making this not-manual, but for now this works
        if (pt < this.boundaries.get('R')) {
            return 'R';
        } else if (pt < this.boundaries.get('P')) {
            return 'P';
        } else if (pt < this.boundaries.get('S')) {
            return 'S';
        } else if (pt < this.boundaries.get('W')) {
            return 'W';
        } else {
            this.dynamiteCount--;
            return 'D';
        }
    }
}

module.exports = new Bot();