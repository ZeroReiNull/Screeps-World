// Role Modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require ('role.builder');
const roleMiner = require('role.miner');
const roleRepairerRoadie = require('role.repairer.roadie');
const roleEmergencyCreep = require('role.emergencyCreep');

// Structure Modules
const structureTower = require('structure.tower');

// Utility Modules
const cleanMemories = require('cleanMemories');
const autoSpawn = require('autoSpawn');
const minerAssignments = require('role.miner.assignments');
const harvesterAssignments = require('role.harvester.assignments');

// Rooms to manage
const myRooms = [
    'W17S52',
];

module.exports.loop = function () {

    // Generate CPU Pixel
    if (Game.cpu.bucket >= 10000) {
        Game.cpu.generatePixel();
        console.log('Generated a CPU pixel!');
    }

    // Utility
    cleanMemories.run();
    autoSpawn.run();

    for (const roomName of myRooms) {
        minerAssignments.run(Game.rooms[roomName]);
        harvesterAssignments.run(Game.rooms[roomName]);
    }

    // Creep
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                continue;
            case 'upgrader':
                roleUpgrader.run(creep);
                continue;
            case 'builder':
                roleBuilder.run(creep);
                continue;
            case 'miner':
                roleMiner.run(creep);
                continue;
            case 'repairerRoadie':
                roleRepairerRoadie.run(creep);
                continue;
            case 'emergencyCreep':
                roleEmergencyCreep.run(creep);
                continue;
        }
    }

    // Structure 
    for (const name in Game.structures) {
        const structure = Game.structures[name];
        switch(structure.structureType) {
            case STRUCTURE_TOWER:
                structureTower.run(structure);
                continue;
        }
    }
}