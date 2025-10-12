// Role Modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require ('role.builder');
const roleMiner = require('role.miner');
// const roleRepairer = require('role.repairer');
const roleEmergencyCreep = require('role.emergencyCreep');

// Structure Modules
const structureTower = require('structure.tower');

// Utility Modules
const cleanMemories = require('cleanMemories');
const autoSpawn = require('autoSpawn');

module.exports.loop = function () {

    // Generate CPU Pixel
    if (Game.cpu.bucket >= 10000) {
        Game.cpu.generatePixel();
        console.log('Generated a CPU pixel!');
    }

    // Utility
    cleanMemories.run();
    autoSpawn.run();

    // Creep

    /*
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'emergencyCreep') {
            roleEmergencyCreep.run(creep);
        }
    }
    */

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'miner':
                roleMiner.run(creep);
                break;
            /*
            case 'repairer':
                roleRepairer.run(creep);
                break;
            */
            case 'emergencyCreep':
                roleEmergencyCreep.run(creep);
                break;
        }
    }

    // Structure 

    /*
    for (const name in Game.structures) {
        const structure = Game.structures[name];
        if(structure.structureType == STRUCTURE_TOWER) {
            structureTower.run(structure);
        }
    }
    */

    for (const name in Game.structures) {
        const structure = Game.structures[name];
        switch(structure.structureType) {
            case STRUCTURE_TOWER:
                structureTower.run(structure);
                break;
        }
    }
}