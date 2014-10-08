BlinkPlattform = function(bilde, x, y, bredde, hoyde, ticktall) {
    Plattform.call(this, bilde, x, y, bredde, hoyde);
    
    this.type = "blink";
    
    this.ticktall = ticktall;
    this.tickteller = ticktall;
}

BlinkPlattform.prototype = Object.create(Plattform.prototype);
BlinkPlattform.prototype.constructor = BlinkPlattform

BlinkPlattform.prototype.tick = function() {
    if (this.aktiv) {
        --this.tickteller;
        if (this.tickteller <= 0) {
            if (this.vises) {
                this.skjul();
            } else {
                this.vis();
            }
            this.tickteller = this.ticktall;
        }
    }
}

BlinkPlattform.prototype.aktiver = function() {
    Plattform.prototype.aktiver.call(this);
    this.vis();
    this.tickteller = this.ticktall;
}