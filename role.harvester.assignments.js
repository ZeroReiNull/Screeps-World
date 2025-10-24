const harvesterAssignments = {
    run: function(room) {
        
        // 1. Get all permanent energy sources in the room.
        const availableSources = room.find(FIND_DROPPED_RESOURCES).filter(source => source.resourceType === RESOURCE_ENERGY);

        // 2. Get all creeps in this room with the 'harvester' role.
        const harvesters = _.filter(Game.creeps, (creep) =>
            creep.memory.role === 'harvester' &&
            creep.room.name === room.name
        );

        // 3. Count how many harvesters are *already* assigned to each source ID.
        // The result will be an object like: { 'sourceId_A': 2, 'sourceId_B': 1 }
        const sourceCounts = _.countBy(harvesters, (creep) => creep.memory.harvestingTarget);

        // 4. Find all harvesters that don't have a 'harvestingTarget'
        const unassignedHarvesters = _.filter(harvesters, (creep) => !creep.memory.harvestingTarget);

        // 5. Loop through each unassigned harvester and try to find it a source.
        for (const harvester of unassignedHarvesters) {
            
            // 6. Loop through each source and check its count.
            for (const source of availableSources) {
                
                // Get the current count for this source. 
                // Use '|| 0' to handle sources that have 0 harvesters (and aren't in sourceCounts).
                const currentCount = sourceCounts[source.id] || 0;

                // 7. If this source has less than 2 harvesters, assign it!
                if (currentCount < 2) {
                    harvester.memory.harvestingTarget = source.id;
                    
                    // IMPORTANT: Update our local count for the next harvester in the loop.
                    // This prevents us from assigning all new harvesters to the same source.
                    sourceCounts[source.id] = currentCount + 1;
                    
                    // This harvester is assigned, so we can stop checking sources for it.
                    break; 
                }
            }
            // If the loop finishes without a 'break', the harvester remains unassigned
            // (because all sources were full).
        }
    }
};

module.exports = harvesterAssignments;