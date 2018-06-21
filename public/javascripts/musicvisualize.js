function MusicVisual(obj) {
    this.source = null; // 资源
    this.count = 0;
    this.size = obj.size; // 数组长度
    this.analyser = MusicVisual.ac.createAnalyser(); // 分析数据
    this.analyser.fftSize = this.size * 2;
    this.gainNode = MusicVisual.ac[MusicVisual.ac.createGain ? "createGain" : "createGainNode"](); //控制音量
    this.gainNode.connect(MusicVisual.ac.destination); // 连接扬声器
    this.analyser.connect(this.gainNode);    
    this.xhr = new XMLHttpRequest(); // ajax 对象
    this.draw = obj.draw;
    this.visualiazer();
}

MusicVisual.ac = new (window.AudioContext || window.webkitAudioContext)(); // 创建根对象

// 请求数据
MusicVisual.prototype.load = function(url, fun) {
    this.xhr.abort(); // 终止上一次请求
    this.xhr.open("GET", url); // 请求数据
    this.xhr.responseType = "arraybuffer"; // 请求返回数据类型
    var self = this;
    this.xhr.onload = function() {
        fun(self.xhr.response);
    };
    this.xhr.send();
};
// 播放
MusicVisual.prototype.play = function(url) {
    var self = this;
    var n = ++this.count; // 计数 换歌曲的时候做一个区别
    if(this.source){
        self.stop()
    }
    this.load(url, function(arraybuffer) {
        if (n != self.count) {return}
        self.decode(arraybuffer, function(buffer) {
            if (n != self.count) {return}
            var bs = MusicVisual.ac.createBufferSource();
            bs.buffer = buffer;
            bs.connect(self.analyser);
            bs[bs.start ? "start" : "noteOn"](0); // 播放
            self.source = bs; // 记录当前正在播放的音频
        });
    });
};
// 解码数据
MusicVisual.prototype.decode = function(arraybuffer, fun) {
    MusicVisual.ac.decodeAudioData(
        arraybuffer,
        function(buffer) {
            fun(buffer);
        },
        function(err) {
            console.log(err);
        }
    );
};
// 控制音量
MusicVisual.prototype.changeValue = function(value) {
    this.gainNode.gain.value = value * value;
};
// 暂停播放
MusicVisual.prototype.stop = function() {
    this.source[this.source.stop ? "stop" : "noteOff"](0);
};
// 可视化效果
MusicVisual.prototype.visualiazer = function() {
    var self = this;
    var arr = new Uint8Array(this.analyser.frequencyBinCount);
    requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;
    function v() {
        self.analyser.getByteFrequencyData(arr);
        self.draw(arr);
        requestAnimationFrame(v);
    }
    requestAnimationFrame(v);
};
