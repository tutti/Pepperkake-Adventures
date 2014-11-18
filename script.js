(function() {
    
    var interv;
    var interv2;

    $(document).ready(function() {
        
        $("#startknapp").click(function() {
            $(".meny").hide();
            $("#brettmeny").show();
            $("#spillvindu").css("overflow-y", "scroll");
        });
        
        $(".brettknapp").click(function() {
            if ($(this).hasClass("disabled")) return;
            $(".meny").hide();
            $("#spillvindu").css("overflow-y", "hidden");
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
            if (pos1 == btm) {
                momentum1 = 15;
                pos2 = 0;
                momentum2 = 0;
                //$("#instr-nn").css("bottom", 0)
            }
            pos1 += momentum1;
            pos2 += momentum2;
            momentum1 -= Spill.gravitasjon;
            momentum2 -= Spill.gravitasjon;
            $("#instr-no").css("bottom", pos1);
            $("#instr-nn").css("bottom", pos2);
        }
        
        interv = setInterval(function() { Spill.tick() }, 1000/30);
        
        var btm = $("#instr-no").css("bottom");
        btm = Number(btm.substr(0, btm.length - 2));
        var pos1 = btm;
        var momentum1 = 0;
        var top = $("#instr-nn").css("bottom");
        top = Number(top.substr(0, top.length - 2));
        var pos2 = top;
        var momentum2 = 0;
        interv2 = setInterval(instr_hopp, 1000/30);
    })

})();