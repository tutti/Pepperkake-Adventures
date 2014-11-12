Spill = {
    gravitasjon: 2,
    brett: null,
    spiller: Enhet.ny("pepperkake", 0, 0)
}

Spill.spiller.sett_kontroll(Kontroll.hent("spiller"));

// Last inn data om brettene
var brett = {};
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
    if (this.brett.apnet) {
        this.brett.last();
        this.spillerhp(3);
        $("#spillerhp").show();
    } else {
        console.error("Du har ikke åpnet dette brettet!");
    }
}

Spill.brett_ferdig = function(utgang) {
    this.brett.last_ut();
    $("#spillerhp").hide();
    $("#brettferdigtekst").html(this.brett.tekst);
    $("#spillvindu").scrollLeft(0);
    var temp = utgang.split("/");
    if (brett[temp[0]]) {
        if (brett[temp[0]][temp[1]]) {
            if (!brett[temp[0]][temp[1]].apnet) {
                brett[temp[0]][temp[1]].apne();
            }
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
    if (this.brett && this.brett.lastet) {
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
    $("#spillerhp").hide();
}

Spill.prov_igjen = function() {
    this.brett.last();
    Spill.spillerhp(3);
    $("#spillerhp").show();
}

Spill.spillerhp = function(hp) {
    for (var i=1; i<=3; ++i) {
        if (hp >= i) {
            $("#spillerhp-"+i).attr("src", "bilder/hjerte1.png");
        } else {
            $("#spillerhp-"+i).attr("src", "bilder/hjerte0.png");
        }
    }
}

Spill.bosshp = function(prosent, farge) {
    if (!farge) {
        farge = "#0F0";
    }
    $("#bosshp-indre").css("width", Math.floor(prosent*6)).css("background-color", farge);
}