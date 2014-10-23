(function($) {
    function getParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    var person = getParam("person");
    var bilder = [];
    var src = "";
    var type = "tekst";
    var tekst = "";
    var alt = ""
    
    $(document).ready(function() {
        function callback(data) {
            $("#personnavn").text($(data).find("NAVN")[0].textContent);
            $(data).find("BILDE").each(function() {
                var bilde = {
                    'src': $(this).attr('src'),
                    'alt': $(this).attr('alt'),
                    'overskrift': $(this).find("OVERSKRIFT")[0].textContent,
                    'tekst': $(this).find("TEKST")[0].textContent,
                    'teksttype': $($(this).find("TEKST")[0]).attr('type')
                };
                bilder.push(bilde);
                
                var ytre = $('<div class="slidebilde-wrapper">');
                var elmt = $('<img src="bilder/'+person+'/'+bilde.src+'" class="slidebilde" id="slide-'+(bilder.length-1)+'" alt="'+bilde.alt+'" data-slide="'+(bilder.length-1)+'" />');
                var overskrift = $('<span class="slide-overskrift">'+bilde.overskrift+'</span>');
                bilde.element = elmt;
                ytre.append(elmt);
                ytre.append(overskrift);
                $("#bildeslide-indre").append(ytre);
            });
            
            $("#bildeslide-indre").append('<div class="clearfloat">');
            
            src = bilder[0].src;
            alt = bilder[0].alt;
            overskrift = bilder[0].overskrift;
            type = bilder[0].teksttype;
            tekst = bilder[0].tekst;
            bilder[0].element.addClass("valgt");
            onTimeout();
        }
        
        $.get("xml/"+person+".xml", callback);
        
        function onTimeout() {
            $("#bilde").prop("src", "bilder/"+person+"/"+src).prop("alt", alt);
            $("#person-overskrift").text(overskrift);
            if (type == "html") {
                $("#infotekst").html(tekst)
            } else {
                $("#infotekst").text(tekst)
            }
        }
        
        $("#bildeslide").on("click", "img", function() {
            var bilde = $(this).attr("data-slide");
            $("#bildeslide img.valgt").removeClass("valgt");
            $(this).addClass("valgt");
            src = bilder[bilde].src;
            alt = bilder[bilde].alt;
            overskrift = bilder[bilde].overskrift;
            type = bilder[bilde].teksttype;
            tekst = bilder[bilde].tekst;
            $("#info").stop(true, true).fadeOut(750).fadeIn(750);
            setTimeout(onTimeout, 750);
        });
    });
})(jQuery)