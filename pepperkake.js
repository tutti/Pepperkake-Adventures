(function() {

    $(document).ready(function() {
        Spill.last_brett(0);
        setInterval(function() { Spill.tick() }, 1000/30);
    })

})();