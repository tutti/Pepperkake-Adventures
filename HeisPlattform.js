HeisPlattform = function(x, y, bredde, hoyde, dx, dy, ticktall) {
    Plattform.call(this, x, y, bredde, hoyde);
    
    this.ticktall = ticktall;
    this.tickteller = this.ticktall;
    this.retning = 1;
    
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
            console.log(this.enheter, e_id);
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