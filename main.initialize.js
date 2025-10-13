const initializeMemory = {
    run: function() {
        if (!Memory.emergency) {
                Memory.emergency = {};
            }
    }
};

module.exports = initializeMemory;