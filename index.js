var type = "WebGL";
var Application = PIXI.Application;
var loader = PIXI.loader;
var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;
var hero;
var state;
var gameScene;
var gameOverScene;
var message;
var message1;
var iteratorScore = 0;
var iteratorLost = 0;
var x = 0;
var y = 0;
var changebleList = [];
var list = [];
var listOfRectangles = [];
var app = new Application({
    width: 600,
    height: 600,
    antialias: true,
    transparent: false,
    resolution: 1
});
loader
    .add([
    "images/Food1.png",
    "images/full-background.png",
    "images/cat.png"
])
    .load(setup);
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x061639;
var style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 25,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6
});
var SpriteHero = /** @class */ (function () {
    function SpriteHero(theAddress, X, Y, VX, VY) {
        this.address = theAddress;
        this.x = X;
        this.y = Y;
        this.vx = VX;
        this.vy = VY;
    }
    SpriteHero.prototype.loadSprite = function () {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources[this.address].texture);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.vx = this.vx;
        this.sprite.vy = this.vy;
    };
    SpriteHero.prototype.getSprite = function () {
        this.loadSprite();
        return this.sprite;
    };
    return SpriteHero;
}());
var SpriteFood = /** @class */ (function () {
    function SpriteFood(Texture, NewTexture, Sprite, X, Y, Anchor, Scale, Direction, TurningSpeed, Speed) {
        //this.address=theAddress;
        this.texture = Texture;
        this.newTexture = NewTexture;
        this.sprite = Sprite;
        this.x = X;
        this.y = Y;
        this.anchor = Anchor;
        this.scale = Scale;
        this.direction = Direction;
        this.turningSpeed = TurningSpeed;
        this.speed = Speed;
    }
    SpriteFood.prototype.getSprite = function () {
        console.log(this.sprite);
        return this.sprite;
    };
    return SpriteFood;
}());
function setup() {
    gameScene = new PIXI.Container();
    app.stage.addChild(gameScene);
    var background = new PIXI.Sprite(PIXI.loader.resources["images/full-background.png"].texture);
    gameScene.addChild(background);
    for (var i_1 = 0; i_1 < 3; i_1++) {
        for (var j = 0; j < 3; j++) {
            var rectangle = new PIXI.Rectangle(x, y, 16, 16);
            listOfRectangles.push(rectangle);
            x = x + 16;
        }
        y = y + 16;
        x = 0;
    }
    for (var i_2 = 0; i_2 < listOfRectangles.length; i_2++) {
        var texture = PIXI.loader.resources["images/Food1.png"].texture;
        texture.frame = listOfRectangles[i_2];
        var newTexture = new PIXI.Texture(texture.baseTexture, texture.frame);
        var foodSprite = new Sprite(newTexture);
        foodSprite.x = Math.random() * ((app.screen.width - 10) - 10) + 10;
        foodSprite.y = -20;
        foodSprite.anchor.set(0.5);
        foodSprite.scale.set(2 + Math.random() * 2);
        foodSprite.direction = Math.random() * Math.PI * 2;
        foodSprite.turningSpeed = Math.random() - 0.05;
        foodSprite.speed = 0.5 + Math.random() * 2;
        var foodObject = new SpriteFood(texture, newTexture, foodSprite, foodSprite.x, foodSprite.y, foodSprite.anchor, foodSprite.scale, foodSprite.direction, foodSprite.turningSpeed, foodSprite.speed);
        list.push(foodObject.getSprite());
    }
    for (var i = 0; i < list.length; i++) {
        changebleList.push(list[i]);
    }
    changebleList.push(list[0]);
    gameOverScene = new PIXI.Container();
    app.stage.addChild(gameOverScene);
    gameOverScene.visible = false;
    message = new PIXI.Text("Score: " + iteratorScore, style);
    message.position.set(450, 30);
    gameScene.addChild(message);
    message1 = new PIXI.Text("Lost: " + iteratorLost + "/10", style);
    message1.position.set(40, 30);
    gameScene.addChild(message1);
    var object = new SpriteHero("images/cat.png", 270, 470, 0, 0);
    hero = object.getSprite();
    gameScene.addChild(hero);
    var left = keyboard(37);
    var right = keyboard(39);
    left.press = function () {
        hero.vx = -5;
        hero.vy = 0;
    };
    left.release = function () {
        if (!right.isDown && hero.vy === 0) {
            hero.vx = 0;
        }
    };
    right.press = function () {
        hero.vx = 5;
        hero.vy = 0;
    };
    right.release = function () {
        if (!left.isDown && hero.vy === 0) {
            hero.vx = 0;
        }
    };
    state = play;
    app.ticker.add(function (delta) { return gameLoop(delta); });
}
function gameLoop(delta) {
    state(delta);
}
function play(delta) {
    if (iteratorLost == 10) {
        message = new PIXI.Text("The End! Your score " + iteratorScore, style);
        message.position.set(160, 250);
        gameOverScene.addChild(message);
        state = end;
    }
    gameScene.addChild(changebleList[0]);
    changebleList[0].direction += changebleList[0].turningSpeed * 0.05;
    changebleList[0].rotation = -changebleList[0].direction - Math.PI / 2;
    changebleList[0].y += 1.5 * changebleList[0].speed;
    for (var i = 0; i < changebleList.length - 1; i++) {
        changebleList[i + 1].direction += changebleList[i + 1].turningSpeed * 0.05;
        changebleList[i + 1].rotation = -changebleList[i + 1].direction - Math.PI / 2;
        if (changebleList[i].y > 100) {
            gameScene.addChild(changebleList[i + 1]);
            changebleList[i + 1].y += 1.5 * changebleList[i + 1].speed;
            if (changebleList[i].y > 600) {
                changebleList[i].visible = false;
                changebleList.splice(i, 1);
                iteratorLost = iteratorLost + 1;
                gameScene.removeChild(message1);
                message1 = new PIXI.Text("Lost: " + iteratorLost + "/10", style);
                message1.position.set(40, 30);
                gameScene.addChild(message1);
            }
            if (hitTestRectangle(changebleList[i], hero)) {
                iteratorScore = iteratorScore + 1;
                changebleList[i].visible = false;
                changebleList.splice(i, 1);
                gameScene.removeChild(message);
                message = new PIXI.Text("Score: " + iteratorScore, style);
                message.position.set(450, 30);
                gameScene.addChild(message);
            }
            if (changebleList.length == 1) {
                for (var i = 0; i < list.length; i++) {
                    list[i].y = -40;
                    list[i].x = Math.random() * app.screen.width;
                    changebleList.push(list[i]);
                    changebleList[i].visible = true;
                }
            }
        }
        else {
            changebleList[i + 1].y += 0 * changebleList[i + 1].speed;
        }
    }
    if (hero.x < 20) {
        hero.vx = 0;
        hero.x += 2;
    }
    if (hero.x > 530) {
        hero.vx = 0;
        hero.x -= 2;
    }
    hero.x += hero.vx;
    hero.y += hero.vy;
}
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press)
                key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release)
                key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
}
function hitTestRectangle(r1, r2) {
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    hit = false;
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        }
        else {
            hit = false;
        }
    }
    else {
        hit = false;
    }
    return hit;
}
function end() {
    gameScene.visible = false;
    gameOverScene.visible = true;
}
