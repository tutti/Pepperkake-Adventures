(function($) {
    function getParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    var person = getParam("person");
    var bilder = [];
    var type = "tekst";
    var src = "";
    var tekst = "";
    
    $(document).ready(function() {
        function callback(data) {
            $("#personnavn").text($(data).find("NAVN")[0].textContent);
            $(data).find("BILDE").each(function() {
                var bilde = {
                    'src': $(this).attr('src'),
                    'tekst': $(this).find("TEKST")[0].textContent,
                    'teksttype': $($(this).find("TEKST")[0]).attr('type')
                };
                bilder.push(bilde);
                
                var elmt = $('<img src="bilder/'+person+'/'+bilde.src+'" class="slidebilde" id="slide-'+(bilder.length-1)+'" slide="'+(bilder.length-1)+'" />');
                $("#bildeslide-indre").append(elmt);
            });
            
            $("#bildeslide-indre").append('<div class="clearfloat">');
            
            src = bilder[0].src;
            type = bilder[0].teksttype;
            tekst = bilder[0].tekst;
            onTimeout();
        }
        
        $.get("xml/"+person+".xml", callback);
        
        function onTimeout() {
            $("#bilde").prop("src", "bilder/"+person+"/"+src);
            if (type == "html") {
                $("#infotekst").html(tekst)
            } else {
                $("#infotekst").text(tekst)
            }
        }
        
        $("#bildeslide").on("click", "img", function() {
            var bilde = $(this).attr("slide");
            src = bilder[bilde].src;
            type = bilder[bilde].teksttype;
            tekst = bilder[bilde].tekst;
            $("#bilde, #infotekst").stop(true, true).fadeOut(750).fadeIn(750);
            setTimeout(onTimeout, 750);
        });
    });
})(jQuery)