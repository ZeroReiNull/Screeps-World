const cleanMemories = {
    
    run: function() {

        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }

            if (Game.creeps[name].role == 'harvester' && !Game.creeps[name].getObjectById(Game.creeps[name].memory.harvestingTarget)) {
                delete Memory.creeps[name].harvestingTarget;
                console.log('Clearing invalid harvesting target for creep:', name);
            }
        }
    }
};

module.exports = cleanMemories;