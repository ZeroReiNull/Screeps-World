const structureTower = {
    run: function (tower) {
        if (tower) {
            // 1. Attack Priority: Find the closest hostile creep
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                return; // Stop further processing once an enemy is engaged
            }

            // 2. Heal Priority: Find the closest damaged friendly creep
            const closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep) => creep.hits < creep.hitsMax
            });
            if (closestDamagedCreep) {
                tower.heal(closestDamagedCreep);
                return; // Stop after healing
            }

            // 3. Repair Priority: Find the closest damaged structure
            // We'll exclude walls and ramparts initially to save energy.
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax &&
                                       structure.structureType != STRUCTURE_WALL &&
                                       structure.structureType != STRUCTURE_RAMPART
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
};

module.exports = structureTower;