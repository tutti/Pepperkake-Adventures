Brett = function(data) {
    this.navn = data.navn;
    this.bakgrunn = data.bakgrunn;
    this.plattformer = [];
    
    for (plattform_id in data.plattformer) {
        var p = data.plattformer[plattform_id];
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
    Spiller.sett_posisjon(this.x, this.y);
    Spiller.status = "luft";
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

Brett.prototype.tick = function() {
    for (p_id in this.plattformer) {
        this.plattformer[p_id].tick();
    }
}