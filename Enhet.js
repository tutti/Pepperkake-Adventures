Enhet = function(bilde, x, y) {
    this.type = "enhet";
    this.bilder = {};
    this.bilde = bilde;
    
    // Overskriv disse i alt som arver Enhet
    this.bredde = 0;
    this.hoyde = 0;
    this.hastighet = 10;
    this.hoppstyrke = 30;
    this.maxhp = 0;
    
    this.original_x = x;
    this.original_y = y;
    this.x = x;
    this.y = y;
    this.gamle_punkt_x = 0;
    this.gamle_punkt_y = 0;
    this.momentum = 0; // Momentum oppover
    this.momentum_x = 0;
    this.original_retning = 1;
    this.retning = 0;
    
    this.status = "normal";
    this.plattform = null;
    this.kontroll = null;
    this.aktiv = false;
    
    this.angrep_teller = 0;
    this.angrep = false;
    this.hp = 0;
    this.immunitet = 0;
    this.lever = false;
    
    if (bilde) {
        this.sett_bilde("", bilde);
        //this.velg_bilde("");
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
    }
    return this.element;
}

Enhet.prototype.sett_kontroll = function(kontroll) {
    this.kontroll = kontroll;
}

Enhet.prototype.punkt_x = function() { return this.x + (this.bredde / 2) }
Enhet.prototype.punkt_y = function() { return this.y + this.hoyde }

Enhet.prototype.tick = function() {
    if (!this.aktiv || !this.lever) return;
    var elmt = this.hent_element();
    if (this.immunitet > 0) {
        --this.immunitet;
        elmt.css('opacity', 0.5);
    } else elmt.css('opacity', 1);
    if (this.punkt_y() > Spill.brett.taplinje) {
        this.dod();
    }
    if (this.status == "luft") {
        var x1 = this.punkt_x();
        var y1 = this.punkt_y();
        this.flytt(this.momentum_x, -this.momentum, false);
        this.momentum -= Spill.gravitasjon;
        if (this.momentum <= 0) {
            this.land();
        }
        this.gamle_punkt_x = x1;
        this.gamle_punkt_y = y1;
        this.oppdater();
    }
    else if (!this.angrep && this.kontroll) {
        this.kontroll.styr(this);
    }
    if (this.angrep) {
        this.angrep_tick();
    }
}

Enhet.prototype.angrep_tick = function() {
    // Gjør ingenting spesielt, annet enn å redusere angrepstelleren
    // For ting som faktisk skal skje under angreper, implementer.
    --this.angrep_teller;
    if (this.angrep_teller <= 0) {
        this.angrep = false;
    }
}

Enhet.prototype.vis = function() {
    var elmt = this.hent_element();
    elmt.show();
    this.vises = true;
}

Enhet.prototype.skjul = function() {
    var elmt = this.hent_element();
    elmt.hide();
    this.vises = false;
}

Enhet.prototype.aktiver = function() {
    this.aktiv = true;
    this.lever = true;
    this.hp = this.maxhp;
    this.immunitet = 0;
    this.momentum = 0;
    this.momentum_x = 0;
    this.sett_posisjon(this.original_x, this.original_y);
    this.sett_retning(this.original_retning);
    this.oppdater();
    this.vis();
}

Enhet.prototype.deaktiver = function() {
    this.aktiv = false;
    this.skjul();
}

Enhet.prototype.fokus = function() {
    //var punkt = Math.max(Math.min(this.punkt_x()-400, $("#spillvindu")[0].scrollWidth - 400), 400);
    var punkt = Math.max(this.punkt_x() - 400, 0);
    punkt = Math.min(punkt, $("#spillvindu")[0].scrollWidth - 800);
    
    $("#spillvindu").scrollLeft(punkt);
    $("#spillvindu").css('background-position', -punkt/5);
}

Enhet.prototype.sett_posisjon = function(punkt_x, punkt_y, oppdater) {
    this.x = punkt_x - (this.bredde / 2);
    this.y = punkt_y - this.hoyde;
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
    if (!retning && retning != 0) {
        retning = this.retning;
    }
    // retning er enten 1, 0 eller -1 (høyre, stillestående eller venstre)
    this.sett_retning(retning);
    this.flytt(retning * this.hastighet, 0)
    if (this.status == "normal") {
        if (!this.plattform) {
            this.momentum = 0;
            this.momentum_x = this.retning * this.hastighet;
            this.status = "luft";
        }
        else if (!this.plattform.er_pa(this.punkt_x())) {
            this.plattform.fjern(this);
            this.plattform = null;
            this.momentum = 0;
            this.momentum_x = this.retning * this.hastighet;
            this.status = "luft";
        }
    }
}

Enhet.prototype.hopp = function() {
    if (this.plattform) {
        this.plattform.fjern(this);
        this.plattform = null;
        this.momentum += this.hoppstyrke;
        this.momentum_x += this.retning * this.hastighet;
        this.status = "luft";
    }
}

Enhet.prototype.angrip = function() {
    // Dette er den funksjonen som starter et angrep.
    // Utførelsen av angrepet og skade gjort gjøres i tick.
    // Denne funksjonen gjør ikke noe annet enn å sette
    // enheten i angrepsstatus; ingen skade utføres.
    this.angrep = true;
    this.angrep_teller = 10;
}

Enhet.prototype.skade = function(skade, retning, kraft) {
    // Kalles når en enhet skades
    // Gir kraften i angrepet og retningen (horisontalt).
    if (this.immunitet > 0) return;
    this.immunitet = 20;
    this.hp -= skade;
    if (this.hp <= 0) {
        this.dod();
    }
}

Enhet.prototype.dod = function() {
    this.deaktiver();
    this.lever = false;
}

Enhet.prototype.fall = function() {
    if (!this.plattform) return;
    this.plattform.fjern(this);
    this.plattform = null;
    this.flytt(0, 5);
    this.status = "luft";
    this.momentum = 0;
    this.momentum_x += this.retning * this.hastighet;
}

Enhet.prototype.land = function() {
    // HVIS en plattform kan landes på, lander enheten
    if (this.gamle_punkt_x == 0 && this.gamle_punkt_y == 0) return;
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