function getRandomValue(min, max) {
    // Returns a random attack integer value between min and max args
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            healthPlayer: 100,      // starting health of the Player
            healthMonster: 100,     // starting health of the Monster
            currentRound: 0,        // round obviously starts at 0
            winner: null,           // winner of the game
            logs: []                // battle logs
        }
    },
    watch: {
        healthPlayer(value) {
            if(value <= 0 && this.healthMonster <= 0) {
                this.winner = 'draw'
            } else if(value > 0 && this.healthMonster <= 0) {
                this.winner = 'player'
            }
        },
        healthMonster(value) {
            if(value > 0 && this.healthPlayer <= 0) {
                this.winner = 'monster'
            }
        }
    },
    computed: {
        healthMonsterStyle() {
            if(this.healthMonster <= 0) {
                return { width: '0%' } // fixes the health bar
            } else {
                return { width: this.healthMonster + '%' }
            }
        },
        healthPlayerStyle() {
            if(this.healthPlayer <= 0) {
                return { width: '0%' } // fixes the health bar
            } else {
                return { width: this.healthPlayer + '%' }
            }
        },
        disableSpecialAttack() {
            // allow to use SpecialAttack every 3 rounds
            return this.currentRound % 3 !== 0 || this.currentRound === 0
        }
    },
    methods: {
        startGame() {
            // reset the data for new game
            this.healthPlayer = 100
            this.healthMonster = 100
            this.currentRound = 0
            this.winner = null
            this.logs = []
        },
        attackByMonster() {
            const attackVal = getRandomValue(8, 15)
            this.healthPlayer -= attackVal
            this.addLog('monster', 'attack', attackVal)
        },
        attackByPlayer() {
            this.currentRound++ // increment the round count
            const attackVal = getRandomValue(5, 12)
            this.healthMonster -= attackVal
            this.addLog('player', 'attack', attackVal)
            this.attackByMonster() // player gets hit by monster on each attack
        },
        specialAttack() {
            this.currentRound++ // increment the round count
            const attackVal = getRandomValue(10, 25) // larger value than normal
            this.healthMonster -= attackVal
            this.addLog('player', 'attack', attackVal)
            this.attackByMonster() // player should still get hit by monster
        },
        healPlayer() {
            this.currentRound++ // increment the round count
            const healVal = getRandomValue(8, 15)
            // make sure the health value does not exceed 100
            if(this.healthPlayer + healVal > 100) {
                this.healthPlayer = 100;
            } else {
                this.healthPlayer += healVal;
            }
            this.addLog('player', 'heal', healVal)
            this.attackByMonster() // player should still get hit by monster
        },
        surrender() {
            this.winner = 'monster'
        },
        addLog(actionBy, actionType, actionValue) {
            this.logs.unshift({
                actionBy: actionBy,
                actionType: actionType,
                actionValue: actionValue
            })
        }
    }
});

app.mount('#game');
