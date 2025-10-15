const roleMiner = {
    run: function(creep) {
        const source = Game.getObjectById(creep.memory.miningTarget);

        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

module.exports = roleMiner;