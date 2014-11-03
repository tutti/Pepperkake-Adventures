Plattform = function(bilde, x, y, bredde, hoyde) {
    this.type = "vanlig";
    this.x = x;
    this.y = y;
    this.bredde = bredde;
    this.hoyde = hoyde;
    this.vises = true; // Plattformer som ikke vises, kan ikke stås på
    this.bilde = bilde;
    this.enheter = [];
    this.utgang = false;
    
    this.aktiv = false;
}

Plattform.prototype.hent_element = function() {
    // Hvis plattformen har et HTML-element, returneres det.
    // Ellers lages et nytt som returneres.
    // Elementet skal uansett være et jQuery-objekt.
    if (this.element === undefined) {
        this.element = $('<div class="plattform plattform-' + this.type + '">');
        this.element
            .css('background', 'url("' + this.bilde + '")')
            .width(this.bredde)
            .height(this.hoyde)
            .css('left', this.x)
            .css('top', this.y);
        $("#spillvindu").append(this.element);
    }
    if (this.utgang_element === undefined && this.utgang) {
        this.utgang_element = $('<div class="utgang">');
        this.utgang_element
            .css('left', this.x+(this.bredde/2)-32)
            .css('top', this.y-64);
        $("#spillvindu").append(this.utgang_element);
    }
    return this.element;
}

Plattform.prototype.sett_bilde = function(bilde) {
    this.bilde = bilde;
    var elmt = this.hent_element();
    elmt.css('background', 'url("' + bilde + '")');
}

Plattform.prototype.vis = function() {
    var elmt = this.hent_element();
    elmt.show();
    if (this.utgang) this.utgang_element.show();
    this.vises = true;
}

Plattform.prototype.skjul = function() {
    var elmt = this.hent_element();
    elmt.hide();
    if (this.utgang) this.utgang_element.hide();
    this.vises = false;
    for (e_id in this.enheter) {
        this.enheter[e_id].fall();
    }
}

Plattform.prototype.aktiver = function() {
    this.stoppet = this.start_stoppet;
    this.aktiv = true;
    this.vis();
}

Plattform.prototype.deaktiver = function() {
    this.aktiv = false;
    this.skjul();
}

Plattform.prototype.sett_utgang = function(utgang) {
    // utgang skal enten være false (for ingen utgang),
    // en streng som sier hvilket brett utgangen skal gå til,
    // eller en tom streng hvis utgangen går til hovedmenyen
    // (f.eks hvis spillet er ferdig).
    this.utgang = utgang;
}

Plattform.prototype.tick = function() {
}

Plattform.prototype.lander = function(x1, y1, x2, y2, ticks) {
    // Sjekker om et fallende objekt kan lande på plattformen
    // Enkel sjekk; objektet må gå fra over plattformen til under,
    // og x2 må lande på plattformen (en ordentlig sjekk ville ha
    // sjekket punktet der linjene krysser).
    // Antall ticks inn i fremtiden plattformen skal sjekkes kan
    // spesifiseres, men gjør ingen forskjell for vanlige
    // plattformer.
    if (!this.vises) return false;
    if (y1 >= this.y || y2 < this.y) {
        return false;
    }
    if (x2 < this.x || x2 > this.x+this.bredde) {
        return false;
    }
    return true;
}

Plattform.prototype.er_pa = function(x) {
    // Sjekker om et objekt fortsatt er på plattformen.
    // Dette antar an objektet er på plattformen i utgangspunktet,
    // og y-koordinaten er derfor unødvendig.
    if (x < this.x || x > this.x+this.bredde) {
        return false;
    }
    return true;
}

Plattform.prototype.legg_til = function(enhet) {
    if (this.utgang && enhet == Spill.spiller) {
        Spill.brett_ferdig(this.utgang);
        return;
    }
    var i = this.enheter.indexOf(enhet);
    if (i == -1) {
        this.enheter.push(enhet);
    }
}

Plattform.prototype.fjern = function(enhet) {
    var i = this.enheter.indexOf(enhet);
    if (i != -1) {
        this.enheter.splice(i, 1);
    }
}