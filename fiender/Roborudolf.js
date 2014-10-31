Roborudolf = function(x, y) {
    this.type = "roborudolf";
    Enhet.call(this, x, y);
    
    this.bredde = 64;
    this.hoyde = 64;
    this.hastighet = 10;
    this.hoppstyrke = 20;
    this.original_retning = 1;
    this.maxhp = 60;
    
    this.fase = "start";
    this.handling = "";
    this.handlingteller = 0;
    this.fiendefaseflagg = false;
    
    this.sett_bilde("venstre", "venstre.png");
    this.sett_bilde("høyre", "hoyre.png");
    
    this.sett_kontroll(Kontroll.hent("roborudolf"));
}

Roborudolf.prototype = Object.create(Enhet.prototype);
Roborudolf.prototype.constructor = Roborudolf

Roborudolf.prototype.hent_element = function() {
    var elmt = Enhet.prototype.hent_element.call(this);
    if (!this.laser_element) {
        this.laser_element = $('<img class="enhet-tillegg laser" src="bilder/roborudolf/0/laser.png" />');
        this.laser_element.width(800);
        this.laser_element.height(64);
        this.laser_element.css('left', 0);
        this.laser_element.css('top', 486);
        this.laser_element.hide();
        $("#spillvindu").append(this.laser_element);
    }
    return elmt;
}

Roborudolf.prototype.sett_retning = function(retning) {
    Enhet.prototype.sett_retning.call(this, retning);
    switch (retning) {
        case -1:
            this.velg_bilde("venstre");
            break;
        case 1:
            this.velg_bilde("høyre");
            break;
    }
}

Roborudolf.prototype.tick = function() {
    if (!this.aktiv) return;
    Enhet.prototype.tick.call(this);
    //if (Spill.brett.skad(this, this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, this.retning, 1.5)) {
    //    Lyd.Effekt.spill("lyd/slag1.mp3");
    //}
}

Roborudolf.prototype.angrep_tick = function() {
    Enhet.prototype.angrep_tick.call(this);
    Spill.brett.skad(this, 0, 484, 800, 550, 1, this.retning, 2);
}

Roborudolf.prototype.aktiver = function() {
    Enhet.prototype.aktiver.call(this);
    this.fase = "";
    this.handling = "";
    this.handlingteller = 0;
    this.fiendefaseflagg = false;
    $("#bosshp").show();
    Spill.bosshp(100);
}

Roborudolf.prototype.deaktiver = function() {
    Enhet.prototype.deaktiver.call(this);
    $("#bosshp").hide();
}

Roborudolf.prototype.angrip = function() {
    // Roborudolfs eneste direkte angrep er laseren hans.
    if (this.angrep_teller > 0) return;
    this.hent_element();
    this.laser_element.fadeIn(250).fadeOut(250);
    this.angrep = true;
    this.angrep_teller = 15;
    Lyd.Effekt.spill("lyd/roborudolf-laser.mp3");
}

Roborudolf.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
    var farge = "#0F0";
    if (this.hp <= 40) farge = "#F80";
    if (this.hp <= 20) farge = "#F00";
    Spill.bosshp(100 * this.hp / this.maxhp, farge);
    this.fiendefaseflagg = true;
    if (this.hp == 0) {
        this.fall();
        this.momentum = (20 * kraft) / 1.5;
        this.momentum_x = retning * kraft * 10;
    } else if (this.hp % 20 == 0) {
        this.immunitet += this.handlingteller + 50;
    }
}

Enhet.registrer("roborudolf", Roborudolf);