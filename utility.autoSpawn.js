// Manual configurations
const stopSpawning = false;

// Desired number of creeps per role
const harvesterNum = 2;
const upgraderNum = 1;
const builderNum = 1;
const minerNum = 2;
const roadieNum = 0;
const wallRampartRepairerNum = 0;

// Creep body configurations
const harvesterBody = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
const upgraderBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
const builderBody = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
const minerBody = [WORK, WORK, WORK, WORK, WORK, MOVE];
const roadieBody = [WORK, CARRY, MOVE, MOVE];
const wallRampartRepairerBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];

// Priority order for spawning creeps
const spawnPriority = [
    'miner',
    'harvester',
    'upgrader',
    'builder',
    'roadie',
    'wallRampartRepairer'
];

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

        if (!Memory.emergency) {
            Memory.emergency = {
                'emergencyMode': false,
                'emergencyCreepCount': 0,
                'emergencyAnnounce': false
            };
        }

        if (_.size(Game.creeps) == 0 && Memory.emergency.emergencyCreepCount == 0) {
            Memory.emergency.emergencyMode = true;
            if (Memory.emergency.emergencyAnnounce == false) {
                console.log('Emergency! No creeps detected! Spawning emergency creep.');
                Memory.emergency.emergencyAnnounce = true;
            }
        }

        if (Memory.emergency.emergencyMode == true) {
            if (Memory.emergency.emergencyCreepCount < 4) {
                if (Game.spawns['Capital'].room.energyAvailable >= 300) {
                   emergencySpawn([WORK, WORK, CARRY, MOVE], 'emergencyCreep');
                    Memory.emergency.emergencyCreepCount += 1;
                    return;
                } else {
                    return;
                }
            } else {
                Memory.emergency.emergencyMode = false;
                Memory.emergency.emergencyCreepCount = 0;
                Memory.emergency.emergencyAnnounce = false;
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
                case 'roadie':
                    numCreeps = roadieNum;
                    body = roadieBody;
                    break;
                case 'wallRampartRepairer':
                    numCreeps = wallRampartRepairerNum;
                    body = wallRampartRepairerBody;
                    break;
                default:
                    console.log('Unknown role: ' + role);
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