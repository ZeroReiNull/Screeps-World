const assignExistingHarvesters = {
    run: function(room) {
        // 1. Find all harvesters in the room that don't have a harvestingTarget yet.
        const unassignedHarvesters = _.filter(Game.creeps, (creep) =>
            creep.memory.role === 'harvester' &&
            !creep.memory.harvestingTarget &&
            creep.room.name === room.name
        );

        // If there are no harvesters needing assignment, we're done.
        if (unassignedHarvesters.length === 0) {
            return;
        }

        // 2. Find all source IDs that are already being worked on by other harvesters.
        const assignedSourceIds = _.map(
            _.filter(Game.creeps, (creep) =>
                creep.memory.role === 'harvester' &&
                creep.memory.harvestingTarget &&
                creep.room.name === room.name
            ),
            (creep) => creep.memory.harvestingTarget
        );

        // 3. Find all sources in the room that are NOT in the list of assigned sources.
        const availableSources = room.find(FIND_SOURCES, {
            filter: (source) => !assignedSourceIds.includes(source.id)
        });

        // 4. Assign each unassigned harvester to an available source.
        for (let i = 0; i < unassignedHarvesters.length; i++) {
            // If there are available sources...
            if (i < availableSources.length) {
                const harvester = unassignedHarvesters[i];
                const source = availableSources[i];

                // Assign the source's ID to the harvester's memory.
                harvester.memory.harvestingTarget = source.id;
            } else {
                break;
            }
        }
    }
};

module.exports = assignExistingHarvesters;