const roleHarvester = {
    run: function(creep) {

        if (creep.memory.delivering && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.delivering = false;
            creep.say('collect');
        }
        if (!creep.memory.delivering && creep.store.getFreeCapacity() === 0) {
            creep.memory.delivering = true;
            creep.say('deliver');
        }

        if (creep.memory.delivering) {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                           structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            // TODO: Add deliver priority
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (d) => d.resourceType === RESOURCE_ENERGY
            });

            if (droppedEnergy) {
                if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;