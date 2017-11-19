function Player(nickname) {
    this.nickname = nickname;
}

function Ball(x, y, radius, speedX, speedY, bColor) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.radius = radius;
    this.bColor = bColor || '#4d8';
}

Ball.prototype = {
    constructor: Ball,
    setXY:function (x,y) {
        this.x=x;
        this.y=y;
    },
    updateBall: function (map) {
        var canvas = map.canvas,
            slider = map.slider,
            bricks = map.bricks,
            ballX = this.x,
            ballY = this.y,
            speedX = this.speedX,
            speedY = this.speedY,
            nextX = ballX + speedX,
            nextY = ballY + speedY,
            radius = this.radius;


        if (this.speedY > 0 && nextY + radius >= canvas.height) {
            //this.setXY(ballX,canvas.height-radius);
            return false;
        }

        for (var i = 0; i < bricks.length; i++) {
            if (bricks[i].alive && bricks[i].checkHit(this)) {
                return true;
            }
        }

        if (speedX > 0 && ballX < slider.x && nextX + radius > slider.x && nextY > slider.y) {
            this.setXY(slider.x - radius,ballY);
            this.speedX = -speedX;
            return true;
        } else if (speedX < 0 && ballX > slider.x + slider.width && nextX - radius < slider.x + slider.width && nextY > slider.y) {
            this.setXY(slider.x + slider.width + radius,ballY);
            this.speedX = -speedX;
            return true;
        } else if (speedX > 0 && nextX + radius > canvas.width) {
            this.setXY(canvas.width - radius,ballY);
            this.speedX = -speedX;
            return true;
        } else if (speedX < 0 && nextX - radius < 0) {
            this.setXY(radius,ballY);
            this.speedX = -speedX;
            return true;
        }

        if ((nextX > slider.x && nextX < slider.x + slider.width) && speedY > 0 && nextY + radius > canvas.height - slider.height) {
            this.setXY(ballX,slider.y - radius);
            this.speedY = -speedY;
            return true;
        } else if (speedY < 0 && nextY - radius < 0) {
            this.setXY(ballX,radius);
            this.speedY = -speedY;
            return true;
        }

        this.setXY(nextX,nextY);
        return true;
    }
}

function Brick(x, y, width, height, bColor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.bColor = bColor || '#159';
    this.alive = true;
}

Brick.prototype = {
    constructor: Brick,
    checkHit: function (ball) {
        var ballX = ball.x,
            ballY = ball.y,
            speedX = ball.speedX,
            speedY = ball.speedY,
            nextX = ballX + speedX,
            nextY = ballY + speedY,
            radius = ball.radius,
            brickX = this.x,
            brickY = this.y;

        if (ballX > brickX-radius && ballX < brickX + this.width+radius) {
            if (speedY < 0 && ballY > brickY + this.height && nextY - radius <= brickY + this.height) {
                ball.setXY(ballX,brickY + this.height + radius);
                ball.speedY = -speedY;
                this.alive = false;
                return true;
            } else if (speedY > 0 && ballY< brickY && nextY + radius >= brickY) {
                ball.setXY(ballX,brickY - radius);
                ball.speedY = -speedY;
                this.alive = false;
                return true;
            }
        }
        if (ballY > brickY-radius && ballY < brickY + this.height+radius) {
            if (speedX > 0 && ballX< brickX && nextX + radius >= brickX) {
                ball.setXY( brickX - radius,ballY);
                ball.speedX = -speedX;
                this.alive = false;
                return true;
            } else if (speedX < 0 && ballX > brickX + this.width && nextX - radius <= brickX + this.width) {
                ball.setXY(brickX + this.width + radius,ballY);
                ball.speedX = -speedX;
                this.alive = false;
                return true;
            }
        }

    }
}

var slider = {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    bColor: '#888'
};
