Enhet = function(bilde) {
    this.type = "enhet";
    
    this.bilde = bilde;
    this.x = 0;
    this.y = 0;
    this.bredde = 0;
    this.hoyde = 0;
    this.momentum = 0;
    this.retning = 0;
    this.hastighet = 10;
    this.hoppstyrke = 30;
    
    this.status = "normal";
    this.plattform = null;
    this.kontroll = null;
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
    if (this.kontroll) {
        this.kontroll.styr(this);
    }
}

Enhet.prototype.sett_posisjon = function(x, y) {
    this.x = x;
    this.y = y;
    var elmt = this.hent_element();
    elmt.css('left', x);
    elmt.css('top', y);
}

Enhet.prototype.flytt = function(x, y) {
    this.x += x;
    this.y += y;
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
}

Enhet.prototype.hopp = function() {
    this.plattform = null;
    this.momentum = this.hoppstyrke;
    this.status = "luft";
}

Enhet.prototype.angrip = function() {
    this.status = "angrep";
}