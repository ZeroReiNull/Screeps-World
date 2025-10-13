const roleRepairerRoadie = {
    run : function() {

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            // creep.say('🔄 harvest');
        }

        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            // creep.say('🚧 repair');
        }

        if (creep.memory.repairing) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    // The structure must be a road and have less than its maximum hit points.
                    return (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax);
                }
            });

            // Prioritize the most damaged roads first to prevent them from decaying.
            targets.sort((a, b) => a.hits - b.hits);

            if (targets.length > 0) {
                // Try to repair the most damaged road.
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If there are no roads to repair, move to a resting position near the controller.
                // This prevents the creep from blocking paths and saves CPU.
                if (!creep.pos.inRangeTo(creep.room.controller, 3)) {
                     creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
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

module.exports = roleRepairerRoadie;