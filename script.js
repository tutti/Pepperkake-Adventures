(function() {

    $(document).ready(function() {
        
        $("#startknapp").click(function() {
            $(".meny").hide();
            $("#brettmeny").show();
        });
        
        $(".brettknapp").click(function() {
            $(".meny").hide();
            var b_id = $(this).attr("brett");
            Spill.last_brett(b_id);
        })
        
        $("#tapokknapp").click(function() {
            $(".meny").hide();
            $("#hovedmeny").show();
        })
        
        function logginn_callback(json_data) {
            var data = JSON.parse(json_data);
            if (data.status == 0) {
                location.reload();
            } else {
                $("#feilmelding").text(data.error[0]);
            }
        }
        
        $("#logginnknapp").click(function() {
            $.post("server/logginn.php", {'brukernavn': $("#brukernavn").val(), 'passord': $("#passord").val()}, logginn_callback);
        });
        
        function registrer_callback(json_data) {
            var data = JSON.parse(json_data);
            if (data.status == 0) {
                $.post("server/logginn.php", {'brukernavn': $("#brukernavn").val(), 'passord': $("#passord").val()}, logginn_callback);
            } else {
                $("#brukernavn, #passord").prop("disabled", false);
                $("#feilmelding").text(data.error[0]);
            }
        }
        
        $("#registrerknapp").click(function() {
            $("#brukernavn, #passord").prop("disabled", true);
            $.post("server/registrer.php", {'brukernavn': $("#brukernavn").val(), 'passord': $("#passord").val()}, registrer_callback);
        })
        
        function loggut_callback(json_data) {
            var data = JSON.parse(json_data);
            if (data.status == 0) {
                location.reload();
            } else {
                $("#feilmelding").text(data.error[0]);
            }
        }
        
        $("#loggutknapp").click(function() {
            $.post("server/loggut.php", {'brukernavn': $("#brukernavn").val(), 'passord': $("#passord").val()}, loggut_callback);
        })
        
        setInterval(function() { Spill.tick() }, 1000/30);
    })

})();