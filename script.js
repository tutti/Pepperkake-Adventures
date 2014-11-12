(function() {
    
    var interv;
    var interv2;

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
        
        $("#tapprovigjenknapp").click(function() {
            $(".meny").hide();
            Spill.prov_igjen();
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
        
        function instr_hopp() {
            if (pos == btm1) {
                momentum = 15;
            }
            pos += momentum;
            momentum -= Spill.gravitasjon;
            $("#instr-n").css("bottom", pos);
        }
        
        interv = setInterval(function() { Spill.tick() }, 1000/30);
        
        var btm1 = $("#instr-n").css("bottom");
        btm1 = Number(btm1.substr(0, btm1.length - 2));
        var pos = btm1
        var momentum = 0;
        interv2 = setInterval(instr_hopp, 1000/30);
    })

})();