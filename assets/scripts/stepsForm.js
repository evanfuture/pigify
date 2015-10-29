
(function(window) {
    'use strict';
    var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        support = {
            transitions: Modernizr.csstransitions
        };

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function StepsForm(el, options) {
        /*jshint validthis:true */
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }
    StepsForm.prototype.options = {
        onSubmit: function() {
            return false;
        }
    };
    StepsForm.prototype._init = function() {
        // current question
        this.current = 0;
        // questions
        this.questions = [].slice.call(this.el.querySelectorAll('ul > li'));
        // total questions
        this.questionsCount = this.questions.length;
        // show first question
        classie.addClass(this.questions[0], 'current');
        // next question control
        this.ctrlNext = this.el.querySelector('button.go');
        this.ctrlNext.setAttribute('aria-label', 'Go');
        // error message
        this.error = this.el.querySelector('span.error_message');
        // checks for HTML5 Form Validation support
        // a cleaner solution might be to add form validation to the custom Modernizr script
        this.supportsHTML5Forms = typeof document.createElement("input").checkValidity === 'function';
        // init events
        this._initEvents();
    };
    StepsForm.prototype._initEvents = function() {
        var self = this,
            // first input
            firstElInput = this.questions[this.current].querySelector('input'),
            // focus
            onFocusStartFn = function() {
                firstElInput.removeEventListener('focus', onFocusStartFn);
                classie.addClass(self.ctrlNext, 'show');
            };
        // show the next question control first time the input gets focused
        firstElInput.addEventListener('focus', onFocusStartFn);
        // show next question
        this.ctrlNext.addEventListener('click', function(ev) {
            ev.preventDefault();
            self._nextQuestion();
        });
        // pressing enter will jump to next question
        document.addEventListener('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            // enter
            if (keyCode === 13) {
                ev.preventDefault();
                self._nextQuestion();
            }
        });
    };
    StepsForm.prototype._nextQuestion = function() {
        if (!this._validate()) {
            return false;
        }
        // checks HTML5 validation
        if (this.supportsHTML5Forms) {
            var input = this.questions[this.current].querySelector('input');
            // clear any previous error messages
            input.setCustomValidity('');
            // checks input against the validation constraint
            if (!input.checkValidity()) {
                // Optionally, set a custom HTML5 valiation message
                // comment or remove this line to use the browser default message
                input.setCustomValidity('Whoops, that\'s not an email address!');
                // display the HTML5 error message
                this._showError(input.validationMessage);
                // prevent the question from changing
                return false;
            }
        }
        // check if form is filled
        if (this.current === this.questionsCount - 1) {
            this.isFilled = true;
        }
        // clear any previous error messages
        this._clearError();
        // after animation ends, remove class "show-next" from form element and change current question placeholder
        var self = this,
            onEndTransitionFn = function(ev) {
                if (self.isFilled) {
                    self._submit();
                }
            };
        onEndTransitionFn();
    };
    // submits the form
    StepsForm.prototype._submit = function() {
        this.options.onSubmit(this.el);
    };
    // the validation function
    StepsForm.prototype._validate = function() {
        // current question´s input
        var input = this.questions[this.current].querySelector('input').value;
        if (input === '') {
            this._showError('EMPTYSTR');
            return false;
        }
        return true;
    };
    // TODO (next version..)
    StepsForm.prototype._showError = function(err) {
        var message = '';
        switch (err) {
            case 'EMPTYSTR':
                message = 'Please fill in the field before continuing';
                break;
                // ...
            default:
                message = err;
        }
        this.error.innerHTML = message;
        classie.addClass(this.error, 'show');
    };
    // clears/hides the current error message
    StepsForm.prototype._clearError = function() {
        classie.removeClass(this.error, 'show');
    };
    // add to global namespace
    window.StepsForm = StepsForm;
})(window);