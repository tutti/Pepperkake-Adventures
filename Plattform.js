Plattform = function(type, x, y, bredde, hoyde) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.bredde = bredde;
    this.hoyde = hoyde;
    this.vises = true; // Plattformer som ikke vises, kan ikke stås på
    this.bilde = "bilder/plattform.png";
    
    this.hent_element();
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

Plattform.prototype.skjul = function() {
    var elmt = this.hent_element();
    elmt.hide();
    this.vises = false;
}

Plattform.prototype.vis = function() {
    var elmt = this.hent_element();
    elmt.show();
    this.vises = true;
}