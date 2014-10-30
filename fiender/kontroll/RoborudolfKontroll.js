RoborudolfKontroll = function() {
    
}

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
 *          "laser": Rudolf skyter en laser (260)
 *              1. Løp til en ende av plattformen (40: >220)
 *              2. Snu og vent 2 sekunder (60: >160)
 *              3. Skyt laser (30: >130)
 *              4. Løp til midten av plattformen (40: >90)
 *              5. Vent 3 sekunder (90: >0)
 *          "bombe": Rudolf er på øverste plattform og dropper bomber
 *              1. Hopp opp til øverste plattform (?)
 *              2. Slipp bomber (150)
 *              3. Hopp ned igjen (?)
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
 */

RoborudolfKontroll.prototype.tilfeldig_handling = function(enhet) {
    switch (Math.floor(Math.random()*1)) { // Skru opp til 2 eller 3 for å tillate laser og bombe
        case 0:
            enhet.handling = "plattform";
            enhet.handlingteller = 330;
            this.retning = Math.floor(Math.random()*2)*2-1
            break;
        case 1:
            enhet.handling = "laser";
            enhet.handlingteller = 260;
            break;
        case 2:
            enhet.handling = "bombe";
            break;
    }
}

RoborudolfKontroll.prototype.styr = function(enhet) {
    console.log(enhet.fase, enhet.handling, enhet.handlingteller);
    switch (enhet.fase) {
        case "":
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
                            enhet.fase = "hovedfase";
                            this.tilfeldig_handling(enhet);
                        }
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
                    }
                    break;
                case "laser":
                    // TODO
                    break;
                case "bombe":
                    // TODO
                    break;
            }
            --enhet.handlingteller;
            if (enhet.handlingteller <= 0) {
                if (enhet.hp % 20 == 0 && enhet.fiendefaseflagg) {
                    // Start fiendefase
                    enhet.fase = "fiendefase";
                    enhet.handling = "hopp";
                } else {
                    this.tilfeldig_handling(enhet);
                }
            }
            break;
        case "fiendefase":
            switch (enhet.handling) {
                case "hopp":
                    enhet.hastighet = 15;
                    enhet.hoppstyrke = 32;
                    enhet.sett_retning(1);
                    enhet.hopp();
                    enhet.handling = "vent";
                    enhet.handlingteller = 300;
                    break;
                case "vent":
                    --enhet.handlingteller;
                    if (enhet.handlingteller <= 0) {
                        enhet.handling = "tilbake";
                        enhet.handlingteller = 90;
                    }
                    break;
                case "tilbake":
                    if (enhet.punkt_x() > 400) {
                        enhet.beveg(-1);
                    } else {
                        --enhet.handlingteller;
                        console.log(enhet.punkt_x());
                        if (enhet.handlingteller <= 0) {
                            enhet.hastighet = 10;
                            enhet.hoppstyrke = 20;
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