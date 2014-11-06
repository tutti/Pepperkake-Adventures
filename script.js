(function() {

    $(document).ready(function() {
        
        $("#startknapp").click(function() {
            $(".meny").hide();
            $("#brettmeny").show();
        });
        
        $(".brettknapp").click(function() {
            if ($(this).hasClass("disabled")) return;
            $(".meny").hide();
            //var b_id = $(this).attr("brett");
            var mappenavn = $(this).attr("data-mappe");
            var brettnavn = $(this).attr("data-brett");
            Spill.last_brett(mappenavn, brettnavn);
        })
        
        $("#tapokknapp").click(function() {
            $(".meny").hide();
            $("#hovedmeny").show();
        })
        
        $("#brettferdigokknapp").click(function() {
            $(".meny").hide();
            $("#brettmeny").show();
        });
        
        $("#logginnknapp").click(function() {
            Server.logginn($("#brukernavn").val(), $("#passord").val());
        });
        
        $("#loggutknapp").click(function() {
            Server.loggut();
        })
        
        $("#endrepassordknapp").click(function() {
            $(".meny").hide();
            $("#passordmeny").show();
        })
        
        $("#send_endrepassordknapp").click(function() {
            Server.endre_passord($("#gammeltpassord").val(), $("#nyttpassord1").val(), $("#nyttpassord2").val());
        })
        
        $("#registrerknapp").click(function() {
            if ($("#brukernavn").val() != "" && $("#passord").val() != "") {
                $("#brukernavn, #passord").prop("disabled", true);
                Server.registrer($("#brukernavn").val(), $("#passord").val());
            } else {
                $("#feilmelding").text("Du må skrive inn brukernavn og passord.");
            }
        })
        
        interv = setInterval(function() { Spill.tick() }, 1000/30);
    })

})();