const stopSpawning = false;

const harvesterNum = 1;
const upgraderNum = 1;
const builderNum = 0;
const minerNum = 1;
const repairerNum = 0;

const harvesterBody = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
const upgraderBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
const builderBody = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
const minerBody = [WORK, WORK, WORK, WORK, WORK, MOVE];
// const repairerBody = [WORK, WORK, CARRY, MOVE];
// const basicCombatCreepBody = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];

const spawnPriority = ['miner', 'harvester', 'upgrader', 'builder'];

function getBodyCost(body) {
    return _.sum(body, part => BODYPART_COST[part]);
}

function emergencySpawn(body, role) {
    const newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
    console.log('Spawning new ' + role + ': ' + newName);
    Game.spawns['Capital'].spawnCreep(body, newName, {memory: {role: role}});
}

const autoSpawn = {
    run: function() {

        if (stopSpawning) {
            return;
        }

        if (Game.spawns['Capital'].spawning) {
            return;
        }

        if (_.size(Game.creeps) == 0) {
            emergencySpawn([WORK, WORK, CARRY, MOVE], 'emergencyCreep');
            Memory.emergency = {};
            Memory.emergency['emergencyMode'] = true;
            console.log('No miners detected, entering emergency mode!');
            Memory.emergency['emergencyCreepCount'] = 1;
            return;            
        }

        if (Memory.emergency['emergencyMode']) {
            if (Memory.emergency['emergencyCreepCount'] < 4) {
                if (Game.spawns['Capital'].room.energyAvailable >= 550) {
                    emergencySpawn([WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'emergencyCreep');
                    Memory.emergency['emergencyCreepCount'] += 1;
                    return;
                } else {
                    emergencySpawn([WORK, WORK, CARRY, MOVE], 'emergencyCreep');
                    Memory.emergency['emergencyCreepCount'] += 1;
                    return;
                }
            } else {
                Memory.emergency['emergencyMode'] = false;
                delete Memory.emergency;
                console.log('Emergency over, resuming normal spawn operations.');
            }
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