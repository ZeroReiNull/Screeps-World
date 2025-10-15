const roleHarvester = {
    run: function(creep) {

        if (creep.memory.delivering && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.delivering = false;
            // creep.say('collect');
        }
        if (!creep.memory.delivering && creep.store.getFreeCapacity() === 0) {
            creep.memory.delivering = true;
            // creep.say('deliver');
        }

        if (creep.memory.delivering) {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER ||
                            (structure.structureType === STRUCTURE_STORAGE &&
                                structure.store[RESOURCE_ENERGY] < 100000)) &&
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
            const harvestingTarget = Game.getObjectById(creep.memory.harvestingTargetId);
            const target = harvestingTarget.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (resource) => resource.resourceType === RESOURCE_ENERGY
            });

            if (target) {
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;