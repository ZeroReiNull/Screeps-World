const manageMemory = {

    run: function() {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                continue;
            }

            const creep = Game.creeps[name];
            if (creep.memory.role == 'harvester' && creep.memory.harvestingTarget) {
                if (!Game.getObjectById(creep.memory.harvestingTarget)) {
                    delete creep.memory.harvestingTarget;
                }
            }
        }
    }
};

module.exports = manageMemory;