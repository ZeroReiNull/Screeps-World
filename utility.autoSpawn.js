// Manual configurations
const stopSpawning = false;

// Desired number of creeps per role
const harvesterNum = 2;
const upgraderNum = 1;
const builderNum = 0;
const minerNum = 2;
const roadieNum = 0;
const wallRampartRepairerNum = 0;

// Creep body configurations
const harvesterBody = {
    'CARRY': 3,
    'MOVE': 3
};
const upgraderBody = {
    'WORK': 5,
    'CARRY': 1,
    'MOVE': 1
};
const builderBody = {
    'WORK': 9,
    'CARRY': 9,
    'MOVE': 9
};
const minerBody = {
    'WORK': 5,
    'MOVE': 1
};
const roadieBody = {
    'WORK': 6,
    'CARRY': 12,
    'MOVE': 12
};
const wallRampartRepairerBody = {
    'WORK': 12,
    'CARRY': 6,
    'MOVE': 6
};

// Priority order for spawning creeps
const spawnPriority = [
    'miner',
    'harvester',
    'upgrader',
    'builder',
    'roadie',
    'wallRampartRepairer'
];

function bodyGenerator(bodyConfig) {
    const body = [];
    for (const [part, count] of Object.entries(bodyConfig)) {
        const lowerCasePart = part.toLowerCase();
        for (let i = 0; i < count; i++) {
            body.push(lowerCasePart);
        }
    }
    return body;
}

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
                    body = bodyGenerator(harvesterBody);
                    break;
                case 'upgrader':
                    numCreeps = upgraderNum;
                    body = bodyGenerator(upgraderBody);
                    break;
                case 'builder':
                    numCreeps = builderNum;
                    body = bodyGenerator(builderBody);
                    break;
                case 'miner':
                    numCreeps = minerNum;
                    body = bodyGenerator(minerBody);
                    break;
                case 'repairer':
                    numCreeps = repairerNum;
                    body = bodyGenerator(repairerBody);
                    break;
                case 'roadie':
                    numCreeps = roadieNum;
                    body = bodyGenerator(roadieBody);
                    break;
                case 'wallRampartRepairer':
                    numCreeps = wallRampartRepairerNum;
                    body = bodyGenerator(wallRampartRepairerBody);
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