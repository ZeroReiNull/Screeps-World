// Maximum energy capacity for storage structures
const MAX_STORAGE_ENERGY = 500000;

const roleHarvester = {
    run: function(creep) {

        if (creep.memory.delivering && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.delivering = false;
        }
        if (!creep.memory.delivering && creep.store.getFreeCapacity() === 0) {
            creep.memory.delivering = true;
        }

        if (creep.memory.delivering) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                           structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            let target = null;
            if (targets.length > 0) {
                target = targets[0];
            } else {
                target = creep.room.storage;
            }

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            const harvestingTarget = Game.getObjectById(creep.memory.harvestingTarget);

            if (harvestingTarget) {
                if (creep.pickup(harvestingTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(harvestingTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;