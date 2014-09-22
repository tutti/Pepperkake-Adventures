Brett = function(data) {
    this.navn = data.navn;
    this.kart = data.kart;
    this.bakgrunn = data.bakgrunn;
    this.skjermer = [];
    
    // Opprett Skjerm-objekter for alle skjermene
    for (skjerm_id in skjermer) {
        var skjerm_data = data.skjermer[skjerm_id];
        var skjerm = new Skjerm();
        this.skjermer[skjerm_id] = skjerm;
        
        // Lag plattformer på skjermen
        for (plattform_id in skjerm_data.plattformer) {
            var plattform_data = skjerm_data.plattformer[plattform_id];
            var plattform = new Plattform(
                plattform_data.type,
                plattform_data.x,
                plattform_data.y,
                plattform_data.bredde,
                plattform_data.hoyde
            );
            skjerm.legg_til_plattform(plattform);
        }
    }
}

Brett.prototype.vis_bakgrunn = function() {
    $("#spillvindu").css('background', 'url("'+this.bakgrunn+'")');
}