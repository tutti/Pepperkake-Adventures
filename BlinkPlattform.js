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

BlinkPlattform.prototype.lander = function(x1, y1, x2, y2, ticks) {
    // Sjekker om et fallende objekt kan lande på plattformen
    // Enkel sjekk; objektet må gå fra over plattformen til under,
    // og x2 må lande på plattformen (en ordentlig sjekk ville ha
    // sjekket punktet der linjene krysser).
    // ticks bestemmer hvor mange ticks inn i fremtiden plattformen
    // skal sjekkes.
    var skift = (Math.floor(ticks / this.ticktall)) % 2;
    if (this.vises ? skift : !skift) { // !(this.vises XOR skift)
        return false;
    }
    if (y1 >= this.y || y2 < this.y) {
        return false;
    }
    if (x2 < this.x || x2 > this.x+this.bredde) {
        return false;
    }
    return true;
}