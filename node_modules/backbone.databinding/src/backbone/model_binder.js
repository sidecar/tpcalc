(function (factory) {
    'use strict';

    var isNode = typeof module === 'object' && typeof exports === 'object';

    ////////////////////

    var root = isNode ? {
        _: require('underscore'),
        Backbone: require('backbone')
    } : window;

    ////////////////////

    (isNode ? exports : Backbone).ModelBinder = factory(root, isNode);

}(function (root) {
    'use strict';

    var _ = root._, Backbone = root.Backbone;

    ////////////////////

    var modelBinder;

    ////////////////////

    var ModelBinder = Backbone.ModelBinder = function (view, model) {

        ////////////////////

        if (!(this instanceof ModelBinder)) {
            return new ModelBinder(view, model);
        }

        ////////////////////

        modelBinder = _.extend(this, {
            view: view,
            model: model
        }, {
            bindings: {}
        });

        ////////////////////

        _.extend(view, {
            render: _.wrap(view.render, function (fn) {
                fn.call(this);

                modelBinder.refresh();

                return this;
            }),

            setElement: _.wrap(view.setElement, function (fn, element, delegate) {
                if (this.$el) {
                    modelBinder.undelegateEvents();
                }

                fn.call(this, element, delegate);

                if (delegate !== false) {
                    modelBinder.delegateEvents();
                }

                return this;
            })
        });
    };

    _.extend(ModelBinder, {
        extend: Backbone.View.extend
    }, {
        handlers: {
            html: {
                getter: function () {
                    return this.html();
                },

                setter: function (value) {

                    ////////////////////

                    value = _.isNull(value) || _.isUndefined(value) ? '' : String(value);

                    ////////////////////

                    this.html(value);
                }
            },

            text: {
                getter: function () {
                    return this.text();
                },

                setter: function (value) {

                    ////////////////////

                    value = _.isNull(value) || _.isUndefined(value) ? '' : String(value);

                    ////////////////////

                    this.text(value);
                }
            },

            value: {
                getter: function () {
                    var value = this.val() || [];

                    return this.is('[multiple]') ? value : String(value);
                },

                setter: function (value) {

                    ////////////////////

                    if (_.isArray(value)) {
                        value = _.reject(value, function (value) {
                            return _.isNull(value) || _.isUndefined(value);
                        });
                    } else if (_.isNull(value) || _.isUndefined(value)) {
                        value = this.is('[multiple]') ? [] : '';
                    } else {
                        value = String(value);
                    }

                    ////////////////////

                    this.val(value);
                }
            },

            checked: {
                getter: function () {
                    var value, values = _.chain(this).where({
                        checked: true
                    }).pluck('value').value();

                    if (this.prop('type') === 'radio') {
                        value = values[0];
                    } else if (this.length === 1) {
                        value = this.prop('checked');
                    } else {
                        value = values;
                    }

                    return value;
                },

                setter: function (value) {
                    var values = _.chain([value]).flatten().reject(function (value) {
                        return _.isNull(value) || _.isUndefined(value);
                    }).value();

                    if (this.prop('type') === 'radio') {
                        this.val(values);
                    } else if (this.length === 1) {
                        this.prop('checked', value);
                    } else {
                        this.val(values);
                    }
                }
            },

            visible: {
                getter: function () {
                    return !this.prop('hidden');
                },

                setter: function (value) {
                    this.prop('hidden', !value);
                }
            },

            hidden: {
                getter: function () {
                    return this.prop('hidden');
                },

                setter: function (value) {
                    this.prop('hidden', !!value);
                }
            },

            enabled: {
                getter: function () {
                    return !this.prop('disabled');
                },

                setter: function (value) {
                    this.prop('disabled', !value);
                }
            },

            disabled: {
                getter: function () {
                    return this.prop('disabled');
                },

                setter: function (value) {
                    this.prop('disabled', !!value);
                }
            }
        }
    });

    _.extend(ModelBinder.prototype, {
        constructor: ModelBinder
    }, {
        watch: function (binding, options) {

            ////////////////////

            var bindings;

            if (!binding || _.isObject(binding)) {
                bindings = binding;
            } else {
                (bindings = {})[binding] = options;
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

                ////////////////////

                options = options || {};

                ////////////////////

                this.stopListening(binding)
                    .undelegateEvents(binding)
                    ._addBinding(binding, options)
                    .delegateEvents(binding)
                    .startListening(binding);
            }, this);

            this.refresh();

            return this;
        },

        refresh: function () {

            ////////////////////

            var setters = _.pluck(this.bindings, 'setter');

            ////////////////////

            _.each(setters, function (setter) {
                if (setter) setter();
            });

            return this;
        },

        delegateEvents: function (binding) {

            ////////////////////

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

                ////////////////////

                var events = this._resolveEvents.call({
                        view: this.view,
                        options: options
                    }, binding),

                    selector = options.selector, getter = options.getter;

                ////////////////////

                this.undelegateEvents(binding);

                if (getter) {
                    this.view.$el.on(events, selector, getter);
                }
            }, this);

            return this;
        },

        undelegateEvents: function (binding) {

            ////////////////////

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

                ////////////////////

                var events = this._resolveEvents.call({
                        view: this.view,
                        options: options
                    }, binding),

                    selector = options.selector, getter = options.getter;

                ////////////////////

                if (getter) {
                    this.view.$el.off(events, selector, getter);
                }
            }, this);

            return this;
        },

        startListening: function (binding) {

            ////////////////////

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

                ////////////////////

                var setter = options.setter;

                ////////////////////

                this.stopListening(binding);

                if (setter) {
                    this.view.listenTo(this.model, 'change', setter);
                }
            }, this);

            return this;
        },

        stopListening: function (binding) {

            ////////////////////

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options) {

                ////////////////////

                var setter = options.setter;

                ////////////////////

                if (setter) {
                    this.view.stopListening(this.model, 'change', setter);
                }
            }, this);

            return this;
        },

        _addBinding: function (binding, options) {

            ////////////////////

            var match = binding.match(/^\s*([-\w]+)\s*:\s*([-\w]+)\s*$/),

                type = match[1],
                attribute = match[2];

            ////////////////////

            var constructor = this.constructor;

            ////////////////////

            var handlers = constructor.handlers[type],

                getter = handlers && handlers.getter,
                setter = handlers && handlers.setter;

            ////////////////////

            this.bindings[binding] = _.defaults(options, {
                getter: _.wrap(getter, function (fn) {
                    var $el = this._resolveElement.call({
                            view: this.view,
                            selector: options.selector
                        }),

                        value = fn ? fn.call($el) : $el.attr(type);

                    return this.model.set(attribute, value, options);
                }),

                setter: _.wrap(setter, function (fn) {
                    var $el = this._resolveElement.call({
                            view: this.view,
                            selector: options.selector
                        }),

                        value = this.model.get(attribute);

                    return fn ? fn.call($el, value) : $el.attr(type, value);
                })
            });

            this._bindHandlers(options);

            return this;
        },

        _bindHandlers: function (options) {

            ////////////////////

            var getter = options.getter, setter = options.setter;

            ////////////////////

            if (getter) options.getter = _.bind(getter, this);
            if (setter) options.setter = _.bind(setter, this);

            return this;
        },

        _resolveElement: function () {
            var view = this.view, selector = this.selector;

            if (_.isFunction(selector)) {
                selector = selector.call(view);
            }

            return selector ? view.$(selector) : view.$el;
        },

        _resolveEvents: function (binding) {

            ////////////////////

            var event = this.options.event || 'change';

            ////////////////////

            var events = event.match(/\S+/g);

            events = _.map(events, function (event) {
                return event + '.' + binding + '.modelBinder.' + this.view.cid;
            }, this);

            return events.join(' ');
        }
    });

    return ModelBinder;
}));
