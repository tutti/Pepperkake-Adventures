Snomann = function(x, y) {
    this.type = "snomann";
    Enhet.call(this, x, y);
    
    this.bredde = 32;
    this.hoyde = 32;
    this.hastighet = 0;
    this.hoppstyrke = 0;
    this.original_retning = 1;
    this.maxhp = 3;
    
    this.snoball_x = 0;
    this.snoball_y = 0;
    this.snoball_momentum = 0;
    this.snoball_momentum_x = 0;
    
    this.sett_kontroll(Kontroll.hent("snømann"));
}

Snomann.prototype = Object.create(Enhet.prototype);
Snomann.prototype.constructor = Snomann

Snomann.prototype.hent_element = function() {
    var elmt = Enhet.prototype.hent_element.call(this);
    if (!this.snoball_element) {
        this.snoball_element = $('<img class="enhet-tillegg snoball" src="bilder/snoball.png" />');
        this.snoball_element.width(16);
        this.snoball_element.height(16);
        this.snoball_element.css('left', this.snoball_x);
        this.snoball_element.css('top', this.snoball_y);
        this.snoball_element.hide();
        $("#spillvindu").append(this.snoball_element);
    }
    return elmt;
}

Snomann.prototype.slett_element = function() {
    Enhet.prototype.slett_element.call(this);
    if (this.snoball_element) {
        this.snoball_element.remove();
        delete this.snoball_element;
    }
}

Snomann.prototype.sett_retning = function(retning) {
    Enhet.prototype.sett_retning.call(this, retning);
    switch (retning) {
        case -1:
            this.velg_bilde("gå-venstre");
            break;
        case 1:
            this.velg_bilde("gå-høyre");
            break;
    }
}

//Snomann.prototype.tick = function() {
    //if (!this.aktiv) return;
    //Enhet.prototype.tick.call(this);
    //if (Spill.brett.skad(this, this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, this.retning, 1.5)) {
    //    Lyd.Effekt.spill("lyd/slag1.mp3");
    //}
//}

//Snomann.prototype.hopp = function() {
//     //Gjør ingenting - gelebøller kan ikke hoppe
//}

Snomann.prototype.angrip = function() {
    Enhet.prototype.angrip.call(this);
    switch (this.retning){
        case -1:
            this.snoball_x = this.x + this.bredde - 8;
            break;
        case 1:
            this.snoball_x = this.x - 8;
            break;
    }
    this.snoball_y = this.y - 8;
    this.snoball_momentum = 10;
    this.snoball_momentum_x = 20 * this.retning;
}

Snomann.prototype.angrep_tick = function() {
    this.hent_element();
    this.snoball_x += this.snoball_momentum_x;
    this.snoball_y -= this.snoball_momentum;
    this.snoball_momentum -= Spill.gravitasjon;
    this.snoball_element.show().css('top', this.snoball_y).css('left', this.snoball_x);
    Spill.brett.skad(this, this.snoball_x, this.snoball_y, this.snoball_x + 16, this.snoball_y + 16, 1, this.retning, 1.5)
    if (this.snoball_y >= Spill.brett.taplinje) {
        this.snoball_element.hide();
        this.angrep = false;
        this.sett_retning(this.retning);
    }
}

Snomann.prototype.skjul = function() {
    Enhet.prototype.skjul.call(this);
    this.snoball_element.hide();
}

Snomann.prototype.vis = function() {
    Enhet.prototype.vis.call(this);
    this.snoball_element.show();
}

Snomann.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    this.fall();
    this.momentum = (20 * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
}

Enhet.registrer("snømann", Snomann);