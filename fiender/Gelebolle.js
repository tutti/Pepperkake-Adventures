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

Gelebolle.prototype.hopp = function() {
    // Gjør ingenting - gelebøller kan ikke hoppe
}

Gelebolle.prototype.angrip = function() {
    // TODO: Angrep
}