const initializeMemory = {
    run: function() {
        if (!Memory.emergency) {
                Memory.emergency = {
                    'emergencyMode': false,
                    'emergencyCreepCount': 0,
                };
            }
    }
};

module.exports = initializeMemory;