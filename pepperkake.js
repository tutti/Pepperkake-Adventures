(function() {
    
    

    $(document).ready(function() {
        Spill.last_brett(0);
        
        //Spiller.sett_posisjon(300, 200);
        
        setInterval(function() { Spiller.tick() }, 1000/30);
    })

})();