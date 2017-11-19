var box={
    canvas:document.getElementById('breakout'),
    ctx:null,
    slider:null,
    ball:null,
    bricks:[],
    loop:null,
    init:function () {
        var canvas=this.canvas;
        if(canvas && canvas.getContext){
            this.ctx=canvas.getContext('2d');

            //滑块
            slider.x=(canvas.width-slider.width)/2;
            slider.y=canvas.height-slider.height;
            this.slider=slider;

            //小球
            var radius=10,
                speedX=(Math.random()<0.5?1:-1)*(Math.random()*2+0.5),
                speedY=Math.random()+2.5;
            this.ball=new Ball(canvas.width/2,canvas.height-radius-slider.height,radius,speedX,speedY);
            
            //砖块
            this._initBricks();

            this.bindEvent();
            this.loopDraw();
        }
    },
    bindEvent:function () {
        //0不动,1向左,2向右
        var canvas=this.canvas,
            moveDire=0;
        document.addEventListener('keydown',function (event) {
            if(event.keyCode==37){
                if(moveDire==0){
                    moveDire=1;
                }
            }else if(event.keyCode==39){
                if(moveDire==0){
                    moveDire=2;
                }
            }
        });
        document.addEventListener('keyup',function (event) {
            if((event.keyCode==37&&moveDire==1) ||(event.keyCode==39&&moveDire==2)){
                moveDire=0;
            }
        });
        
        setInterval(function () {
            var speed=3;
            if(moveDire==1){
                slider.x=(slider.x<speed)?0:slider.x-speed;
            }else if(moveDire==2){
                slider.x=(slider.x>canvas.width-slider.width-speed)?canvas.width-slider.width:slider.x+speed;
            }
        },15)
    },
    _initBricks:function () {
        var canvas=this.canvas,
            bWidth=canvas.width,
            bHeight=canvas.height,
            bricks=this.bricks,
            perWidth=(bWidth-40)/7,
            perHeight=30;

        for(var i=0;i<5;i++){
            for(var j=0;j<7;j++){
                bricks.push(new Brick((5+perWidth)*j+5,(5+perHeight)*i+5,perWidth,perHeight));
            }
        }

    },
    _draw:function () {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawSlider();
        this.drawBrick();
        this.drawBall();
    },
    drawBrick:function () {
        var ctx=this.ctx,
            bricks=this.bricks;

        ctx.save();
        bricks.forEach(function (brick) {
            if(brick.alive) {
                ctx.fillStyle = brick.bColor;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
        ctx.restore();
    },
    drawSlider:function () {
        var ctx=this.ctx,
            slider=this.slider;

        ctx.save();
        ctx.fillStyle=slider.bColor;
        ctx.fillRect(slider.x,slider.y,slider.width,slider.height);
        ctx.restore();
    },
    drawBall:function () {
        var ctx=this.ctx,
            ball=this.ball;

        ctx.save()
        ctx.beginPath();
        ctx.fillStyle=ball.bColor;
        ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
    },
    loopDraw:function () {
        var ball=this.ball;

        if(ball.updateBall(this)){
            this._draw();
        }else{
            this.gameOver();
        };
    },
    gameOver:function () {
        var ctx=this.ctx;

        clearInterval(this.loop);
        ctx.save();
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        ctx.font='32px sans-serif';
        ctx.textAlign='center';
        ctx.fillText('Game Over!',this.canvas.width/2,250);
        ctx.restore();
    }
}