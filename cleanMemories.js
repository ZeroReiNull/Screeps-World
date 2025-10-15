const cleanMemories = {
    
    run: function() {

        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }

            if (Memory.creeps[name].harvestingTarget &&
                !Game.getObjectById(Memory.creeps[name].harvestingTarget) &&
                Game.creeps[name].role === 'harvester'
                ) {
                delete Memory.creeps[name].harvestingTarget;
            }
        }
    }
};

module.exports = cleanMemories;