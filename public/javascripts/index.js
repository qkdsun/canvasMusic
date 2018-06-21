function $(s) {
    return document.querySelectorAll(s);
}

var size = 64;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var height, width;
var box = document.getElementById("box");
var line; // 纵向渐变
var position = [];


var music = new MusicVisual({
    size: size,
    draw: draw
});

/**
 * 音乐点击事件
 */
var lis = $("#lis li");

for (let i = 0; i < lis.length; i++) {
    lis[i].onclick = function() {
        for (let j = 0; j < lis.length; j++) {
            lis[j].className = "";
        }
        this.className = "selected";
        music.play("/media/" + this.title);
    };
}
/**
 * 控制音量
 */
$("#volume")[0].onchange = function() {
    music.changeValue(this.value / this.max);
};

$("#volume")[0].onchange(); // 先调用一下 让60 生效

/**
 * 绘制图形
 */

resize();
window.onresize = function() {
    resize();
};

function resize() {
    // 宽高自适应
    height = box.clientHeight;
    width = box.clientWidth;

    canvas.height = height;
    canvas.width = width;

    line = context.createLinearGradient(0, 0, 0, height); // 纵向渐变（从上到下）
    line.addColorStop(0, "red"); // 渐变色
    line.addColorStop(0.5, "yellow"); // 渐变色
    line.addColorStop(1, "green"); // 渐变色

    positionArc();
}

draw.type = "column";

function draw(arr) {
    var w = width / size;
    context.fillStyle = line;
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < arr.length; i++) {
        var o = position[i];
        if (draw.type == "column") {
            var capW = w * 0.8;
            var capH = capW > 5 ? 5 : capW;
            var h = (arr[i] / 256) * height; // 竖条相对高度
            context.fillRect(w * i, height - h, w * 0.8, h);
            context.fillRect(w * i, height - (o.dx + capH), w * 0.8, capH);  // 画小帽
            o.dx--;
            if(o.dx < 0){
                o.dx = 0
            }
            if( h>0 && o.dx < h + 8){
                o.dx = h + 8 > height - capH ? height - capH : h + 8
            }
        } else {
            context.beginPath();
            var r = 10 + arr[i] / 256 * (height > width ? width: height) /10;
            context.arc(o.x, o.y, r, 0, 2 * Math.PI);
            var g = context.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
            g.addColorStop(0, "#fff");
            g.addColorStop(1, o.color);
            context.fillStyle = g;
            context.fill();
            o.x += o.cpx
            o.x = o.x > width ? 0 : o.x
        }
    }
}

/**
 * arr.length 个随机点
 */

function random(m, n) {
    return Math.round(Math.random() * (n - m) + m);
}

function positionArc() {
    position = []; // 制空
    for (let i = 0; i < size; i++) {
        let x = random(0, width);
        let y = random(0, height);
        let color = "rgba(" +random(0, 255) +  "," +  random(0, 255) +  "," +  random(0, 255) + ",0)";
        position.push({
            x: x,
            y: y,
            color: color,
            dx: 0 ,// 小帽距离顶端的距离
            cpx: random(1,3) // 运动
        });
    }
}

/**圆和柱状图切换 */
var types = $("#type li");

for (let i = 0; i < types.length; i++) {
    types[i].onclick = function() {
        for (let j = 0; j < types.length; j++) {
            types[j].className = "";
        }
        this.className = "selected";
        draw.type = this.getAttribute("data-type");
    };
}
