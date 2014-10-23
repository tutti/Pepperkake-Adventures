HeisPlattform = function(bilde, x, y, bredde, hoyde, dx, dy, ticktall) {
    Plattform.call(this, bilde, x, y, bredde, hoyde);
    
    this.ticktall = ticktall;
    this.tickteller = this.ticktall;
    this.retning = 1;
    
    this.original_x = x;
    this.original_y = y;
    
    this.dx = dx;
    this.dy = dy;
    
    this.type = "heis";
}

HeisPlattform.prototype = Object.create(Plattform.prototype);
HeisPlattform.prototype.constructor = HeisPlattform

HeisPlattform.prototype.tick = function() {
    if (this.aktiv) {
        this.x += this.dx * this.retning;
        this.y += this.dy * this.retning;
        var elmt = this.hent_element();
        elmt.css('left', this.x).css('top', this.y);
        if (this.utgang) this.utgang_element
            .css('left', this.x+(this.bredde/2)-32)
            .css('top', this.y-64);
        for (e_id in this.enheter) {
            this.enheter[e_id].flytt(this.dx * this.retning, this.dy * this.retning);
            this.enheter[e_id].momentum = -this.dy * this.retning;
            this.enheter[e_id].momentum_x = this.dx * this.retning;
        }
        --this.tickteller;
        if (this.tickteller <= 0) {
            this.retning *= -1;
            this.tickteller = this.ticktall;
        }
    }
}

HeisPlattform.prototype.aktiver = function() {
    Plattform.prototype.aktiver.call(this);
    this.x = this.original_x;
    this.y = this.original_y;
    this.retning = 1;
    this.tickteller = this.ticktall;
}

HeisPlattform.prototype.lander = function(x1, y1, x2, y2, ticks) {
    // Sjekker om et fallende objekt kan lande på plattformen
    // Enkel sjekk; objektet må gå fra over plattformen til under,
    // og x2 må lande på plattformen (en ordentlig sjekk ville ha
    // sjekket punktet der linjene krysser).
    // ticks bestemmer hvor mange ticks inn i fremtiden plattformens
    // posisjon skal sjekkes.
    if (!this.vises) return false;
    var ticks_fra_start = this.ticktall - this.tickteller + ticks;
    if (this.retning == -1) ticks_fra_start += this.ticktall;
    var posisjon = Math.abs(this.ticktall - ((ticks_fra_start + this.ticktall) % (this.ticktall * 2)));
    var x = this.original_x + posisjon*this.dx;
    var y = this.original_y + posisjon*this.dy;
    
    if (y1 >= y || y2 < y) {
        return false;
    }
    if (x2 < x || x2 > x+this.bredde) {
        return false;
    }
    return true;
}