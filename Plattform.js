Plattform = function(x, y, bredde, hoyde) {
    this.type = "vanlig";
    this.x = x;
    this.y = y;
    this.bredde = bredde;
    this.hoyde = hoyde;
    this.vises = true; // Plattformer som ikke vises, kan ikke stås på
    this.bilde = "bilder/plattform.png";
    
    this.aktiv = false;
}

Plattform.prototype.hent_element = function() {
    // Hvis plattformen har et HTML-element, returneres det.
    // Ellers lages et nytt som returneres.
    // Elementet skal uansett være et jQuery-objekt.
    if (this.element === undefined) {
        this.element = $('<img class="plattform plattform-' + this.type + '" src="' + this.bilde + '" />');
        this.element.width(this.bredde);
        this.element.height(this.hoyde);
        this.element.css('left', this.x);
        this.element.css('top', this.y);
        $("#spillvindu").append(this.element);
    }
    return this.element;
}

Plattform.prototype.sett_bilde = function(bilde) {
    this.bilde = bilde;
    var elmt = this.hent_element();
    elmt.attr('src', bilde);
}

Plattform.prototype.vis = function() {
    var elmt = this.hent_element();
    elmt.show();
    this.vises = true;
}

Plattform.prototype.skjul = function() {
    var elmt = this.hent_element();
    elmt.hide();
    this.vises = false;
}

Plattform.prototype.aktiver = function() {
    this.aktiv = true;
    this.vis();
}

Plattform.prototype.deaktiver = function() {
    this.aktiv = false;
    this.skjul();
}

Plattform.prototype.tick = function() {
    
}

Plattform.prototype.lander = function(x1, y1, x2, y2) {
    // Sjekker om et fallende objekt kan lande på plattformen
    // Enkel sjekk; objektet må gå fra over plattformen til under,
    // og x2 må lande på plattformen (en ordentlig sjekk ville ha
    // sjekket punktet der linjene krysser).
    if (y1 > this.y || y2 < this.y) {
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
}