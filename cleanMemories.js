const cleanMemories = {
    
    run: function() {

        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }

            if (Memory.creeps[name].harvestingTargetId && !Game.getObjectById(Memory.creeps[name].harvestingTargetId)) {
                delete Memory.creeps[name].harvestingTargetId;
            }
        }
    }
};

module.exports = cleanMemories;