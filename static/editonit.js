(function($) {

(EditOnit = function() {}).prototype = {
    init: function(config, elem) {
        var self = this;

        for (k in config) {
            this[k] = config[k];
        }
//         this.id = 'editonit-' + String(Math.random());
        this.id = 'editonit-' + EditOnit.session_number++;
        EditOnit.sessions[this.id] = this;

        if (!EditOnit.setup) {
            this.startKeyPress();
            this.startLongPoll();
            EditOnit.setup = true;
        }

        this.focused = false;
        $(elem).blur(function() {
            EditOnit.focused = null;
        })
        .focus(function() {
            EditOnit.focused = self;
        })
        .addClass(this.id);
    },

// Server communication
    postEvent: function(event) {
        event.client_id = EditOnit.client_id;
        event.editonit_id = this.id;
        event.user_id = this.user_id;
        event.user_email = this.user_email;
        event.type = 'event';
        $.ajax({
            url: '/editonit/post',
            data: event,
            type: 'post',
            dataType: 'json',
            success: function(r) { }
        });
    },

    startLongPoll: function() {
        $.ev.handlers.event = function(event) {
            var self = EditOnit.sessions[event.editonit_id];
            var handler = self['handle_' + event['event']];
            if (handler) {
                handler.call(self, event);
            }
        };
        $.ev.loop('/editonit/poll?client_id=' + EditOnit.client_id);
    },

    startKeyPress: function() {
        document.onkeypress = function (e) {
            var self = EditOnit.focused;
            if (!self) return true;
            var key;
            if (e == null) {
                // IE
                key = event.keyCode
            }
            else {
                // Mozilla
                if (e.altKey || e.ctrlKey || e.metaKey) {
                    return true
                }
                key = e.charCode || e.keyCode;
            }
            
            self.postEvent({
                event: 'keypress',
                key: key
            });
            return false;
        };
    },

    stopKeyPress: function() {
        document.onkeypress = function(e) { return true };
    },

    handle_keypress: function(event) {
        var key = event.key;
        var $elem = $('.' + this.id);
        var text = $elem.val();

        if (key == 8) {
            text = text.substr(0, text.length - 1)
        }
        // ignore arrow keys
        else if (! (key == 37 || key == 38 || key == 39 || key == 40)) {
            var char = String.fromCharCode(key);
            text += char;
        }

        $elem.val(text);
    },

    THE: 'END'
}

EditOnit.setup = false;
// EditOnit.client_id = String(Math.random());
EditOnit.client_id = String(parseInt(Math.random() * 1000));
EditOnit.sessions = {};
EditOnit.session_number = 0;

})(jQuery)


jQuery.fn.editonit_init = function(config) {
    this.each(function() {
        var e = Q = new EditOnit();
        e.init(config, this);
        this.editonit = e;
    });
    return this;
}
