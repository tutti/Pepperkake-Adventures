Samleobjekt = function() {
    this.x = 0;
    this.y = 0;
    this.aktiv = false;
    this.samlet = false;
}

Samleobjekt.prototype.hent_element = function() {
    if (this.element === undefined) {
        this.element = $('<img class="samleobjekt" src="bilder/smule.png" />');
        this.element.width(16);
        this.element.height(16);
        this.element.css('left', this.x);
        this.element.css('top', this.y);
        $("#spillvindu").append(this.element);
    }
    return this.element;
}

Samleobjekt.prototype.slett_element = function() {
    if (this.element !== undefined) {
        this.element.remove();
        delete this.element;
    }
}

Samleobjekt.prototype.sett_posisjon = function(x, y) {
    this.x = x-8;
    this.y = y-8;
    if (this.element) {
        this.element.css("left", x).css("top", y);
    }
}

Samleobjekt.prototype.sjekk_kollisjon = function(enhet) {
    if (!this.aktiv) return;
    if (enhet.x>this.x+16 || enhet.x+enhet.bredde<this.x || enhet.y>this.y+16 || enhet.y+enhet.hoyde<this.y) {
        return;
    }
    this.samlet = true;
    this.deaktiver();
    Spill.brett.samlet();
    Lyd.Effekt.spill("lyd/samle.mp3");
}

Samleobjekt.prototype.aktiver = function() {
    var elmt = this.hent_element();
    elmt.show();
    this.aktiv = true;
    this.samlet = false;
}

Samleobjekt.prototype.deaktiver = function() {
    var elmt = this.hent_element();
    elmt.hide();
    this.aktiv = false;
}