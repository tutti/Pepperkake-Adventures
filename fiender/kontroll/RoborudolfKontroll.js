RoborudolfKontroll = function() {
    
}

RoborudolfKontroll.prototype = Object.create(Kontroll.prototype);
RoborudolfKontroll.prototype.constructor = RoborudolfKontroll

/*
 * Faser (med handlinger):
 *      "start": Rudolf starter på hengeplattformen
 *          "start": Startfasen har bare en handling.
 *              1. Vent 5 sekunder (150)
 *              2. Gå til midten av hovedplattformen
 *              3. Vent 3 sekunder
 *      "hovedfase": Rudolf angriper spilleren direkte
 *          "plattform": Rudolf løper over plattformen
 *              1. Løp til en side (40)
 *              2. Løp over plattformen 2 ganger (160)
 *              3. Løp til midten igjen (40)
 *              4. Vent 3 sekunder (90)
 *          "laser": Rudolf skyter en laser
 *              1. Løp til en ende av plattformen (40)
 *              2. Snu og vent 2 sekunder (60)
 *              3. Skyt laser (30)
 *              4. Løp til midten av plattformen (40)
 *              5. Vent 3 sekunder (90)
 *          "bombe": Rudolf er på øverste plattform og dropper bomber
 *              1. Hopp opp til øverste plattform (?)
 *              2. Slipp bomber (150)
 *              3. Hopp ned igjen (?)
 *              4. Vent 3 sekunder (90)
 *      "fiendefase": Rudolf står på hengeplattformen og tilkaller fiender
 *          "vent": Rudolf gjør ingenting selv i denne fasen.
 *              1. Vent i 30 sekunder (900)
 *          - Første gang: Tilkall fiender hvert 10. sekund
 *          - Andre gang: Tilkall fiender hvert 6. sekund
 *          - Fiendegrupper:
 *              1. 5 gelebøller
 *              2. 2 snømenn, 2 gelebøller
 *              3. 3 seigeninjaer
 *              4. 3 snømenn, 2 julebruisere
 *              5. 2 snømenn, 2 julebruisere, 2 seigeninjaer
 */

RoborudolfKontroll.prototype.styr = function(enhet) {
    
}

Kontroll.sett("roborudolf", new RoborudolfKontroll());