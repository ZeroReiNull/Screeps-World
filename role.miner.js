function assignExistingMiners(room) {
    // 1. Find all miners in the room that don't have a sourceId yet.
    const unassignedMiners = _.filter(Game.creeps, (creep) =>
        creep.memory.role === 'miner' &&
        !creep.memory.sourceId &&
        creep.room.name === room.name
    );

    // If there are no miners needing assignment, we're done.
    if (unassignedMiners.length === 0) {
        return;
    }

    // 2. Find all source IDs that are already being worked on by other miners.
    const assignedSourceIds = _.map(
        _.filter(Game.creeps, (creep) =>
            creep.memory.role === 'miner' &&
            creep.memory.sourceId &&
            creep.room.name === room.name
        ),
        (creep) => creep.memory.sourceId
    );

    // 3. Find all sources in the room that are NOT in the list of assigned sources.
    const availableSources = room.find(FIND_SOURCES, {
        filter: (source) => !assignedSourceIds.includes(source.id)
    });

    // 4. Assign each unassigned miner to an available source.
    for (let i = 0; i < unassignedMiners.length; i++) {
        // If there are available sources...
        if (i < availableSources.length) {
            const miner = unassignedMiners[i];
            const source = availableSources[i];

            // Assign the source's ID to the miner's memory.
            miner.memory.sourceId = source.id;
            console.log(`Assigning miner ${miner.name} to source ${source.id}`);
        } else {
            // Stop if we run out of available sources.
            break;
        }
    }
}

const roleMiner = {
    run: function(creep) {
        const sources = creep.room.find(FIND_SOURCES);

        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

module.exports = roleMiner;