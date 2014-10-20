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
        
        setInterval(function() { Spill.tick() }, 1000/30);
    })

})();