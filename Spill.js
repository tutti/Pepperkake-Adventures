Spill = {
    gravitasjon: 2,
    brett: null
}

// Last inn data om brettene
brett = [];
for (b_id in brettdata) {
    var data = JSON.parse(atob(brettdata[b_id]));
    brett[b_id] = new Brett(data);
}

Spill.last_brett = function(brett_id) {
    this.brett = brett[brett_id];
    this.brett.last();
}

Spill.tick = function() {
    Spiller.tick();
    if (this.brett) {
        this.brett.tick();
    }
}