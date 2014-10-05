HeisPlattform = function(x, y, bredde, hoyde) {
    Plattform.call(this, x, y, bredde, hoyde);
    
    this.type = "heis";
}

HeisPlattform.prototype = Object.create(Plattform.prototype);
HeisPlattform.prototype.constructor = HeisPlattform