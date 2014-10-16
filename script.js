(function() {

    $(document).ready(function() {
        
        $("#startknapp").click(function() {
            $("#tapmeny").hide();
            $("#hovedmeny").hide();
            $("#brettmeny").show();
        });
        
        $(".brettknapp").click(function() {
            $("#tapmeny").hide();
            $("#brettmeny").hide();
            var b_id = $(this).attr("brett");
            Spill.last_brett(b_id);
        })
        
        $("#tapokknapp").click(function() {
            $("#tapmeny").hide();
            $("#brettmeny").hide();
            $("#hovedmeny").show();
        })
        
        setInterval(function() { Spill.tick() }, 1000/30);
    })

})();