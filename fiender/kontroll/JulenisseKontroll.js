JulenisseKontroll = function() {}

JulenisseKontroll.prototype = Object.create(Kontroll.prototype);
JulenisseKontroll.prototype.constructor = JulenisseKontroll

/*
 * Faser (med handlinger):
 *      "start": Nissen sitter på sleden sin i 5 sekunder
 *          "vent": 
 */

var fiendefasegrupper = [0, 3, 3, 2, 3, 3];
var fiendefasetellere = [0, 300, 180];

JulenisseKontroll.prototype.tilfeldig_handling = function(enhet) {
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

JulenisseKontroll.prototype.styr = function(enhet) {
    //console.log(enhet.fase, enhet.handling, enhet.handlingteller);
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
                            Spill.brett.hent_plattform("hengeplattform").skjul();
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
                    if (enhet.handlingteller > 190) {
                        enhet.beveg(this.retning);
                    } else if (enhet.handlingteller > 131) {
                        enhet.sett_retning (-this.retning);
                    } else if (enhet.handlingteller == 131) {
                        enhet.angrip();
                    } else if (enhet.handlingteller > 90) {
                        enhet.beveg(-this.retning);
                    } else if (enhet.handlingteller == 90) {
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

Kontroll.sett("julenisse", new JulenisseKontroll());