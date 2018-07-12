const probTotal = 100;

class Bot {
    constructor () {
        this.dynamiteCount = 100;
        this.enemyDynamite = 100;
        this.scores = new Map([['R', 100], ['P', 100], ['S', 100], ['W', 50], ['D', 100]]);
        this.probabilities = new Map();
        this.boundaries = new Map();
        this.prevOpponentMove = undefined;
        this.rounds = 0;
        this.drawStack = 1;
        this.points = 0;
        this.optimal = [this.updateScoresBasic, 0]
        this.opponentCount = new Map([['R', 100], ['P', 100], ['S', 0], ['W', 0], ['D', 0]]);
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

    //possible strategies to play
    updateScoresBasic(lastRound) {
        switch (lastRound.p2) {
            case 'W':
                this.adjustMapValueBy(this.scores, 'D', 1);
                break;
            case 'D':
                this.enemyDynamite--;
                this.adjustMapValueBy(this.scores, 'W', -1);
                this.adjustMapValueBy(this.scores, 'D', 1);
                break;
            default:

        }
        if (lastRound.p1 === lastRound.p2) {this.adjustMapValueBy(this.scores, 'D', 1)};
        this.scores.forEach((value, key) => {
            if (value<0) {this.scores.set(key, 0)}
        });
        if (this.prevOpponentMove === lastRound.p2) {

        }
        if (this.dynamiteCount <= 0) {this.scores.set('D', 0);}
    }

    updateScoreFrequencyCount(lastRound) {
        const whatNext = new Map([['P', 'S'], ['S', 'R'], ['R', 'P'], ['D', 'W'], ['W', 'R']]);

    }

    updateWinner(lastRound) {
        if (lastRound.p1 === lastRound.p2) {this.drawStack++;}
        else {
            switch(lastRound.p2) {
                case 'D':
                    if (lastRound.p1 === 'W') {
                        this.points += this.drawStack;
                    }
                    break;
                case 'W':
                    if (lastRound.p1 !== 'D') {
                        this.points += this.drawStack;
                    }
                    break;
                case 'P':
                    if (['D', 'S'].includes(lastRound.p1)) {
                        this.points += this.drawStack;
                    }
                    break;
                case 'S':
                    if (['D', 'R'].includes(lastRound.p1)) {
                        this.points += this.drawStack;
                    }
                    break;
                case 'R':
                    if (['D', 'P'].includes(lastRound.p1)) {
                        this.points += this.drawStack;
                    }
                    break;
            }
            this.drawStack = 1;
        }
    }

    updateState(lastRound) {
        this.prevOpponentMove = lastRound.p2;
        this.moves++;
        this.updateWinner(lastRound);
    }

    makeMove(gamestate) {
        const pt = 100*Math.random();
        const lastRound = gamestate.rounds[gamestate.rounds.length -1];
        //trial a few strategies for 100 rounds each, then continue with optimal one for rest of game
        if (this.rounds === 100) {this.optimal = [this.updateScoresBasic, this.points]; this.points = 0;}
        if (this.rounds === 200 && this.points > this.optimal[1]) {this.optimal = [this.updateScoreFrequencyCount, this.points]; this.points = 0;}
        if (this.rounds<100) {
            this.updateScoresBasic(lastRound);
        } else if (this.rounds<200) {
            this.updateScoreFrequencyCount(lastRound);
        } else {
            this.optimal[0](lastRound);
        }

        this.recalculateProbabilities();
        this.recalculateBoundaries();
        this.updateState(lastRound);
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
            // this.boundaries.forEach((value, key) => {
        //             //     if (pt < value) {
        //             //         console.log(`playing ${key} because rand = ${pt} and the boundary for ${key} is ${value}`);
        //             //         if (key === 'D') {this.dynamiteCount--;}
        //             //         mov = key;
        //             //         break;
        //             //     }
        //             // })
        //             // return mov;
    }
}

module.exports = new Bot();