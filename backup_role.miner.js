const energySourceId = ['5bbcabf89099fc012e634941', '5bbcabf89099fc012e634943'];

const roleMiner = {
    run: function(creep) {
        //TODO: Assign miners to specific sources
        const sources = creep.room.find(FIND_SOURCES);

        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

module.exports = roleMiner;