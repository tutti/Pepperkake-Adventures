Brett = function(data, mappe, filnavn, apnet, bestetid, bestesamlet) {
    this.navn = data.navn;
    this.mappe = mappe;
    this.filnavn = filnavn;
    this.lastet = false;
    this.bredde = data.bredde;
    this.bakgrunn = data.bakgrunn;
    this.musikk = data.musikk;
    this.tekst = data.tekst;
    this.apnet = apnet;
    this.bestetid = bestetid;
    this.ticks = 0;
    this.bestesamlet = bestesamlet;
    this.samleobjekter = [];
    this.plattformer = [];
    this.t_plattformer = {};
    this.plattformer_id = {};
    this.fiender = [];
    this.t_fiender = {};
    this.fiender_id = {};
    if (!data.taplinje && data.taplinje != 0) {
        this.taplinje = 650;
    } else {
        this.taplinje = data.taplinje;
    }
    
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
                    var plattform = new BlinkPlattform(p.bilde, p.x, p.y, p.bredde, p.hoyde, p.ticktall);
                    break;
                case "heis":
                    var plattform = new HeisPlattform(p.bilde, p.x, p.y, p.bredde, p.hoyde, p.dx, p.dy, p.ticktall);
                    break;
                case "vanlig":
                default:
                    var plattform = new Plattform(p.bilde, p.x, p.y, p.bredde, p.hoyde);
                    break;
            }
            
            plattform.start_aktiv = p.aktiv;
            plattform.start_stoppet = p.stopp;
            
            if (p.utgang) {
                plattform.sett_utgang(p.utgang);
            }
            
            if (p.id) {
                this.plattformer_id[p.id] = plattform;
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
            
            var fiende = Enhet.ny(f.type, f.x, f.y);
            
            fiende.start_aktiv = f.aktiv;
            
            if (f.id) {
                this.fiender_id[f.id] = fiende;
            }
            
            if (f.utgang) {
                fiende.utgang = f.utgang;
            }
            
            this.fiender.push(fiende);
        }
    }
    
    for (s_id in data.samle) {
        var s = data.samle[s_id];
        var samleobjekt = new Samleobjekt();
        samleobjekt.sett_posisjon(s.x, s.y);
        this.samleobjekter.push(samleobjekt);
    }
    
    this.x = data.spiller[0];
    this.y = data.spiller[1];
    
    var knapp = $('[data-mappe="'+this.mappe+'"][data-brett="'+this.filnavn+'"]');
    if (apnet) {
        knapp.removeClass("disabled");
    }
    if (this.samleobjekter.length > 0) {
        knapp.closest(".brettknapp-container").find(".samlingteller").text(this.bestesamlet + "/" + this.samleobjekter.length);
    } else {
        knapp.closest(".brettknapp-container").find(".samlingteller").hide();
    }
    
    if (this.bestetid > -1) {
        var sekunder = Math.floor(this.bestetid/30) % 60;
        var minutter = Math.floor(this.bestetid/1800);
        knapp.closest(".brettknapp-container").find(".bestetid").text(
            (minutter < 10 ? "0" : "") + minutter
            + ":" +
            (sekunder < 10 ? "0" : "") + sekunder
        )
    }
}

Brett.prototype.vis_bakgrunn = function() {
    $("#spillvindu").css('background', 'url("'+this.bakgrunn+'")');
}

Brett.prototype.last = function() {
    for (p_id in this.plattformer) {
        if (this.plattformer[p_id].start_aktiv === false) {
            this.plattformer[p_id].deaktiver();
        } else {
            this.plattformer[p_id].aktiver();
        }
    }
    for (f_id in this.fiender) {
        if (this.fiender[f_id].start_aktiv === false) {
            this.fiender[f_id].deaktiver();
        } else {
            this.fiender[f_id].aktiver();
        }
    }
    for (s_id in this.samleobjekter) {
        if (this.samleobjekter[s_id].start_aktiv === false) {
            this.samleobjekter[s_id].deaktiver();
        } else {
            this.samleobjekter[s_id].aktiver();
        }
    }
    this.lastet = true;
    this.ticks = 0;
    Spill.spiller.status = "luft";
    Spill.spiller.aktiver();
    Spill.spiller.fokus();
    Spill.spiller.sett_posisjon(this.x, this.y);
    Lyd.BGM.sett(this.musikk).spill();
    this.vis_bakgrunn();
    $("#samlerui-teller").text(0);
    $("#samlerui-nevner").text(this.samleobjekter.length);
}

Brett.prototype.last_ut = function() {
    for (p_id in this.plattformer) {
        this.plattformer[p_id].deaktiver();
        this.plattformer[p_id].slett_element();
    }
    for (f_id in this.fiender) {
        this.fiender[f_id].deaktiver();
        this.fiender[f_id].slett_element();
    }
    for (s_id in this.samleobjekter) {
        this.samleobjekter[s_id].deaktiver();
        this.samleobjekter[s_id].slett_element();
    }
    this.lastet = false;
    Lyd.BGM.pause();
    Spill.spiller.deaktiver();
    $("#spillvindu").css('background', '');
}

Brett.prototype.apne = function() {
    this.apnet = true;
    $('[data-mappe="'+this.mappe+'"][data-brett="'+this.filnavn+'"]').removeClass("disabled");
    Server.apne_brett(this.mappe, this.filnavn);
    console.log("Åpner lastet brett");
}

Brett.prototype.land = function(x1, y1, x2, y2, ticks) {
    // Sjekker om en enhet som går fra (x1, y1) til (x2, y2)
    // lander på en plattform og returnerer plattformen.
    // Returnerer null hvis ingen plattform.
    // Hvis ticks er oppgitt, vil det sjekkes om en landing kan foretas etter så mange tick.
    if (!ticks) ticks = 0;
    for (p_id in this.plattformer) {
        if (this.plattformer[p_id].lander(x1, y1, x2, y2, ticks)) {
            return this.plattformer[p_id];
        }
    }
    return null;
}

Brett.prototype.hent_plattform = function(p_id) {
    return this.plattformer_id[p_id];
}

Brett.prototype.hent_fiende = function (f_id) {
    return this.fiender_id[f_id];
}

Brett.prototype.skadFiender = function(x1, y1, x2, y2, skade, retning, kraft) {
    // Skader alt som overlapper en firkant gitt av de fire koordinatene
    // Skade er valgfritt, default 1.
    // Retning (horisontalt) er også valgfritt. Dersom den er oppgitt, brukes den som den er;
    // hvis ikke regnes retningen ut fra midten av angrepet og enheten.
    // Kraft er også valgfritt, med en default 1. Dette er en multiplikator for hvor langt
    // fienden skal slås.
    // MERK: Foreløpig kode setter retning til 0 hvis den ikke blir oppgitt.
    // Ikke kall denne direkte; kall heller Brett.skad().
    if (x2 < x1 || y2 < y1) {
        console.error("skadFiender: Dårlige koordinater", x1, y1, x2, y2);
        return false;
    }
    var skadet = false;
    if (!skade && skade != 0) {
        skade = 1;
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
            f.skade(skade, retning, kraft);
            skadet = true;
        }
    }
    return skadet;
}

Brett.prototype.skadSpiller = function(x1, y1, x2, y2, skade, retning, kraft) {
    // Skader spilleren hvis den overlapper den gitte posisjonen
    // Ikke kall denne direkte; kall heller Brett.skad().
    if (x2 < x1 || y2 < y1) {
        console.error("skadSpiller: Dårlige koordinater", x1, y1, x2, y2);
        return false;
    }
    var p = Spill.spiller;
    if (p.x <= x2 && p.x+p.bredde >= x1 && p.y <= y2 && p.y+p.hoyde >= y1) {
        if (!skade && skade != 0) {
            skade = 1;
        }
        if (!kraft && kraft != 0) {
            kraft = 1;
        }
        if (!retning && retning != 0) {
            retning = 0;
        }
        p.skade(skade, retning, Math.sqrt(kraft));
        Spill.spillerhp(p.hp);
        return true;
    }
    return false;
}

Brett.prototype.skad = function(enhet, x1, y1, x2, y2, skade, retning, kraft) {
    if (enhet == Spill.spiller) {
        return this.skadFiender(x1, y1, x2, y2, skade, retning, kraft);
    } else {
        return this.skadSpiller(x1, y1, x2, y2, skade, retning, kraft);
    }
}

Brett.prototype.tick = function() {
    for (p_id in this.plattformer) {
        this.plattformer[p_id].tick();
    }
    for (f_id in this.fiender) {
        this.fiender[f_id].tick();
    }
    for (s_id in this.samleobjekter) {
        this.samleobjekter[s_id].sjekk_kollisjon(Spill.spiller);
    }
    ++this.ticks;
    var sekunder = Math.floor(this.ticks/30) % 60;
    var minutter = Math.floor(this.ticks/1800);
    $("#tidui-minutt").text((minutter < 10 ? "0" : "") + minutter);
    $("#tidui-sekund").text((sekunder < 10 ? "0" : "") + sekunder);
}

Brett.prototype.antall_samlet = function() {
    var antall = 0;
    for (s_id in this.samleobjekter) {
        if (this.samleobjekter[s_id].samlet) {
            ++antall;
        }
    }
    return antall;
}

Brett.prototype.samlet = function() {
    // Gjør ingen endringer, men brukes til å notifisere brettet om at et objekt har blitt samlet
    $("#samlerui-teller").text(this.antall_samlet());
}

Brett.prototype.oppdater_rekorder = function() {
    if (this.bestetid == -1) this.bestetid = this.ticks;
    else this.bestetid = Math.min(this.ticks, this.bestetid);
    this.bestesamlet = Math.max(this.antall_samlet(), this.bestesamlet);
    var knapp = $('[data-mappe="'+this.mappe+'"][data-brett="'+this.filnavn+'"]');
    knapp.closest(".brettknapp-container").find(".samlingteller").text(this.bestesamlet + "/" + this.samleobjekter.length);
    if (this.bestetid > -1) {
        var sekunder = Math.floor(this.bestetid/30) % 60;
        var minutter = Math.floor(this.bestetid/1800);
        knapp.closest(".brettknapp-container").find(".bestetid").text(
            (minutter < 10 ? "0" : "") + minutter
            + ":" +
            (sekunder < 10 ? "0" : "") + sekunder
        )
    }
}