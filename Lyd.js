// antall_lydelementer blir definert i index.php.

var lydelement = 0;
var lydelementer = [];
var bgm = null;
$(document).ready(function() {
    for (var i = 0; i < antall_lydelementer; ++i) {
        lydelementer[i] = document.getElementById("lyd"+i);
    }
    bgm = document.getElementById("bgm");
})

Lyd = {
    
    BGM: {
        
        sett: function(path) {
            bgm.src = path;
            return this;
        },
        
        spill: function() {
            bgm.play();
            return this;
        },
        
        pause: function() {
            bgm.pause();
            return this;
        }
        
    },
    
    Effekt: {
        
        spill: function(path) {
            var e = lydelementer[lydelement];
            e.src = path;
            e.play();
            lydelement = (lydelement + 1) % antall_lydelementer;
            return this;
        }
        
    }
    
}