Brett = function(data) {
    this.navn = data.navn;
    this.bakgrunn = data.bakgrunn;
    this.plattformer = [];
    
    for (plattform_id in data.plattformer) {
        var p = data.plattformer[plattform_id];
        switch (p.type) {
            case "blink":
                var plattform = new BlinkPlattform(p.x, p.y, p.bredde, p.hoyde);
                break;
            case "heis":
                var plattform = new HeisPlattform(p.x, p.y, p.bredde, p.hoyde);
                break;
            case "vanlig":
            default:
                var plattform = new Plattform(p.x, p.y, p.bredde, p.hoyde);
                break;
        }
        
        this.plattformer.push(plattform);
    }
}

Brett.prototype.vis_bakgrunn = function() {
    $("#spillvindu").css('background', 'url("'+this.bakgrunn+'")');
}

Brett.prototype.last = function() {
    for (p_id in this.plattformer) {
        this.plattformer[p_id].aktiver();
    }
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