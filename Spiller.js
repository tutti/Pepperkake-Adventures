Spiller = new Enhet("bilder/spiller.png");

Spiller.sett_bilde("stopp", "bilder/spiller.png");
Spiller.sett_bilde("venstre", "bilder/spiller-v.gif");
Spiller.sett_bilde("høyre", "bilder/spiller-h.gif");

Spiller.hastighet = 8;
Spiller.hoppstyrke = 20;
Spiller.status = "normal";
Spiller.type = "spiller";
Spiller.bredde = 32;
Spiller.hoyde = 32;

Spiller.sett_kontroll(new SpillerKontroll());

Spiller.angrip = function() {
    // TODO: Implementer
}