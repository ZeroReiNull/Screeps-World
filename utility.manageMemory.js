const manageMemory = {

    run: function() {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                console.log('Clearing non-existing creep memory:', name);
                delete Memory.creeps[name];
                continue;
            }

            const creep = Game.creeps[name];
            if (creep.memory.role == 'harvester' && creep.memory.harvestingTarget) {
                if (!Game.getObjectById(creep.memory.harvestingTarget)) {
                    console.log('Clearing invalid harvesting target for creep:', name);
                    delete creep.memory.harvestingTarget;
                }
            }
        }
    }
};

module.exports = manageMemory;