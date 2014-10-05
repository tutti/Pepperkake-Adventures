(function() {
    
    // Last inn data om brettene
    brett = [];
    for (b_id in brettdata) {
        var data = JSON.parse(atob(brettdata[b_id]));
        brett[b_id] = new Brett(data);
    }
    
    

    $(document).ready(function() {
        plattform = new Plattform(20, 20, 100, 20, 30);
        plattform.aktiver();
        brett[0].last();
        
        Spiller.sett_posisjon(300, 200);
        
        setInterval(function() { Spiller.tick() }, 1000/30);
    })

})();