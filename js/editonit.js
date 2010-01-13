(function($) {

(EditOnit = function() {}).prototype = {
    init: function(config) {
        for (k in config) {
            this[k] = config[k];
        }
        // make the textarea editonitable
        // that's the tricky part, eh?
    },

    THE: 'END'
}

})(jQuery)


jQuery.fn.editonit_init = function(config) {
    this.each(function() {
        var e = new EditOnit();
        e.init(config);
        this.editonit = e;
        console.log(e);
    });
    return this;
}
