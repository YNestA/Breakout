window.addEventListener('load',function () {
    box.init();
    var loop=setInterval(function () {
        box.loopDraw();
    },15);
    box.loop=loop;
});