var game = new Phaser.Game(800, 600, Phaser.AUTO, 'age-of-coding', null, true, false);
var InitGame = function(game){};
InitGame.Boot = function (game) {};

var tileGroup, buildingGroup, cursorPos, cursors;
var hasBuilding;

InitGame.Boot.prototype = {
    preload: function () {
        // './assets/landscapeTiles_spritesheet.png',
        game.load.atlas('tiles', './assets/landscapeTiles_spritesheet.png', './assets/landscape_tiles.json');
        game.load.image('grass', './assets/landscapeTiles_067.png');
        game.load.image('building', './assets/buildings/buildingTiles_030.png', 133, 127);
        game.time.advancedTiming = true;
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        game.iso.anchor.setTo(0.5, 0.2);
        game.world.setBounds(0, 0, 1600, 1200);
        game.camera.x = 400;
        game.camera.y = 125;
    },
    create: function () {
        tileGroup = game.add.group();
        buildingGroup = game.add.group();
        /*let sprite;
        for(let k = 0; k < 20; k++) {
            for (let i = 0; i < 15; i++) {
                sprite = game.add.tileSprite(66 * i, 33 * k , 132, 99, 'tiles', 'grass');
                sprite.scale.setTo(0.5, 0.5);
            }
            for (let j = 0; j < 15; j++) {
                sprite = game.add.tileSprite(66 * j + 33, 33 * k + 16.5, 132, 99, 'tiles', 'grass');
                sprite.scale.setTo(0.5, 0.5);
            }
        }*/
        this.spawnTiles();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursorPos = new Phaser.Plugin.Isometric.Point3();
        cursors = game.input.keyboard.createCursorKeys();

        hasBuilding = false;

        game.input.onDown.add(() => {
            tileGroup.forEach(function (tile) {
                var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                if(inBounds && !tile.hasBuilding){
                    const building = game.add.isoSprite(tile.isoBounds.x, tile.isoBounds.y, 0, 'building', 0, buildingGroup);
                    building.anchor.setTo(0.5, 0.5);
                    tile.hasBuilding = true;
                }
            });
            game.iso.simpleSort(buildingGroup);
        });
    },
    update: function () {
        game.iso.unproject(game.input.activePointer.position, cursorPos);

        tileGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                game.add.tween(tile).to({isoZ: 0}, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                game.add.tween(tile).to({isoZ: 0}, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });

        if (cursors.left.isDown)
        {
            console.log("left");
            game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            game.camera.x += 4;
        }

        if (cursors.up.isDown)
        {
            game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += 4;
        }

    },
    render: function () {
        //game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
    },
    spawnTiles: function () {
        var tile;
        for (var xx = 0; xx < 700; xx += 71) {
            for (var yy = 0; yy < 700; yy += 71) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = game.add.isoSprite(xx, yy, 0, 'tiles', 0, tileGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }
};

game.state.add('Boot', InitGame.Boot);
game.state.start('Boot');

// frame matrix just in case
/*var frames = [
    [0, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41],
    [42, 43, 44, 45, 46, 47],
    [48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59],
    [60, 61, 62, 63, 64, 65],
    [66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77],
    [78, 79, 80, 81, 82, 83],
    [84, 85, 86, 87, 88, 89],
    [90, 91, 92, 93, 94, 95],
];*/