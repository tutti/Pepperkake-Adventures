Gelebolle = function() {
    Enhet.call(this, "bilder/gelebolle.png");
    
    this.type = "gelebolle";
    this.bredde = 32;
    this.hoyde = 32;
    this.hastighet = 5;
    this.hoppstyrke = 0;
    this.retning = 1;
    
    this.sett_kontroll(Kontroll.hent("gelebølle"));
}

Gelebolle.prototype = Object.create(Enhet.prototype);
Gelebolle.prototype.constructor = Gelebolle

Gelebolle.prototype.tick = function() {
    if (!this.aktiv) return;
    Enhet.prototype.tick.call(this);
    Spill.brett.skadSpiller(this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, this.retning);
}

Gelebolle.prototype.hopp = function() {
    // Gjør ingenting - gelebøller kan ikke hoppe
}

Gelebolle.prototype.angrip = function() {
    // Gjør ingenting - gelebøller skader ved å røre borti, men kan ikke angripe
}