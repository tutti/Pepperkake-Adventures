Brett = function(data) {
    this.navn = data.navn;
    this.bakgrunn = data.bakgrunn;
    this.plattformer = [];
    this.t_plattformer = {};
    this.fiender = [];
    this.t_fiender = {};
    
    for (plattform_id in data.plattformer) {
        var p = data.plattformer[plattform_id];
        
        if (p.templat) {
            this.t_plattformer[p.navn] = p;
        } else {
            if (p.arv) {
                var templat = this.t_plattformer[p.arv];
                var p2 = {};
                for (key in templat) {
                    p2[key] = templat[key];
                }
                for (key in p) {
                    p2[key] = p[key];
                }
                p = p2;
            }
            switch (p.type) {
                case "blink":
                    var plattform = new BlinkPlattform(p.x, p.y, p.bredde, p.hoyde, p.ticktall);
                    break;
                case "heis":
                    var plattform = new HeisPlattform(p.x, p.y, p.bredde, p.hoyde, p.dx, p.dy, p.ticktall);
                    break;
                case "vanlig":
                default:
                    var plattform = new Plattform(p.x, p.y, p.bredde, p.hoyde);
                    break;
            }
            
            this.plattformer.push(plattform);
        }
    }
    
    for (f_id in data.fiender) {
        var f = data.fiender[f_id];
        
        if (f.templat) {
            this.t_fiender[f.navn] = f;
        } else {
            if (f.arv) {
                var templat = this.t_fiender[f.arv];
                var f2 = {};
                for (key in templat) {
                    f2[key] = templat[key];
                }
                for (key in f) {
                    f2[key] = f[key];
                }
                f = f2;
            }
            switch (f.type) {
                case "gelebølle":
                default:
                    var fiende = new Gelebolle();
                    break;
            }
            
            fiende.sett_posisjon(f.x, f.y);
            
            this.fiender.push(fiende);
        }
    }
    
    this.x = data.spiller[0];
    this.y = data.spiller[1];
}

Brett.prototype.vis_bakgrunn = function() {
    $("#spillvindu").css('background', 'url("'+this.bakgrunn+'")');
}

Brett.prototype.last = function() {
    for (p_id in this.plattformer) {
        this.plattformer[p_id].aktiver();
    }
    Spill.spiller.sett_posisjon(this.x, this.y);
    Spill.spiller.status = "luft";
    this.vis_bakgrunn();
}

Brett.prototype.last_ut = function() {
    for (p_id in this.plattformer) {
        this.plattformer[p_id].deaktiver();
    }
}

Brett.prototype.land = function(x1, y1, x2, y2) {
    // Sjekker om en enhet som går fra (x1, y1) til (x2, y2)
    // lander på en plattform og returnerer plattformen.
    // Returnerer null hvis ingen plattform.
    for (p_id in this.plattformer) {
        if (this.plattformer[p_id].lander(x1, y1, x2, y2)) {
            return this.plattformer[p_id];
        }
    }
    return null;
}

Brett.prototype.skadFiender = function(x1, y1, x2, y2, kraft, retning) {
    // Skader alt som overlapper en firkant gitt av de fire koordinatene
    // Kraft er valgfritt, default 1.
    // Retning (horisontalt) er også valgfritt. Dersom den er oppgitt, brukes den som den er;
    // hvis ikke regnes retningen ut fra midten av angrepet og enheten.
    // MERK: Foreløpig kode setter retning til 0 hvis den ikke blir oppgitt.
    if (x1 < x2 || y1 < y2) {
        console.error("skadFiender: Dårlige koordinater");
        return;
    }
    if (!kraft && kraft != 0) {
        kraft = 1;
    }
    if (!retning && retning != 0) {
        retning = 0;
    }
    for (f_id in this.fiender) {
        var f = this.fiender[f_id];
        if (f.x <= x2 && f.x+f.bredde >= x1 && f.y <= y2 && f.y+f.hoyde >= y1) {
            f.skade(kraft, retning);
        }
    }
}

Brett.prototype.skadSpiller = function(x1, y1, x2, y2, kraft, retning) {
    // Skader spilleren hvis den overlapper den gitte posisjonen
    var p = Spill.spiller;
    if (p.x <= x2 && p.x+p.bredde >= x1 && p.y <= y2 && p.y+p.hoyde >= y1) {
        if (!kraft && kraft != 0) {
            kraft = 1;
        }
        if (!retning && retning != 0) {
            retning = 0;
        }
        p.skade(kraft, retning);
    }
}

Brett.prototype.tick = function() {
    for (p_id in this.plattformer) {
        this.plattformer[p_id].tick();
    }
    for (f_id in this.fiender) {
        this.fiender[f_id].tick();
    }
}