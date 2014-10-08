(function() {

    $(document).ready(function() {
        Spill.last_brett(0);
        
        //Spiller.sett_posisjon(300, 200);
        
        setInterval(function() { Spill.tick() }, 1000/30);
    })

})();