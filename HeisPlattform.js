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
        this.y += -this.dy * this.retning;
        var elmt = this.hent_element();
        elmt.css('left', this.x).css('top', this.y);
        for (e_id in this.enheter) {
            this.enheter[e_id].flytt(this.dx * this.retning, -this.dy * this.retning);
            this.enheter[e_id].momentum = this.dy * this.retning;
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