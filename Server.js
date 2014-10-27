var callback = {
    logginn: function(json_data) {
        var data = JSON.parse(json_data);
        if (data.status == 0) {
            location.reload();
        } else {
            $("#feilmelding").text(data.error[0]);
        }
    },
    
    loggut: function(json_data) {
        var data = JSON.parse(json_data);
        if (data.status == 0) {
            location.reload();
        } else {
            $("#feilmelding").text(data.error[0]);
        }
    },
    
    registrer: function(json_data) {
        var data = JSON.parse(json_data);
        if (data.status == 0) {
            //$.post("server/logginn.php", {'brukernavn': $("#brukernavn").val(), 'passord': $("#passord").val()}, logginn_callback);
            Server.logginn($("#brukernavn").val(), $("#passord").val());
        } else {
            $("#brukernavn, #passord").prop("disabled", false);
            $("#feilmelding").text(data.error[0]);
        }
    },
    
    brett_apnet: function(json_data) {
        console.log(json_data);
        var data = JSON.parse(json_data);
        if (data.ny_mappe) {
            location.reload();
        }
    },
}

var comQueue = [];
var communicating = false;
var current_callback = null;

var add_to_queue = function(method, url, data, callback) {
    var o = {
        method: method,
        url: url,
        data: data,
        callback: callback
    };
    comQueue.push(o);
}

var success = function(data, textstatus, jqXHR) {
    current_callback(data);
    communicating = false;
    // Success; remove the call we just completed and do the next
    comQueue.shift();
    next();
}

var error = function(jqXHR, textstatus, httptext) {
    console.error(httptext + ": " + textstatus);
    // Failure; try again
    communicating = false;
    next();
}

var next = function() {
    if (communicating) return;
    if (comQueue.length == 0) return;
    communicating = true;
    var o = comQueue[0];
    current_callback = o.callback;
    $.ajax(o.url, {
        type: o.method,
        data: o.data,
        success: success,
        error: error,
        cache: false,
    });
}

Server = {
    'logginn': function(brukernavn, passord) {
        add_to_queue("post", "server/logginn.php", {brukernavn: brukernavn, passord: passord}, callback.logginn);
        next();
    },
    
    'loggut': function() {
        add_to_queue("post", "server/loggut.php", null, callback.loggut);
        next();
    },
    
    'registrer': function(brukernavn, passord) {
        add_to_queue("post", "server/registrer.php", {brukernavn: brukernavn, passord: passord}, callback.registrer);
        next();
    },
    
    'apne_brett': function(mappenavn, filnavn) {
        add_to_queue("post", "server/apne_brett.php", {mappenavn: mappenavn, filnavn: filnavn}, callback.brett_apnet);
        next();
    },
}