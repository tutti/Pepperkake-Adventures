Roborudolf = function(x, y) {
    this.type = "roborudolf";
    Enhet.call(this, x, y);
    
    this.bredde = 64;
    this.hoyde = 64;
    this.hastighet = 10;
    this.hoppstyrke = 20;
    this.original_retning = -1;
    this.maxhp = 60;
    
    this.fase = "start";
    this.handling = "";
    this.handlingteller = 0;
    this.fiendefaseflagg = false;
    this.fiendefaseteller = 0;
    this.fiendefasegruppe = 0;
    
    this.sett_bilde("venstre", "venstre.png");
    this.sett_bilde("høyre", "hoyre.png");
    this.sett_bilde("gå-venstre", "gv.gif");
    this.sett_bilde("gå-høyre", "gh.gif");
    
    this.sett_kontroll(Kontroll.hent("roborudolf"));
}

Roborudolf.prototype = Object.create(Enhet.prototype);
Roborudolf.prototype.constructor = Roborudolf

Roborudolf.prototype.hent_element = function() {
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
    if (!this.bomber) {
        this.bomber = [];
        for (var i = 0; i < 8; ++i) {
            this.bomber[i] = {
                "element": $('<div class="enhet-tillegg bombe">'),
                "momentum": 0,
                "x": 100*i,
                "y": 75,
                "nedtelling": 0
            }
            this.bomber[i].element.css('background-image', 'url("bilder/plattform1.png")').width(100).height(20).css('left', this.bomber[i].x).css('top', this.bomber[i].y).hide();
            $("#spillvindu").append(this.bomber[i].element);
        }
    }
    return elmt;
}

Roborudolf.prototype.slett_element = function() {
    Enhet.prototype.slett_element.call(this);
    if (this.laser_element) {
        this.laser_element.remove();
        delete this.laser_element;
    }
    if (this.bomber) {
        for (var i = 0; i < 8; ++i) {
            this.bomber[i].element.remove();
        }
        delete this.bomber;
    }
}

Roborudolf.prototype.beveg = function(retning) {
    Enhet.prototype.beveg.call(this, retning);
    switch (retning) {
        case -1:
            this.velg_bilde("gå-venstre");
            break;
        case 1:
            this.velg_bilde("gå-høyre");
            break;
    }
}

Roborudolf.prototype.sta_stille = function() {
    switch (this.retning) {
        case -1:
            this.velg_bilde("venstre");
            break;
        case 1:
            this.velg_bilde("høyre");
            break;
    }
}

Roborudolf.prototype.tick = function() {
    if (!this.aktiv) return;
    Enhet.prototype.tick.call(this);
    if (Spill.brett.skad(this, this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, (this.punkt_x() < 400 ? 1 : -1), 1.5)) {
        Lyd.Effekt.spill("lyd/gelebolle-slag.mp3");
    }
    if (this.handling == "bombe") {
        for (var i=0; i<8; ++i) {
            if (this.bomber[i].nedtelling > 0) {
                --this.bomber[i].nedtelling;
            } else {
                this.bomber[i].y -= this.bomber[i].momentum;
                this.bomber[i].element.css('top', this.bomber[i].y);
                this.bomber[i].momentum -= Spill.gravitasjon;
                if (Spill.brett.skad(this, this.bomber[i].x, this.bomber[i].y, this.bomber[i].x+100, this.bomber[i].y+20, 1, 0, 1.5)) {
                    console.log(this.bomber[i].x, this.bomber[i].y);
                }
            }
        }
    }
}

Roborudolf.prototype.angrep_tick = function() {
    Enhet.prototype.angrep_tick.call(this);
    Spill.brett.skad(this, 0, 484, 800, 550, 1, this.retning, 2);
}

Roborudolf.prototype.aktiver = function() {
    Enhet.prototype.aktiver.call(this);
    this.hastighet = 10;
    this.hoppstyrke = 20;
    this.fase = "";
    this.handling = "";
    this.handlingteller = 0;
    this.fiendefaseteller = 0;
    this.fiendefaseflagg = false;
    $("#bosshp").show();
    Spill.bosshp(100);
}

Roborudolf.prototype.deaktiver = function() {
    Enhet.prototype.deaktiver.call(this);
    this.hent_element();
    $("#bosshp").hide();
    this.laser_element.hide();
    for (var i=0; i<8; ++i) {
        this.bomber[i].element.hide();
    }
}

Roborudolf.prototype.angrip = function() {
    // Roborudolfs eneste direkte angrep er laseren hans.
    if (this.angrep_teller > 0) return;
    this.hent_element();
    this.laser_element.fadeIn(250).fadeOut(250);
    this.angrep = true;
    this.angrep_teller = 15;
    Lyd.Effekt.spill("lyd/roborudolf-laser.mp3");
}

Roborudolf.prototype.skade = function(skade, retning, kraft) {
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

Roborudolf.prototype.vis_bomber = function() {
    for (var i=0; i<8; ++i) {
        this.bomber[i].y = 75;
        this.bomber[i].momentum = 0;
        this.bomber[i].element.css('top', 75).show();
    }
}

Roborudolf.prototype.start_bomber = function() {
    var etterhenger = Math.floor(Math.random()*8);
    for (var i=0; i<8; ++i) {
        if (i == etterhenger) {
            this.bomber[i].nedtelling = Math.floor(Math.random()*60)+60;
        } else {
            this.bomber[i].nedtelling = Math.floor(Math.random()*60)+30;
        }
        
    }
}

Enhet.registrer("roborudolf", Roborudolf);