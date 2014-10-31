Seigeninja = function(x, y) {
    this.type = "seigeninja";
    Enhet.call(this, x, y);
    
    this.bredde = 32;
    this.hoyde = 32;
    this.hastighet = 10;
    this.hoppstyrke = 25;
    this.original_retning = 1;
    this.maxhp = 3;
    this.rekkevidde = 32;
    
    this.velg_farge(Math.floor(Math.random()*4));
    this.sett_kontroll(Kontroll.hent("seigeninja"));
}

Seigeninja.prototype = Object.create(Enhet.prototype);
Seigeninja.prototype.constructor = Seigeninja

Seigeninja.prototype.sett_retning = function(retning) {
    Enhet.prototype.sett_retning.call(this, retning);
    switch (retning) {
        case -1:
            this.velg_bilde("gå-venstre");
            break;
        case 1:
            this.velg_bilde("gå-høyre");
            break;
        case 0:
            this.velg_bilde("stopp");
            break;
    }
}

Seigeninja.prototype.hent_element = function() {
    // Hvis enheten har et HTML-element, returneres det.
    // Ellers lages et nytt som returneres.
    // Elementet skal uansett være et jQuery-objekt.
    if (this.element === undefined) {
        this.element = $('<img class="enhet enhet-' + this.type + '" src="' + this.bilde + '" />');
        this.element.width(this.bredde);
        this.element.height(this.hoyde);
        this.element.css('left', this.x);
        this.element.css('top', this.y);
        $("#spillvindu").append(this.element);
    }
    return this.element;
}

Seigeninja.prototype.angrep_tick = function() {
    Enhet.prototype.angrep_tick.call(this);
    if (this.angrep_teller > 5) {
        return;
    }
    var skade = false;
    switch (this.retning) {
        case -1:
            skade = Spill.brett.skad(this, this.x - this.rekkevidde, this.y, this.punkt_x(), this.y + this.hoyde, 1, -1, 1);
            break;
        case 1:
            skade = Spill.brett.skad(this, this.punkt_x(), this.y, this.x + 2 * this.rekkevidde, this.y + this.hoyde, 1, 1, 1);
            break;
        case 0:
        default:
            skade = Spill.brett.skad(this, this.x - this.rekkevidde / 2, this.y, this.x + this.rekkevidde / 2, this.y + this.hoyde, 1, -1, 1);
            skade = Spill.brett.skad(this, this.x + this.rekkevidde / 2, this.y, this.x + this.rekkevidde * 1.5, this.y + this.hoyde, 1, 1, 1);
            break;
    }
    if (skade) {
        Lyd.Effekt.spill("lyd/seigeninja-slag.mp3");
    }
}

Seigeninja.prototype.hopp = function() {
    Enhet.prototype.hopp.call(this);
    Lyd.Effekt.spill("lyd/seigeninja-hopp.mp3");
}

Seigeninja.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    this.fall();
    this.momentum = (20 * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
}

Enhet.registrer("seigeninja", Seigeninja);