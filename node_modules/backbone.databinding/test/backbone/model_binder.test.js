(function (factory) {
    'use strict';

    var isNode = typeof module === 'object' && typeof exports === 'object';

    ////////////////////

    var root = isNode ? require('../environment.js') : window;

    ////////////////////

    factory(root, isNode);

}(function (root) {
    'use strict';

    var _ = root._, Backbone = root.Backbone,

        chai = root.chai,
        sinon = root.sinon;

    ////////////////////

    var expect = chai.expect;

    ////////////////////

    describe('Backbone.ModelBinder', function () {

        ////////////////////

        var view, model, modelBinder;

        ////////////////////

        // before(function () {
        //
        // });

        // beforeEach(function () {
        //
        // });

        // afterEach(function () {
        //
        // });

        // after(function () {
        //
        // });

        ////////////////////

        describe('#constructor(view, model)', function () {
            it('should initialize the model binder', function () {

                ////////////////////

                var View = Backbone.View.extend({
                    initialize: function () {
                        modelBinder = Backbone.ModelBinder(this, model);
                    }
                });

                ////////////////////

                model = new Backbone.Model({
                    'html-content': null,
                    'text-content': null,

                    'text-field-value': null,
                    'textarea-value': null,
                    'single-select-value': null,
                    'multiple-select-value': null,

                    'radio-button-checked': null,
                    'single-checkbox-checked': null,
                    'checkbox-group-checked': null,

                    'button-visible': null,
                    'button-hidden': null,
                    'button-enabled': null,
                    'button-disabled': null
                });

                view = new View({
                    el: '#form-fixture'
                });

                expect(modelBinder).to.be.an.instanceOf(Backbone.ModelBinder);
            });
        });

        describe('#watch(binding, options)', function () {
            it('should start listening events of the view and the model', function () {
                modelBinder.watch({
                    'html: html-content': { selector: '[name="html-content"]' },
                    'text: text-content': { selector: '[name="text-content"]' },

                    'value: text-field-value': { selector: '[name="text-field-value"]' },
                    'value: textarea-value': { selector: '[name="textarea-value"]' },
                    'value: single-select-value': { selector: '[name="single-select-value"]' },
                    'value: multiple-select-value': { selector: '[name="multiple-select-value"]' },

                    'checked: radio-button-checked': { selector: '[name="radio-button-checked"]' },
                    'checked: single-checkbox-checked': { selector: '[name="single-checkbox-checked"]' },
                    'checked: checkbox-group-checked': { selector: '[name="checkbox-group-checked"]' },

                    'visible: button-visible': { selector: '[name="button-visible"]' },
                    'hidden: button-hidden': { selector: '[name="button-hidden"]' },
                    'enabled: button-enabled': { selector: '[name="button-enabled"]' },
                    'disabled: button-disabled': { selector: '[name="button-disabled"]' }
                });

                modelBinder.watch('id: id');
            });
        });

        describe('#view.render()', function () {

        });

        describe('#view.setElement(element, delegate)', function () {

        });

        describe('#model.set("html-content")', function () {
            it('should sync html-content element with model', function () {
                var attribute = 'html-content', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.html()).to.equal('string');

                model.set(attribute, '');
                expect($el.html()).to.equal('');

                model.set(attribute, 1);
                expect($el.html()).to.equal('1');

                model.set(attribute, 0);
                expect($el.html()).to.equal('0');

                model.set(attribute, true);
                expect($el.html()).to.equal('true');

                model.set(attribute, false);
                expect($el.html()).to.equal('false');

                model.set(attribute, null);
                expect($el.html()).to.equal('');

                model.set(attribute, undefined);
                expect($el.html()).to.equal('');

                model.unset(attribute);
                expect($el.html()).to.equal('');
            });
        });

        describe('#model.set("text-content")', function () {
            it('should sync text-content with model', function () {
                var attribute = 'text-content', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.text()).to.equal('string');

                model.set(attribute, '');
                expect($el.text()).to.equal('');

                model.set(attribute, 1);
                expect($el.text()).to.equal('1');

                model.set(attribute, 0);
                expect($el.text()).to.equal('0');

                model.set(attribute, true);
                expect($el.text()).to.equal('true');

                model.set(attribute, false);
                expect($el.text()).to.equal('false');

                model.set(attribute, null);
                expect($el.text()).to.equal('');

                model.set(attribute, undefined);
                expect($el.text()).to.equal('');

                model.unset(attribute);
                expect($el.text()).to.equal('');
            });
        });

        describe('#model.set("text-field-value")', function () {
            it('should sync text-field-value with model', function () {
                var attribute = 'text-field-value', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.val()).to.equal('string');

                model.set(attribute, '');
                expect($el.val()).to.equal('');

                model.set(attribute, 1);
                expect($el.val()).to.equal('1');

                model.set(attribute, 0);
                expect($el.val()).to.equal('0');

                model.set(attribute, true);
                expect($el.val()).to.equal('true');

                model.set(attribute, false);
                expect($el.val()).to.equal('false');

                model.set(attribute, null);
                expect($el.val()).to.equal('');

                model.set(attribute, undefined);
                expect($el.val()).to.equal('');

                model.unset(attribute);
                expect($el.val()).to.equal('');
            });
        });

        describe('#model.set("textarea-value")', function () {
            it('should sync textarea-value with model', function () {
                var attribute = 'textarea-value', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.val()).to.equal('string');

                model.set(attribute, '');
                expect($el.val()).to.equal('');

                model.set(attribute, 1);
                expect($el.val()).to.equal('1');

                model.set(attribute, 0);
                expect($el.val()).to.equal('0');

                model.set(attribute, true);
                expect($el.val()).to.equal('true');

                model.set(attribute, false);
                expect($el.val()).to.equal('false');

                model.set(attribute, null);
                expect($el.val()).to.equal('');

                model.set(attribute, undefined);
                expect($el.val()).to.equal('');

                model.unset(attribute);
                expect($el.val()).to.equal('');
            });
        });

        describe('#model.set("single-select-value")', function () {
            it('should sync single-select-value with model', function () {
                var attribute = 'single-select-value', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.val()).to.equal('string');

                model.set(attribute, '');
                expect($el.val()).to.equal('');

                model.set(attribute, 1);
                expect($el.val()).to.equal('1');

                model.set(attribute, 0);
                expect($el.val()).to.equal('0');

                model.set(attribute, true);
                expect($el.val()).to.equal('true');

                model.set(attribute, false);
                expect($el.val()).to.equal('false');

                model.set(attribute, null);
                expect($el.val()).to.equal('');

                model.set(attribute, undefined);
                expect($el.val()).to.equal('');

                model.unset(attribute);
                expect($el.val()).to.equal('');
            });
        });

        describe('#model.set("multiple-select-value")', function () {
            it('should sync multiple-select-value with model', function () {
                var attribute = 'multiple-select-value', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, ['string', 1, true]);
                expect($el.val()).to.deep.equal(['string', '1', 'true']);

                model.set(attribute, ['', 0, false]);
                expect($el.val()).to.deep.equal(['', '0', 'false']);

                model.set(attribute, [null]);
                expect($el.val()).to.deep.equal(null);

                model.set(attribute, [undefined]);
                expect($el.val()).to.deep.equal(null);

                model.set(attribute, []);
                expect($el.val()).to.deep.equal(null);

                model.set(attribute, null);
                expect($el.val()).to.deep.equal(null);

                model.set(attribute, undefined);
                expect($el.val()).to.deep.equal(null);

                model.unset(attribute);
                expect($el.val()).to.deep.equal(null);
            });
        });

        describe('#model.set("radio-button-checked")', function () {
            it('should sync radio-button-checked with model', function () {
                var attribute = 'radio-button-checked', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.filter(':checked').val()).to.equal('string');

                model.set(attribute, '');
                expect($el.filter(':checked').val()).to.equal('');

                model.set(attribute, 1);
                expect($el.filter(':checked').val()).to.equal('1');

                model.set(attribute, 0);
                expect($el.filter(':checked').val()).to.equal('0');

                model.set(attribute, true);
                expect($el.filter(':checked').val()).to.equal('true');

                model.set(attribute, false);
                expect($el.filter(':checked').val()).to.equal('false');

                model.set(attribute, null);
                expect($el.filter(':checked').val()).to.equal(undefined);

                model.set(attribute, undefined);
                expect($el.filter(':checked').val()).to.equal(undefined);

                model.unset(attribute);
                expect($el.filter(':checked').val()).to.equal(undefined);
            });
        });

        describe('#model.set("single-checkbox-checked")', function () {
            it('should sync single-checkbox-checked with model', function () {
                var attribute = 'single-checkbox-checked', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.is(':checked')).to.equal(true);

                model.set(attribute, '');
                expect($el.is(':checked')).to.equal(false);

                model.set(attribute, 1);
                expect($el.is(':checked')).to.equal(true);

                model.set(attribute, 0);
                expect($el.is(':checked')).to.equal(false);

                model.set(attribute, true);
                expect($el.is(':checked')).to.equal(true);

                model.set(attribute, false);
                expect($el.is(':checked')).to.equal(false);

                model.set(attribute, null);
                expect($el.is(':checked')).to.equal(false);

                model.set(attribute, undefined);
                expect($el.is(':checked')).to.equal(false);

                model.unset(attribute);
                expect($el.is(':checked')).to.equal(false);
            });
        });

        describe('#model.set("checkbox-group-checked")', function () {
            it('should sync checkbox-group-checked with model', function () {
                var attribute = 'checkbox-group-checked', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, ['string', 1, true]);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal(['string', '1', 'true']);

                model.set(attribute, ['', 0, false]);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal(['', '0', 'false']);

                model.set(attribute, [null]);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal([]);

                model.set(attribute, [undefined]);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal([]);

                model.set(attribute, []);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal([]);

                model.set(attribute, null);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal([]);

                model.set(attribute, undefined);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal([]);

                model.unset(attribute);
                expect(_.pluck($el.filter(':checked'), 'value')).to.deep.equal([]);
            });
        });

        describe('#model.set("button-visible")', function () {
            it('should sync button-visible with model', function () {
                var attribute = 'button-visible', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.prop('hidden')).to.equal(false);

                model.set(attribute, '');
                expect($el.prop('hidden')).to.equal(true);

                model.set(attribute, 1);
                expect($el.prop('hidden')).to.equal(false);

                model.set(attribute, 0);
                expect($el.prop('hidden')).to.equal(true);

                model.set(attribute, true);
                expect($el.prop('hidden')).to.equal(false);

                model.set(attribute, false);
                expect($el.prop('hidden')).to.equal(true);

                model.set(attribute, null);
                expect($el.prop('hidden')).to.equal(true);

                model.set(attribute, undefined);
                expect($el.prop('hidden')).to.equal(true);

                model.unset(attribute);
                expect($el.prop('hidden')).to.equal(true);
            });
        });

        describe('#model.set("button-hidden")', function () {
            it('should sync button-hidden with model', function () {
                var attribute = 'button-hidden', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.prop('hidden')).to.equal(true);

                model.set(attribute, '');
                expect($el.prop('hidden')).to.equal(false);

                model.set(attribute, 1);
                expect($el.prop('hidden')).to.equal(true);

                model.set(attribute, 0);
                expect($el.prop('hidden')).to.equal(false);

                model.set(attribute, true);
                expect($el.prop('hidden')).to.equal(true);

                model.set(attribute, false);
                expect($el.prop('hidden')).to.equal(false);

                model.set(attribute, null);
                expect($el.prop('hidden')).to.equal(false);

                model.set(attribute, undefined);
                expect($el.prop('hidden')).to.equal(false);

                model.unset(attribute);
                expect($el.prop('hidden')).to.equal(false);
            });
        });

        describe('#model.set("button-enabled")', function () {
            it('should sync button-enabled with model', function () {
                var attribute = 'button-enabled', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.prop('disabled')).to.equal(false);

                model.set(attribute, '');
                expect($el.prop('disabled')).to.equal(true);

                model.set(attribute, 1);
                expect($el.prop('disabled')).to.equal(false);

                model.set(attribute, 0);
                expect($el.prop('disabled')).to.equal(true);

                model.set(attribute, true);
                expect($el.prop('disabled')).to.equal(false);

                model.set(attribute, false);
                expect($el.prop('disabled')).to.equal(true);

                model.set(attribute, null);
                expect($el.prop('disabled')).to.equal(true);

                model.set(attribute, undefined);
                expect($el.prop('disabled')).to.equal(true);

                model.unset(attribute);
                expect($el.prop('disabled')).to.equal(true);
            });
        });

        describe('#model.set("button-disabled")', function () {
            it('should sync button-disabled with model', function () {
                var attribute = 'button-disabled', $el = view.$('[name="' + attribute + '"]');

                model.set(attribute, 'string');
                expect($el.prop('disabled')).to.equal(true);

                model.set(attribute, '');
                expect($el.prop('disabled')).to.equal(false);

                model.set(attribute, 1);
                expect($el.prop('disabled')).to.equal(true);

                model.set(attribute, 0);
                expect($el.prop('disabled')).to.equal(false);

                model.set(attribute, true);
                expect($el.prop('disabled')).to.equal(true);

                model.set(attribute, false);
                expect($el.prop('disabled')).to.equal(false);

                model.set(attribute, null);
                expect($el.prop('disabled')).to.equal(false);

                model.set(attribute, undefined);
                expect($el.prop('disabled')).to.equal(false);

                model.unset(attribute);
                expect($el.prop('disabled')).to.equal(false);
            });
        });

        describe('changing html-content', function () {
            it('should sync model with html-content', function () {
                var attribute = 'html-content', $el = view.$('[name="' + attribute + '"]');

                $el.html('string').trigger('change');
                expect(model.attributes[attribute]).to.equal('string');

                $el.html('').trigger('change');
                expect(model.attributes[attribute]).to.equal('');

                $el.html('1').trigger('change');
                expect(model.attributes[attribute]).to.equal('1');

                $el.html('0').trigger('change');
                expect(model.attributes[attribute]).to.equal('0');

                $el.html('true').trigger('change');
                expect(model.attributes[attribute]).to.equal('true');

                $el.html('false').trigger('change');
                expect(model.attributes[attribute]).to.equal('false');

                $el.empty().trigger('change');
                expect(model.attributes[attribute]).to.equal('');
            });
        });

        describe('changing text-content', function () {
            it('should sync model with text-content', function () {
                var attribute = 'text-content', $el = view.$('[name="' + attribute + '"]');

                $el.text('string').trigger('change');
                expect(model.attributes[attribute]).to.equal('string');

                $el.text('').trigger('change');
                expect(model.attributes[attribute]).to.equal('');

                $el.text('1').trigger('change');
                expect(model.attributes[attribute]).to.equal('1');

                $el.text('0').trigger('change');
                expect(model.attributes[attribute]).to.equal('0');

                $el.text('true').trigger('change');
                expect(model.attributes[attribute]).to.equal('true');

                $el.text('false').trigger('change');
                expect(model.attributes[attribute]).to.equal('false');

                $el.empty().trigger('change');
                expect(model.attributes[attribute]).to.equal('');
            });
        });

        describe('changing text-field-value', function () {
            it('should sync model with text-field-value', function () {
                var attribute = 'text-field-value', $el = view.$('[name="' + attribute + '"]');

                $el.val('string').trigger('change');
                expect(model.attributes[attribute]).to.equal('string');

                $el.val('').trigger('change');
                expect(model.attributes[attribute]).to.equal('');

                $el.val('1').trigger('change');
                expect(model.attributes[attribute]).to.equal('1');

                $el.val('0').trigger('change');
                expect(model.attributes[attribute]).to.equal('0');

                $el.val('true').trigger('change');
                expect(model.attributes[attribute]).to.equal('true');

                $el.val('false').trigger('change');
                expect(model.attributes[attribute]).to.equal('false');

                $el.val(null).trigger('change');
                expect(model.attributes[attribute]).to.equal('');
            });
        });

        describe('changing textarea-value', function () {
            it('should sync model with textarea-value', function () {
                var attribute = 'textarea-value', $el = view.$('[name="' + attribute + '"]');

                $el.val('string').trigger('change');
                expect(model.attributes[attribute]).to.equal('string');

                $el.val('').trigger('change');
                expect(model.attributes[attribute]).to.equal('');

                $el.val('1').trigger('change');
                expect(model.attributes[attribute]).to.equal('1');

                $el.val('0').trigger('change');
                expect(model.attributes[attribute]).to.equal('0');

                $el.val('true').trigger('change');
                expect(model.attributes[attribute]).to.equal('true');

                $el.val('false').trigger('change');
                expect(model.attributes[attribute]).to.equal('false');

                $el.val(null).trigger('change');
                expect(model.attributes[attribute]).to.equal('');
            });
        });

        describe('changing single-select-value', function () {
            it('should sync model with single-select-value', function () {
                var attribute = 'single-select-value', $el = view.$('[name="' + attribute + '"]');

                $el.val('string').trigger('change');
                expect(model.attributes[attribute]).to.equal('string');

                $el.val('').trigger('change');
                expect(model.attributes[attribute]).to.equal('');

                $el.val('1').trigger('change');
                expect(model.attributes[attribute]).to.equal('1');

                $el.val('0').trigger('change');
                expect(model.attributes[attribute]).to.equal('0');

                $el.val('true').trigger('change');
                expect(model.attributes[attribute]).to.equal('true');

                $el.val('false').trigger('change');
                expect(model.attributes[attribute]).to.equal('false');

                $el.val(null).trigger('change');
                expect(model.attributes[attribute]).to.equal('');
            });
        });

        describe('changing multiple-select-value', function () {
            it('should sync model with multiple-select-value', function () {
                var attribute = 'multiple-select-value', $el = view.$('[name="' + attribute + '"]');

                $el.val(['string', '1', 'true']).trigger('change');
                expect(model.attributes[attribute]).to.deep.equal(['string', '1', 'true']);

                $el.val(['', '0', 'false']).trigger('change');
                expect(model.attributes[attribute]).to.deep.equal(['', '0', 'false']);

                $el.val([]).trigger('change');
                expect(model.attributes[attribute]).to.deep.equal([]);
            });
        });

        describe('changing radio-button-checked', function () {
            it('should sync model with radio-button-checked', function () {
                var attribute = 'radio-button-checked', $el = view.$('[name="' + attribute + '"]');

                $el.val(['string']).trigger('change');
                expect(model.attributes[attribute]).to.equal('string');

                $el.val(['']).trigger('change');
                expect(model.attributes[attribute]).to.equal('');

                $el.val(['1']).trigger('change');
                expect(model.attributes[attribute]).to.equal('1');

                $el.val(['0']).trigger('change');
                expect(model.attributes[attribute]).to.equal('0');

                $el.val(['true']).trigger('change');
                expect(model.attributes[attribute]).to.equal('true');

                $el.val(['false']).trigger('change');
                expect(model.attributes[attribute]).to.equal('false');

                $el.val([]).trigger('change');
                expect(model.attributes[attribute]).to.equal(undefined);
            });
        });

        describe('changing single-checkbox-checked', function () {
            it('should sync model with single-checkbox-checked', function () {
                var attribute = 'single-checkbox-checked', $el = view.$('[name="' + attribute + '"]');

                $el.prop('checked', true).trigger('change');
                expect(model.attributes[attribute]).to.equal(true);

                $el.prop('checked', false).trigger('change');
                expect(model.attributes[attribute]).to.equal(false);
            });
        });

        describe('changing checkbox-group-checked', function () {
            it('should sync model with checkbox-group-checked', function () {
                var attribute = 'checkbox-group-checked', $el = view.$('[name="' + attribute + '"]');

                $el.val(['string', '1', 'true']).trigger('change');
                expect(model.attributes[attribute]).to.deep.equal(['string', '1', 'true']);

                $el.val(['', '0', 'false']).trigger('change');
                expect(model.attributes[attribute]).to.deep.equal(['', '0', 'false']);

                $el.val([]).trigger('change');
                expect(model.attributes[attribute]).to.deep.equal([]);
            });
        });

        describe('changing button-visible', function () {
            it('should sync model with button-visible', function () {
                var attribute = 'button-visible', $el = view.$('[name="' + attribute + '"]');

                $el.prop('hidden', false).trigger('change');
                expect(model.attributes[attribute]).to.equal(true);

                $el.prop('hidden', true).trigger('change');
                expect(model.attributes[attribute]).to.equal(false);
            });
        });

        describe('changing button-hidden', function () {
            it('should sync model with button-hidden', function () {
                var attribute = 'button-hidden', $el = view.$('[name="' + attribute + '"]');

                $el.prop('hidden', true).trigger('change');
                expect(model.attributes[attribute]).to.equal(true);

                $el.prop('hidden', false).trigger('change');
                expect(model.attributes[attribute]).to.equal(false);
            });
        });

        describe('changing button-enabled', function () {
            it('should sync model with button-enabled', function () {
                var attribute = 'button-enabled', $el = view.$('[name="' + attribute + '"]');

                $el.prop('disabled', false).trigger('change');
                expect(model.attributes[attribute]).to.equal(true);

                $el.prop('disabled', true).trigger('change');
                expect(model.attributes[attribute]).to.equal(false);
            });
        });

        describe('changing button-disabled', function () {
            it('should sync model with button-disabled', function () {
                var attribute = 'button-disabled', $el = view.$('[name="' + attribute + '"]');

                $el.prop('disabled', true).trigger('change');
                expect(model.attributes[attribute]).to.equal(true);

                $el.prop('disabled', false).trigger('change');
                expect(model.attributes[attribute]).to.equal(false);
            });
        });
    });
}));
