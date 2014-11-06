Julenisse = function(x, y) {
    this.type = "julenisse";
    Enhet.call(this, x, y);
    
    this.bredde = 64;
    this.hoyde = 64;
    this.hastighet = 10;
    this.hoppstyrke = 20;
    this.original_retning = 0;
    this.maxhp = 100;
    
    this.fase = "start";
    this.handling = "";
    this.handlingteller = 0;
    this.luftfaseflagg = false;
    
    this.sett_bilde("venstre", "venstre.png");
    this.sett_bilde("høyre", "hoyre.png");
    this.sett_bilde("sitte", "sitte.png");
    
    this.sett_kontroll(Kontroll.hent("julenisse"));
}

Julenisse.prototype = Object.create(Enhet.prototype);
Julenisse.prototype.constructor = Julenisse

Julenisse.prototype.hent_element = function() {
    var elmt = Enhet.prototype.hent_element.call(this);
    if (!this.laser_element) {
        this.laser_element = $('<img class="enhet-tillegg laser" src="bilder/roborudolf/0/laser.png" />');
        this.laser_element.width(800);
        this.laser_element.height(64);
        this.laser_element.css('left', 0);
        this.laser_element.css('top', 486);
        this.laser_element.hide();
        $("#spillvindu").append(this.laser_element);
    }
    if (!this.snoballer) {
        this.snoballer = [];
        for (var i = 0; i < 3; ++i) {
            this.snoballer[i] = {
                "element": $('<div class="enhet-tillegg snoball">'),
                "momentum": 0,
                "momentum_x": 0,
                "x": 0,
                "y": 0,
                "aktiv": true
            }
            this.snoballer[i].element.css('background-image', 'url("bilder/snoball.png")').width(16).height(16).css('left', this.snoballer[i].x).css('top', this.snoballer[i].y).hide();
            $("#spillvindu").append(this.snoballer[i].element);
        }
    }
    if (!this.sukkerstenger) {
        this.sukkerstenger = [];
        for (var i = 0; i < 8; ++i) {
            this.sukkerstenger[i] = {
                "element": $('<img class="enhet-tillegg sukkerstang" src="bilder/julenisse/0/sukkerstang.png">'),
                "x": 100*i+40,
                "y": 600,
                "teller": 0
            }
            this.sukkerstenger[i].element.width(20).height(90).css('left', this.sukkerstenger[i].x).css('top', this.sukkerstenger[i].y).hide();
            $("#spillvindu").append(this.sukkerstenger[i].element);
        }
    }
    return elmt;
}

Julenisse.prototype.slett_element = function() {
    Enhet.prototype.slett_element.call(this)
    if (this.snoballer) {
        for (var i = 0; i < 3; ++i) {
            this.snoballer[i].element.remove();
        }
        delete this.snoballer;
    }
    if (this.sukkerstenger) {
        for (var i = 0; i < 8; ++i) {
            this.sukkerstenger[i].element.remove();
        }
        delete this.sukkerstenger;
    }
}

Julenisse.prototype.sett_retning = function(retning) {
    Enhet.prototype.sett_retning.call(this, retning);
    switch (retning) {
        case -1:
            this.velg_bilde("venstre");
            break;
        case 1:
            this.velg_bilde("høyre");
            break;
    }
}

Julenisse.prototype.tick = function() {
    if (!this.aktiv) return;
    Enhet.prototype.tick.call(this);
    if (Spill.brett.skad(this, this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, (this.punkt_x() < 400 ? 1 : -1), 1.5)) {
        Lyd.Effekt.spill("lyd/slag1.mp3");
    }
    this.hent_element();
    for (var i=0; i<3; ++i) {
        if (this.snoballer[i].aktiv) {
            this.snoballer[i].x += this.snoballer[i].momentum_x;
            this.snoballer[i].y -= this.snoballer[i].momentum;
            this.snoballer[i].momentum -= Spill.gravitasjon;
            this.snoballer[i].element.css('left', this.snoballer[i].x).css('top', this.snoballer[i].y);
            if (Spill.brett.skad(this, this.snoballer[i].x, this.snoballer[i].y, this.snoballer[i].x+16, this.snoballer[i].y+16, 1, this.retning, 1)) {
                // Snøball-lydeffekt
            }
            if (this.snoballer[i].y >= Spill.brett.taplinje) {
                this.snoballer[i].aktiv = false;
                this.snoballer[i].element.hide();
            }
        }
    }
    for (var i=0; i<8; ++i) {
        if (this.sukkerstenger[i].teller > 0) {
            if (this.sukkerstenger[i].teller > 30 && this.sukkerstenger[i].teller <= 60) {
                this.sukkerstenger[i].y -= 3;
            } else if (this.sukkerstenger[i].teller <= 30) {
                this.sukkerstenger[i].y += 3;
            }
            this.sukkerstenger[i].element.css('left', this.sukkerstenger[i].x).css('top', this.sukkerstenger[i].y);
            if (Spill.brett.skad(this, this.sukkerstenger[i].x, this.sukkerstenger[i].y, this.sukkerstenger[i].x+20, this.sukkerstenger[i].y+60, 1, 0, 1)) {
                // Sukkerstang-lydeffekt
            }
            --this.sukkerstenger[i].teller;
        }
    }
}

Julenisse.prototype.angrep_tick = function() {
    Enhet.prototype.angrep_tick.call(this);
    var i = Math.floor((100-this.angrep_teller) / 20) - 1;
    if (i<3 && this.angrep_teller % 20 == 0) {
        console.log(i);
        this.snoballer[i].aktiv = true;
        this.snoballer[i].x = 400 - this.retning * 380;
        this.snoballer[i].y = 502;
        this.snoballer[i].momentum = 15;
        this.snoballer[i].momentum_x = 10*(i+1)*this.retning;
        this.snoballer[i].element.show();
    }
}

Julenisse.prototype.aktiver = function() {
    Enhet.prototype.aktiver.call(this);
    this.hastighet = 10;
    this.hoppstyrke = 20;
    this.fase = "";
    this.handling = "";
    this.handlingteller = 0;
    this.angrep = false;
    this.angrep_teller = 0;
    $("#bosshp").show();
    Spill.bosshp(100);
}

Julenisse.prototype.deaktiver = function() {
    Enhet.prototype.deaktiver.call(this);
    this.hent_element();
    $("#bosshp").hide();
    for (var i=0; i<3; ++i) {
        this.snoballer[i].aktiv = false;
        this.snoballer[i].element.hide();
    }
    for (var i=0; i<8; ++i) {
        this.sukkerstenger[i].teller = 0;
        this.sukkerstenger[i].y = 600;
        this.sukkerstenger[i].element.hide();
    }
}

Julenisse.prototype.angrip = function() {
    // Julenissens "hovedangrep" er snøballene.
    if (this.angrep_teller > 0) return;
    this.hent_element();
    this.angrep = true;
    this.angrep_teller = 100;
}

Julenisse.prototype.start_sukkerstenger = function() {
    for (var i=0; i<8; ++i) {
        this.sukkerstenger[i].teller = 60 + Math.floor(Math.random()*90);
        this.sukkerstenger[i].element.show();
    }
}

Julenisse.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
    var farge = "#0F0";
    if (this.hp <= 40) farge = "#F80";
    if (this.hp <= 20) farge = "#F00";
    Spill.bosshp(100 * this.hp / this.maxhp, farge);
    this.fiendefaseflagg = true;
    if (this.hp == 0) {
        this.fall();
        this.momentum = (20 * kraft) / 1.5;
        this.momentum_x = retning * kraft * 10;
    } else if (this.hp % 20 == 0) {
        this.immunitet += this.handlingteller + 50;
    }
}

Enhet.registrer("julenisse", Julenisse);