JulenisseKontroll = function() {}

JulenisseKontroll.prototype = Object.create(Kontroll.prototype);
JulenisseKontroll.prototype.constructor = JulenisseKontroll

/*
 * Faser (med handlinger):
 *      "start": Nissen sitter på sleden sin i 5 sekunder
 *          "vent": Sleden synker ned fra toppen av skjermen
 *      "hovedfase": Nissen er på hovedplattformen og angriper spilleren
 *          "snøballer": Nissen er på hovedplattformen og angriper spilleren
 *              1. Løp til en kant
 *              2. Kast 3 snøballer, løp til andre kant
 *              3. Kast 3 snøballer, løp til andre kant
 *              4. Kast 3 snøballer, løp til andre kant
 *          "sukkerstenger": Sukkerstenger kommer opp fra under brettet.
 *          "vind": Nissen blåser en sterk vind som fører med seg ting ("fiender") spilleren må hoppe over
 *      "sledefase": Nissen flyr over banen i en slede i 1 minutt - snøballer i 10 sekunder, fly lavt i 5 sekunder
 *          "snøballer": Nissen kaster snøballer fra luften
 *              1. Sitt i ro på sleden, slipp en snøball hvert sekund (300)
 *          "lavt": Nissen flyr lavt over plattformen for å skade spilleren
 *              1. Fly opp, ut av syne (60)
 *              2. "Teleporter" til høyre side av brettet, på utsiden (0)
 *              3. Fly raskt over plattformen (30)
 *              4. "Teleporter" tilbake til over brettet (0)
 *              5. Fly ned i syne igjen (60)
 *      "sluttfase": Nissen blir permanent på sleden sin, spilleren må opp dit for å angripe ham. Hovedplattformen deler seg opp og beveger seg.
 *          "snøballer": Brukes kun hvis spilleren er på hovedplattformen. Fungerer akkurat slik som i sledefasen.
 *          "sukkerstenger": Brukes kun hvis spilleren er på hovedplattformen. Sukkerstenger kommer opp fra under brettet.
 *          "slå": Brukes kun hvis spilleren er på sleden. Nissen forbereder et angrep som slår spilleren av sleden.
 *              1. Stopp sleden
 *              2. Vent 5 sekunder
 *              3. Slå til siden
 */


//JulenisseKontroll.prototype.tilfeldig_handling = function(enhet) {
//    switch (Math.floor(Math.random()*3)) { // Skru opp til 2 eller 3 for å tillate laser og bombe
//    //switch (2) {
//        case 0:
//            enhet.handling = "plattform";
//            enhet.handlingteller = 330;
//            this.retning = Math.floor(Math.random()*2)*2-1
//            break;
//        case 1:
//            enhet.handling = "laser";
//            enhet.handlingteller = 230;
//            this.retning = Math.floor(Math.random()*2)*2-1
//            Spill.brett.hent_plattform("blink-1").aktiver();
//            Spill.brett.hent_plattform("blink-2").aktiver();
//            Spill.brett.hent_plattform("blink-3").aktiver();
//            break;
//        case 2:
//            enhet.handling = "bombe";
//            enhet.handlingteller = 180;
//            break;
//    }
//}

JulenisseKontroll.prototype.tilfeldig_hovedfase_handling = function(enhet) {
    //switch (Math.floor(Math.random()*2)) {
    switch (1) {
        case 0:
            enhet.handling = "snøballer";
            enhet.handlingteller = -1; // Sørg for å løpe til en side først
            this.retning = Math.floor(Math.random()*2)*2-1;
            break;
        case 1:
            enhet.handling = "sukkerstenger";
            enhet.handlingteller = 150;
            break;
        case 2:
            break;
    }
}

JulenisseKontroll.prototype.tilfeldig_sluttfase_handling = function(enhet) {
    
}

JulenisseKontroll.prototype.styr = function(enhet) {
    switch (enhet.fase) {
        case "":
            enhet.fase = "start";
            enhet.handling = "vent";
            enhet.handlingteller = 147; // Stopper sleden akkurat på bunnen
            break;
        case "start":
            --enhet.handlingteller;
            if (enhet.handlingteller == 0) {
                enhet.fall();
                Spill.brett.hent_plattform("slede").stoppet = true;
                enhet.fase = "hovedfase";
                this.tilfeldig_hovedfase_handling(enhet);
            }
            break;
        case "hovedfase":
            switch (enhet.handling) {
                case "snøballer":
                    if (enhet.handlingteller == -1) {
                        if (enhet.punkt_x() == 400 + this.retning * 400) {
                            enhet.handlingteller = 241;
                        } else {
                            enhet.beveg(this.retning);
                        }
                    } else {
                        if (enhet.punkt_x() == 400 + this.retning * 400) {
                            this.retning *= -1;
                            enhet.sett_retning(this.retning);
                            enhet.angrip();
                        } else if (enhet.handlingteller > 0) {
                            enhet.beveg(this.retning);
                            --enhet.handlingteller;
                        }
                    }
                    break;
                case "sukkerstenger":
                    if (enhet.handlingteller == 150) {
                        enhet.start_sukkerstenger();
                    }
                    --enhet.handlingteller;
                    break;
                case "vind":
                    break;
            }
            if (enhet.handlingteller == 0) {
                // Enten gå til neste fase, eller velg ny handling
                this.tilfeldig_hovedfase_handling(enhet);
            }
            break;
        case "sledefase":
            break;
        case "sluttfase":
            break;
    }
    //switch (enhet.fase) {
    //    case "":
    //        enhet.fase = "start";
    //        enhet.handling = "vent";
    //        enhet.handlingteller = 150;
    //        break;
    //    case "start":
    //        switch (enhet.handling) {
    //            case "vent":
    //                --enhet.handlingteller;
    //                if (enhet.handlingteller <= 0) {
    //                    enhet.handling = "start";
    //                    enhet.handlingteller = 90;
    //                }
    //                break;
    //            case "start":
    //                if (enhet.punkt_x() > 400) {
    //                    enhet.beveg(-1);
    //                } else {
    //                    --enhet.handlingteller;
    //                    if (enhet.handlingteller <= 0) {
    //                        Spill.brett.hent_plattform("hengeplattform").skjul();
    //                        enhet.fase = "hovedfase";
    //                        this.tilfeldig_handling(enhet);
    //                    }
    //                }
    //                break;
    //        }
    //        break;
    //    case "hovedfase":
    //        switch (enhet.handling) {
    //            case "plattform":
    //                if (enhet.handlingteller > 290) {
    //                    enhet.beveg(this.retning);
    //                } else if (enhet.handlingteller > 210) {
    //                    enhet.beveg(-this.retning);
    //                } else if (enhet.handlingteller > 130) {
    //                    enhet.beveg(this.retning)
    //                } else if (enhet.handlingteller > 90) {
    //                    enhet.beveg(-this.retning)
    //                }
    //                break;
    //            case "laser":
    //                if (enhet.handlingteller > 190) {
    //                    enhet.beveg(this.retning);
    //                } else if (enhet.handlingteller > 131) {
    //                    enhet.sett_retning (-this.retning);
    //                } else if (enhet.handlingteller == 131) {
    //                    enhet.angrip();
    //                } else if (enhet.handlingteller > 90) {
    //                    enhet.beveg(-this.retning);
    //                } else if (enhet.handlingteller == 90) {
    //                    Spill.brett.hent_plattform("blink-1").deaktiver();
    //                    Spill.brett.hent_plattform("blink-2").deaktiver();
    //                    Spill.brett.hent_plattform("blink-3").deaktiver();
    //                }
    //                break;
    //            case "bombe":
    //                if (enhet.handlingteller == 180) {
    //                    enhet.sett_retning(0);
    //                    enhet.hoppstyrke = 50;
    //                    enhet.vis_bomber();
    //                    enhet.start_bomber();
    //                    Spill.brett.hent_plattform("bombeplattform").aktiver();
    //                    enhet.hopp();
    //                } else if (enhet.handlingteller == 179) {
    //                } else if (enhet.handlingteller == 90) {
    //                    Spill.brett.hent_plattform("bombeplattform").deaktiver();
    //                }
    //                break;
    //        }
    //        --enhet.handlingteller;
    //        if (enhet.handlingteller <= 0) {
    //            if (enhet.hp % 20 == 0 && enhet.fiendefaseflagg) {
    //                // Start fiendefase
    //                Spill.brett.hent_plattform("hengeplattform").vis();
    //                enhet.fiendefaseflagg = false;
    //                ++enhet.fiendefaseteller;
    //                enhet.fiendefasegruppe = 0;
    //                enhet.fase = "fiendefase";
    //                enhet.handling = "hopp";
    //                enhet.handlingteller = 2;
    //            } else {
    //                this.tilfeldig_handling(enhet);
    //            }
    //        }
    //        break;
    //    case "fiendefase":
    //        switch (enhet.handling) {
    //            case "hopp":
    //                if (enhet.handlingteller > 0) {
    //                    enhet.beveg(1);
    //                    --enhet.handlingteller;
    //                } else {
    //                    enhet.hastighet = 15;
    //                    enhet.hoppstyrke = 32;
    //                    enhet.sett_retning(1);
    //                    enhet.hopp();
    //                    enhet.handling = "vent";
    //                    enhet.handlingteller = 1000;
    //                }
    //                break;
    //            case "vent":
    //                enhet.sett_retning(-1);
    //                if (enhet.handlingteller <= 0) {
    //                    enhet.handling = "tilbake";
    //                    enhet.hastighet = 10;
    //                    enhet.hoppstyrke = 20;
    //                    enhet.handlingteller = 90;
    //                } else if (enhet.handlingteller % fiendefasetellere[enhet.fiendefaseteller] == 0) {
    //                    ++enhet.fiendefasegruppe;
    //                    for (var i=1; i<=fiendefasegrupper[enhet.fiendefasegruppe]; ++i) {
    //                        Spill.brett.hent_fiende("fiende-"+enhet.fiendefasegruppe+"-"+i).aktiver();
    //                    }
    //                }
    //                --enhet.handlingteller;
    //                break;
    //            case "tilbake":
    //                if (enhet.punkt_x() > 400) {
    //                    enhet.beveg(-1);
    //                } else {
    //                    Spill.brett.hent_plattform("hengeplattform").skjul();
    //                    --enhet.handlingteller;
    //                    if (enhet.handlingteller <= 0) {
    //                        enhet.fase = "hovedfase";
    //                        this.tilfeldig_handling(enhet);
    //                    }
    //                }
    //                break;
    //        }
    //        break;
    //}
}

Kontroll.sett("julenisse", new JulenisseKontroll());