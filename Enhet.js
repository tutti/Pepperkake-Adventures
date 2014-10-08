Enhet = function(bilde) {
    this.type = "enhet";
    this.bilder = {};
    
    this.bilde = "";
    
    this.x = 0;
    this.y = 0;
    this.gamle_punkt_x = 0;
    this.gamle_punkt_y = 0;
    this.bredde = 0;
    this.hoyde = 0;
    this.momentum = 0; // Momentum oppover
    this.momentum_x = 0;
    this.retning = 0;
    this.hastighet = 10;
    this.hoppstyrke = 30;
    
    this.status = "normal";
    this.plattform = null;
    this.kontroll = null;
    
    if (bilde) {
        this.sett_bilde("", bilde);
    }
}

Enhet.prototype.hent_element = function() {
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
        //this.element.hide();
    }
    return this.element;
}

Enhet.prototype.sett_kontroll = function(kontroll) {
    this.kontroll = kontroll;
}

Enhet.prototype.tick = function() {
    if (this.status == "luft") {
        var x1 = this.punkt_x();
        var y1 = this.punkt_y();
        this.flytt(this.retning * this.hastighet + this.momentum_x, -this.momentum, false);
        this.momentum -= Spill.gravitasjon;
        if (this.momentum <= 0) {
            this.land();
        }
        this.gamle_punkt_x = x1;
        this.gamle_punkt_y = y1;
        this.oppdater();
    }
    else if (this.status == "angrep") {
        // TODO: Angrip
    }
    else if (this.kontroll) {
        this.kontroll.styr(this);
    }
}

Enhet.prototype.sett_posisjon = function(punkt_x, punkt_y, oppdater) {
    this.x = punkt_x - (this.bredde / 2);
    this.y = punkt_y - this.hoyde;
    if (oppdater || oppdater === undefined) {
        this.oppdater();
    }
}

Enhet.prototype.flytt = function(x, y, oppdater) {
    this.x += x;
    this.y += y;
    if (oppdater || oppdater === undefined) {
        this.oppdater();
    }
}

Enhet.prototype.oppdater = function() {
    var elmt = this.hent_element();
    elmt.css('left', this.x);
    elmt.css('top', this.y);
}

Enhet.prototype.sett_retning = function(retning) {
    // retning er enten 1, 0 eller -1 (høyre, stillestående eller venstre)
    this.retning = retning;
}

Enhet.prototype.beveg = function(retning) {
    // retning er enten 1, 0 eller -1 (høyre, stillestående eller venstre)
    this.sett_retning(retning);
    this.flytt(retning * (this.hastighet + this.momentum_x), 0)
    if (!this.plattform) {
        this.momentum = 0;
        this.status = "luft";
    }
    else if (!this.plattform.er_pa(this.punkt_x())) {
        this.plattform.fjern(this);
        this.plattform = null;
        this.momentum = 0;
        this.status = "luft";
    }
}

Enhet.prototype.hopp = function() {
    if (this.plattform) {
        this.plattform.fjern(this);
        this.plattform = null;
        this.momentum += this.hoppstyrke;
        this.status = "luft";
    }
}

Enhet.prototype.angrip = function() {
    this.status = "angrep";
}

Enhet.prototype.fall = function() {
    if (!this.plattform) return;
    this.plattform.fjern(this);
    this.plattform = null;
    this.flytt(0, 1);
    this.status = "luft";
    this.momentum = 0;
    this.momentum_x = 0;
}

Enhet.prototype.land = function() {
    // HVIS en plattform kan landes på, lander enheten
    var x = this.punkt_x();
    var y = this.punkt_y();
    var plattform = Spill.brett.land(this.gamle_punkt_x, this.gamle_punkt_y, x, y);
        if (plattform) {
            this.plattform = plattform;
            plattform.legg_til(this);
            this.status = "normal";
            this.y = this.plattform.y - this.hoyde;
            this.momentum = 0;
            this.momentum_x = 0;
        }
}

Enhet.prototype.sett_bilde = function(navn, bilde) {
    this.bilder[navn] = bilde;
}

Enhet.prototype.velg_bilde = function(navn) {
    if (this.bilder[navn]) {
        var bilde = this.bilder[navn];
    } else if (this.bilder[""]) {
        var bilde = this.bilder[""];
    } else return;
    if (bilde == this.bilde) return;
    this.bilde = bilde;
    var elmt = this.hent_element();
    elmt.prop("src", bilde);
}