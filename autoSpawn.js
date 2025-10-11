const stopSpawning = false;

const harvesterNum = 3;
const upgraderNum = 1;
const builderNum = 3;
const minerNum = 1;
const repairerNum = 0;

const harvesterBody = [CARRY, CARRY, MOVE];
const upgraderBody = [WORK, WORK, CARRY, MOVE];
const builderBody = [WORK, WORK, CARRY, MOVE];
const minerBody = [WORK, WORK, WORK, WORK, WORK, MOVE];
const repairerBody = [WORK, WORK, CARRY, MOVE];

const spawnPriority = ['miner', 'harvester', 'upgrader', 'builder', 'repairer'];

function getBodyCost(body) {
    return _.sum(body, part => BODYPART_COST[part]);
}

const autoSpawn = {
    run: function() {

        if (stopSpawning) {
            return;
        }

        if (Game.spawns['Capital'].spawning) {
            return;
        }

        for (const role of spawnPriority) {
            let numCreeps;
            let body;
            switch(role) {
                case 'harvester':
                    numCreeps = harvesterNum;
                    body = harvesterBody;
                    break;
                case 'upgrader':
                    numCreeps = upgraderNum;
                    body = upgraderBody;
                    break;
                case 'builder':
                    numCreeps = builderNum;
                    body = builderBody;
                    break;
                case 'miner':
                    numCreeps = minerNum;
                    body = minerBody;
                    break;
                case 'repairer':
                    numCreeps = repairerNum;
                    body = repairerBody;
                    break;
                default:
                    continue;
            }

            const creepCost = getBodyCost(body);
            const creepsOfRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);

            if (creepsOfRole.length < numCreeps && Game.spawns['Capital'].room.energyAvailable >= creepCost) {
                const newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
                console.log('Spawning new ' + role + ': ' + newName);
                Game.spawns['Capital'].spawnCreep(body, newName, {memory: {role: role}});
                break;
            }
        }
    }
};

module.exports = autoSpawn;