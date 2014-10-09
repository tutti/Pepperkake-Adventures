Spill = {
    gravitasjon: 2,
    brett: null,
    spiller: new Spiller()
}

//Spill.spiller.sett_kontroll(Kontroll.hent("spiller"));

// Last inn data om brettene
brett = [];
$(document).ready(function() {
    for (b_id in brettdata) {
        var data = JSON.parse(atob(brettdata[b_id]));
        brett[b_id] = new Brett(data);
    }
})

Spill.last_brett = function(brett_id) {
    this.brett = brett[brett_id];
    this.brett.last();
}

Spill.tick = function() {
    this.spiller.tick();
    if (this.brett) {
        this.brett.tick();
    }
    this.spiller.fokus();
}

Spill.spiller_dod = function() {
    this.brett.last_ut();
    $("#spillvindu").scrollLeft(0);
    $("#tapmeny").show();
}