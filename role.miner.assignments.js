const assignExistingMiners = {
    run: function(room) {
        // 1. Find all miners in the room that don't have a miningTarget yet.
        const unassignedMiners = _.filter(Game.creeps, (creep) =>
            creep.memory.role === 'miner' &&
            !creep.memory.miningTarget &&
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
                creep.memory.miningTarget &&
                creep.room.name === room.name
            ),
            (creep) => creep.memory.miningTarget
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
                miner.memory.miningTarget = source.id;
            } else {
                break;
            }
        }
    }
};

module.exports = assignExistingMiners;