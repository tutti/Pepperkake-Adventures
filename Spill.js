Spill = {
    gravitasjon: 2,
    brett: null,
    spiller: Enhet.ny("pepperkake", 0, 0)
}

Spill.spiller.sett_kontroll(Kontroll.hent("spiller"));

// Last inn data om brettene
brett = {};
$(document).ready(function() {
    var i = 0;
    for (mappenavn in brettdata) {
        var mappe = brettdata[mappenavn];
        brett[mappenavn] = [];
        for (brettjson in mappe) {
            var apnet = mappe[brettjson][0];
            var data = JSON.parse(brettjson);
            $("#brettknapp-"+i).attr("data-mappe", mappenavn).attr("data-brett", mappe[brettjson][1]).find("span").text(data.navn);
            brett[mappenavn][mappe[brettjson][1]] = new Brett(data, mappenavn, mappe[brettjson][1], apnet);
            ++i;
        }
    }
})

Spill.last_brett = function(mappenavn, brettnavn) {
    this.brett = brett[mappenavn][brettnavn];
    this.brett.last();
}

Spill.brett_ferdig = function(utgang) {
    this.brett.last_ut();
    $("#spillvindu").scrollLeft(0);
    var temp = utgang.split("/");
    if (brett[temp[0]]) {
        if (!brett[temp[0]][temp[1]].apnet) {
            brett[temp[0]][temp[1]].apne();
        }
        $(".meny").hide();
        $("#brettferdigmeny").show();
    } else {
        Server.apne_brett(temp[0], temp[1]);
        $(".meny").hide();
        $("#lastermeny").show();
    }
}

Spill.tick = function() {
    if (this.brett) {
        this.spiller.tick();
        if (this.brett) {
            this.brett.tick();
        }
        this.spiller.fokus();
    }
}

Spill.spiller_dod = function() {
    this.brett.last_ut();
    $("#spillvindu").scrollLeft(0);
    $("#tapmeny").show();
}