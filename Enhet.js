Enhet = function(x, y) {
    
    if (this.type === undefined) this.type = "enhet";
    this.farge = 0;
    this.bilder = {};
    this.bilde = "";
    
    // Overskriv disse i alt som arver Enhet
    this.bredde = 0;
    this.hoyde = 0;
    this.hastighet = 10;
    this.hoppstyrke = 30;
    this.maxhp = 0;
    this.rekkevidde = 32;
    
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
    
    this.sett_bilde("stopp", "n.png");
    this.sett_bilde("gå-venstre", "gv.gif");
    this.sett_bilde("gå-høyre", "gh.gif");
    this.sett_bilde("angrip", "a.gif");
    this.sett_bilde("angrip-venstre", "av.gif");
    this.sett_bilde("angrip-høyre", "ah.gif");
    this.sett_bilde("angrip-luft", "la.gif");
    this.sett_bilde("angrip-luft-venstre", "lav.gif");
    this.sett_bilde("angrip-luft-høyre", "lah.gif");
}

Enhet.prototype.hent_element = function() {
    // Hvis enheten har et HTML-element, returneres det.
    // Ellers lages et nytt som returneres.
    // Elementet skal uansett være et jQuery-objekt.
    if (this.element === undefined) {
        this.element = $('<img class="enhet enhet-' + this.type + '" src="" />');
        this.element.width(this.bredde);
        this.element.height(this.hoyde);
        this.element.css('left', this.x);
        this.element.css('top', this.y);
        this.velg_bilde("stopp");
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
    // Separert fra tick for å kunne implementere dette uten å trenge
    // å overskrive hele tick.
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
    this.status = "luft";
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
    punkt = Math.min(punkt, Spill.brett.bredde - 800);
    
    $("#spillvindu").scrollLeft(punkt);
    $("#spillvindu").css('background-position', -punkt/5);
}

Enhet.prototype.sett_posisjon = function(punkt_x, punkt_y, oppdater) {
    this.x = punkt_x - (this.bredde / 2);
    this.y = punkt_y - this.hoyde;
    this.gamle_punkt_x = this.x;
    this.gamle_punkt_y = this.y;
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

Enhet.prototype.sett_retning_mot = function(enhet) {
    // Beveger enheten i retning av den andre enheten
    if (this.punkt_x() < enhet.punkt_x()) {
        this.sett_retning(1);
    } else if (this.punkt_x() == enhet.punkt_x()) {
        this.sett_retning(0);
    } else {
        this.sett_retning(-1);
    }
}

Enhet.prototype.beveg = function(retning) {
    if (this.status != "normal") { return; }
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

Enhet.prototype.beveg_mot = function(enhet) {
    // Beveger enheten i retning av den andre enheten
    if (this.punkt_x() < enhet.punkt_x()) {
        this.beveg(1);
    } else if (this.punkt_x() == enhet.punkt_x()) {
        this.beveg(0);
    } else {
        this.beveg(-1);
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
    if (this.status == "luft") {
        switch (this.retning) {
            case -1: this.velg_bilde("angrip-luft-venstre"); break;
            case 1: this.velg_bilde("angrip-luft-høyre"); break;
            case 0: this.velg_bilde("angrip-luft"); break;
        }
    } else {
        switch (this.retning) {
            case -1: this.velg_bilde("angrip-venstre"); break;
            case 1: this.velg_bilde("angrip-høyre"); break;
            case 0: this.velg_bilde("angrip"); break;
        }
    }
    this.angrep = true;
    this.angrep_teller = 10;
}

Enhet.prototype.skade = function(skade, retning, kraft) {
    // Kalles når en enhet skades
    // Gir kraften i angrepet og retningen (horisontalt).
    if (this.immunitet > 0) return;
    this.immunitet = 20;
    this.hp -= skade;
    //if (this.hp <= 0) {
    //    this.dod();
    //}
}

Enhet.prototype.dod = function() {
    this.deaktiver();
    this.lever = false;
    if (this == Spill.spiller) {
        Spill.spiller_dod();
    } else if (this.utgang) {
        Spill.brett_ferdig(this.utgang);
    }
}

Enhet.prototype.fall = function() {
    if (!this.plattform) return;
    this.plattform.fjern(this);
    this.plattform = null;
    //this.gamle_punkt_y = this.punkt_y() + 1 - Math.abs(this.momentum);
    this.gamle_punkt_x = 0;
    this.gamle_punkt_y = 0;
    this.flytt(0, 5+Math.abs(this.momentum));
    //this.sett_posisjon(this.punkt_x(), this.punkt_y()+this.momentum+10, false);
    //this.flytt(0, 1);
    this.momentum = 0;
    this.momentum_x += this.retning * this.hastighet;
    this.status = "luft";
}

Enhet.prototype.land = function() {
    // HVIS en plattform kan landes på, lander enheten
    // Hvis enheten er død, går den ned gjennom alt
    if (this.hp <= 0) return;
    if (this.gamle_punkt_x == 0 && this.gamle_punkt_y == 0) return;
    var x = this.punkt_x();
    var y = this.punkt_y();
    var plattform = Spill.brett.land(this.gamle_punkt_x, this.gamle_punkt_y, x, y, 0);
    if (plattform) {
        this.plattform = plattform;
        plattform.legg_til(this);
        this.status = "normal";
        this.y = this.plattform.y - this.hoyde;
        this.momentum = 0;
        this.momentum_x = 0;
    }
}

Enhet.prototype.innenfor_rekkevidde = function(enhet) {
    // Sjekker om en annen enhet er innenfor rekkevidde
    // For de fleste enheter vil det si at et sidelengs angrep
    // vil treffe den andre enheten.
    // For annerledes funksjonalitet, overskriv metoden.
    var avstand_x = Math.abs(this.punkt_x() - enhet.punkt_x()) + (this.bredde / 2);
    if (avstand_x <= this.rekkevidde && enhet.y <= this.y + this.hoyde && enhet.y + enhet.hoyde >= this.y) {
        return true;
    }
    return false;
}

Enhet.prototype.trajectory_plattform = function(fra_topp) {
    // Finner plattformen enheten vil lande på hvis den:
    //  - er på en plattform og hopper nå
    //  - er i luften allerede
    //  - hvis fra_topp == true: hvis den starter et fall nå
    // Plattformen spilleren er på vil ikke returneres.
    var momentum = this.momentum;
    var momentum_x = this.momentum_x;
    if (this.status == "normal") {
        momentum += this.hoppstyrke;
        momentum_x += this.retning * this.hastighet;
    }
    if (fra_topp) {
        momentum = 0;
    }
    
    var ticks = 0;
    var x = this.punkt_x();
    var y = this.punkt_y();
    var forrige_x = 0;
    var forrige_y = 0;
    var plattform = null;
    while (!plattform && y <= Spill.brett.taplinje) {
        forrige_x = x;
        forrige_y = y;
        x += momentum_x;
        y -= momentum;
        momentum -= Spill.gravitasjon;
        if (momentum < 0) {
            plattform = Spill.brett.land(forrige_x, forrige_y, x, y, ticks);
        }
        ++ticks;
    }
    
    return plattform;
}

Enhet.prototype.trajectory_rekkevidde = function(enhet, fra_topp) {
    // Finner ut om en enhet vil være innenfor rekkevidde for enheten hvis den:
    //  - er på en plattform og hopper nå
    //  - er i luften allerede
    //  - hvis fra_topp == true: hvis den starter et fall nå
    // Dette tar IKKE enhetens bevegelse med i beregningen!
    // Funksjonen bryr seg heller ikke om hvorvidt enheten vil overleve hoppet.
    //var momentum = this.momentum + this.hoppstyrke;
    //var momentum_x = this.momentum_x + (this.retning * this.hastighet);
    var momentum = this.momentum;
    var momentum_x = this.momentum_x;
    if (this.status == "normal") {
        momentum += this.hoppstyrke;
        momentum_x += this.retning * this.hastighet;
    }
    if (fra_topp) {
        momentum = 0;
        --y;
    }
    
    var x = this.punkt_x();
    var y = this.punkt_y();
    var forrige_x = 0;
    var forrige_y = 0;
    var plattform = null;
    while (!plattform && y <= Spill.brett.taplinje) {
        forrige_x = x;
        forrige_y = y;
        x += momentum_x;
        y -= momentum;
        momentum -= Spill.gravitasjon;
        if (momentum <= 0) {
            plattform = Spill.brett.land(forrige_x, forrige_y, x, y);
            var avstand = Math.abs(x - enhet.punkt_x());
            if (avstand <= this.rekkevidde && enhet.punkt_y() >= y && enhet.punkt_y() <= y + this.hoyde) {
                return true;
            }
            
        }
    }
    
    return false;
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
    elmt.prop("src", "bilder/"+this.type+"/"+this.farge+"/"+bilde);
}

Enhet.prototype.velg_farge = function(farge) {
    this.farge = farge;
}

var enheter = {}

Enhet.registrer = function(type, enhetklasse) {
    enheter[type] = enhetklasse;
}

Enhet.ny = function(type, x, y) {
    return new enheter[type](x, y);
}