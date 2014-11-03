RoborudolfKontroll = function() {}

RoborudolfKontroll.prototype = Object.create(Kontroll.prototype);
RoborudolfKontroll.prototype.constructor = RoborudolfKontroll

/*
 * Faser (med handlinger):
 *      "start": Rudolf starter på hengeplattformen
 *          "vent": Rudolf venter i 5 sekunder før kampen.
 *              1. Vent 5 sekunder (150)
 *          "start": Rudolf går til midten av plattformen
 *              1. Gå til midten av hovedplattformen
 *              2. Vent 3 sekunder
 *      "hovedfase": Rudolf angriper spilleren direkte (330)
 *          "plattform": Rudolf løper over plattformen
 *              1. Løp til en side (40: >290)
 *              2. Løp over plattformen 2 ganger (160: >130)
 *              3. Løp til midten igjen (40: >90)
 *              4. Vent 3 sekunder (90: >0)
 *          "laser": Rudolf skyter en laser (230 + laser)
 *              1. Løp til en ende av plattformen (40: >190)
 *              2. Snu og vent 2 sekunder (60: >130)
 *              3. Skyt laser (0: >130)
 *              4. Løp til midten av plattformen (40: >90)
 *              5. Vent 3 sekunder (90: >0)
 *          "bombe": Rudolf hopper opp på plattformen øverst, og knuser den så bitene faller ned.
 *              1. Hopp opp til øverste plattform
 *              2. Slipp bomber (90)
 *              3. Hopp ned igjen
 *              4. Vent 3 sekunder (90)
 *      "fiendefase": Rudolf står på hengeplattformen og tilkaller fiender
 *          "hopp": Rudolf skal hoppe til hengeplattformen
 *              1. Hoppstyrke 35, hastighet 15: Hopp til høyre
 *          "vent": Rudolf gjør ingenting selv i denne fasen.
 *              1. Vent i 30 sekunder (900)
 *          "tilbake": Rudolf er på vei tilbake
 *              1. Gå til midten av hovedplattformen
 *          - Første gang: Tilkall fiender hvert 10. sekund
 *          - Andre gang: Tilkall fiender hvert 6. sekund
 *          - Fiendegrupper:
 *              1. 5 gelebøller
 *              2. 2 snømenn, 2 gelebøller
 *              3. 3 seigeninjaer
 *              4. 3 snømenn, 2 julebruisere
 *              5. 2 snømenn, 2 julebruisere, 2 seigeninjaer
 *              REVURDERT:
 *              1. 3 gelebøller
 *              2. 2 snømenn, 1 gelebølle
 *              3. 2 seigeninjaer
 *              4. 2 snømenn, 1 julebruiser
 *              5. 1 snømenn, 1 julebruisere, 1 seigeninjaer
 */

var fiendefasegrupper = [0, 3, 3, 2, 3, 3];
var fiendefasetellere = [0, 300, 180];

RoborudolfKontroll.prototype.tilfeldig_handling = function(enhet) {
    switch (Math.floor(Math.random()*3)) { // Skru opp til 2 eller 3 for å tillate laser og bombe
    //switch (2) {
        case 0:
            enhet.handling = "plattform";
            enhet.handlingteller = 330;
            this.retning = Math.floor(Math.random()*2)*2-1
            break;
        case 1:
            enhet.handling = "laser";
            enhet.handlingteller = 230;
            this.retning = Math.floor(Math.random()*2)*2-1
            Spill.brett.hent_plattform("blink-1").aktiver();
            Spill.brett.hent_plattform("blink-2").aktiver();
            Spill.brett.hent_plattform("blink-3").aktiver();
            break;
        case 2:
            enhet.handling = "bombe";
            enhet.handlingteller = 180;
            break;
    }
}

RoborudolfKontroll.prototype.styr = function(enhet) {
    //console.log(enhet.fase, enhet.handling, enhet.handlingteller);
    switch (enhet.fase) {
        case "":
            enhet.sta_stille();
            enhet.fase = "start";
            enhet.handling = "vent";
            enhet.handlingteller = 150;
            break;
        case "start":
            switch (enhet.handling) {
                case "vent":
                    --enhet.handlingteller;
                    if (enhet.handlingteller <= 0) {
                        enhet.handling = "start";
                        enhet.handlingteller = 90;
                    }
                    break;
                case "start":
                    if (enhet.punkt_x() > 400) {
                        enhet.beveg(-1);
                    } else {
                        --enhet.handlingteller;
                        if (enhet.handlingteller <= 0) {
                            Spill.brett.hent_plattform("hengeplattform").skjul();
                            enhet.fase = "hovedfase";
                            this.tilfeldig_handling(enhet);
                        }
                        enhet.sta_stille();
                    }
                    break;
            }
            break;
        case "hovedfase":
            switch (enhet.handling) {
                case "plattform":
                    if (enhet.handlingteller > 290) {
                        enhet.beveg(this.retning);
                    } else if (enhet.handlingteller > 210) {
                        enhet.beveg(-this.retning);
                    } else if (enhet.handlingteller > 130) {
                        enhet.beveg(this.retning)
                    } else if (enhet.handlingteller > 90) {
                        enhet.beveg(-this.retning)
                    } else {
                        enhet.sta_stille();
                    }
                    break;
                case "laser":
                    if (enhet.handlingteller > 190) {
                        enhet.beveg(this.retning);
                    } else if (enhet.handlingteller > 131) {
                        enhet.sta_stille();
                        enhet.sett_retning (-this.retning);
                    } else if (enhet.handlingteller == 131) {
                        enhet.angrip();
                    } else if (enhet.handlingteller > 90) {
                        enhet.beveg(-this.retning);
                    } else if (enhet.handlingteller == 90) {
                        enhet.sta_stille();
                        Spill.brett.hent_plattform("blink-1").deaktiver();
                        Spill.brett.hent_plattform("blink-2").deaktiver();
                        Spill.brett.hent_plattform("blink-3").deaktiver();
                    }
                    break;
                case "bombe":
                    if (enhet.handlingteller == 180) {
                        enhet.sett_retning(0);
                        enhet.hoppstyrke = 50;
                        enhet.vis_bomber();
                        enhet.start_bomber();
                        Spill.brett.hent_plattform("bombeplattform").aktiver();
                        enhet.hopp();
                    } else if (enhet.handlingteller == 179) {
                    } else if (enhet.handlingteller == 90) {
                        Spill.brett.hent_plattform("bombeplattform").deaktiver();
                        enhet.sta_stille();
                    }
                    break;
            }
            --enhet.handlingteller;
            if (enhet.handlingteller <= 0) {
                if (enhet.hp % 20 == 0 && enhet.fiendefaseflagg) {
                    // Start fiendefase
                    Spill.brett.hent_plattform("hengeplattform").vis();
                    enhet.fiendefaseflagg = false;
                    ++enhet.fiendefaseteller;
                    enhet.fiendefasegruppe = 0;
                    enhet.fase = "fiendefase";
                    enhet.handling = "hopp";
                    enhet.handlingteller = 2;
                } else {
                    this.tilfeldig_handling(enhet);
                }
            }
            break;
        case "fiendefase":
            switch (enhet.handling) {
                case "hopp":
                    if (enhet.handlingteller > 0) {
                        enhet.beveg(1);
                        --enhet.handlingteller;
                    } else {
                        enhet.hastighet = 15;
                        enhet.hoppstyrke = 32;
                        enhet.sett_retning(1);
                        enhet.hopp();
                        enhet.handling = "vent";
                        enhet.handlingteller = 1000;
                    }
                    break;
                case "vent":
                    enhet.sett_retning(-1);
                    if (enhet.handlingteller <= 0) {
                        enhet.handling = "tilbake";
                        enhet.hastighet = 10;
                        enhet.hoppstyrke = 20;
                        enhet.handlingteller = 90;
                    } else if (enhet.handlingteller % fiendefasetellere[enhet.fiendefaseteller] == 0) {
                        ++enhet.fiendefasegruppe;
                        for (var i=1; i<=fiendefasegrupper[enhet.fiendefasegruppe]; ++i) {
                            Spill.brett.hent_fiende("fiende-"+enhet.fiendefasegruppe+"-"+i).aktiver();
                        }
                    }
                    --enhet.handlingteller;
                    break;
                case "tilbake":
                    if (enhet.punkt_x() > 400) {
                        enhet.beveg(-1);
                    } else {
                        Spill.brett.hent_plattform("hengeplattform").skjul();
                        --enhet.handlingteller;
                        if (enhet.handlingteller <= 0) {
                            enhet.fase = "hovedfase";
                            this.tilfeldig_handling(enhet);
                        }
                    }
                    break;
            }
            break;
    }
}

Kontroll.sett("roborudolf", new RoborudolfKontroll());