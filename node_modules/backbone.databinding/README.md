[npm-badge]: https://badge.fury.io/js/backbone.databinding.png
[npm-link]: https://badge.fury.io/js/backbone.databinding

[travis-badge]: https://secure.travis-ci.org/DreamTheater/Backbone.DataBinding.png
[travis-link]: https://travis-ci.org/DreamTheater/Backbone.DataBinding

[gemnasium-badge]: https://gemnasium.com/DreamTheater/Backbone.DataBinding.png
[gemnasium-link]: https://gemnasium.com/DreamTheater/Backbone.DataBinding

# Backbone.DataBinding

[![NPM Version][npm-badge]][npm-link]
[![Build Status][travis-badge]][travis-link]
[![Dependency Status][gemnasium-badge]][gemnasium-link]

The plugin implements a two-way data binding between views and models/collections.

**Dependencies:**

  - [Backbone](https://github.com/documentcloud/backbone) `>= 1.1.0`
  - [Underscore](https://github.com/documentcloud/underscore) `>= 1.5.2`
  - [jQuery](https://github.com/jquery/jquery) `>= 2.0.3`

## Getting Started
### Create view and model
Define the view and the model. They should be an instances of `Backbone.View`/`Backbone.Model` or their inheritors.
```js
var view = new Backbone.View(), model = new Backbone.Model();
```

### Create model binder
`Backbone.ModelBinder` is a decorator. Just pass the view and the model into constructor of class to getting started.
```js
var modelBinder = new Backbone.ModelBinder(view, model);
```

### Define bindings
Use `modelBinder.watch(binding, options)` method to define bindings between view and model. If you want to define a lot of bindings in one action use `modelBinder.watch(bindings)` option.

#### Binding types
##### Type `html`
```html
<output name="html-content"></output>
```
```js
modelBinder.watch('html: html-content', {
    selector: '[name="html-content"]'
});

model.set('html-content', 'HTML');
```
```html
<output name="html-content">HTML</output>
```

##### Type `text`
```html
<output name="text-content"></output>
```
```js
modelBinder.watch('text: text-content', {
    selector: '[name="text-content"]'
});

model.set('text-content', 'Text');
```
```html
<output name="text-content">Text</output>
```

##### Type `value`
###### Text input
```html
<input type="text" name="text-field-value">
```
```js
modelBinder.watch('value: text-field-value', {
    selector: '[name="text-field-value"]'
});

model.set('text-field-value', 'Value');
```
```html
<input type="text" name="text-field-value" value="Value">
```

###### Text area
```html
<textarea name="textarea-value"></textarea>
```
```js
modelBinder.watch('value: textarea-value', {
    selector: '[name="textarea-value"]'
});

model.set('textarea-value', 'Text');
```
```html
<textarea name="textarea-value">Text</textarea>
```

###### Single select
```html
<select name="single-select-value">
    <option value="A">Option A</option>
    <option value="B">Option B</option>
    <option value="C">Option C</option>
</select>
```
```js
modelBinder.watch('value: single-select-value', {
    selector: '[name="single-select-value"]'
});

model.set('single-select-value', 'A');
```
```html
<select name="single-select-value">
    <option value="A" selected>Option A</option>
    <option value="B">Option B</option>
    <option value="C">Option C</option>
</select>
```

###### Multiple select
```html
<select name="multiple-select-value" multiple>
    <option value="A">Option A</option>
    <option value="B">Option B</option>
    <option value="C">Option C</option>
</select>
```
```js
modelBinder.watch('value: multiple-select-value', {
    selector: '[name="multiple-select-value"]'
});

model.set('multiple-select-value', ['A', 'B', 'C']);
```
```html
<select name="multiple-select-value" multiple>
    <option value="A" selected>Option A</option>
    <option value="B" selected>Option B</option>
    <option value="C" selected>Option C</option>
</select>
```

##### Type `checked`
###### Single checkbox
```html
<input type="checkbox" name="single-checkbox-checked">
```
```js
modelBinder.watch('checked: single-checkbox-checked', {
    selector: '[name="single-checkbox-checked"]'
});

model.set('single-checkbox-checked', true);
```
```html
<input type="checkbox" name="single-checkbox-checked" checked>
```

###### Multiple checkboxes
```html
<input type="checkbox" name="checkbox-group-checked" value="A">
<input type="checkbox" name="checkbox-group-checked" value="B">
<input type="checkbox" name="checkbox-group-checked" value="C">
```
```js
modelBinder.watch('checked: checkbox-group-checked', {
    selector: '[name="checkbox-group-checked"]'
});

model.set('checkbox-group-checked', ['A', 'B', 'C']);
```
```html
<input type="checkbox" name="checkbox-group-checked" value="A" checked>
<input type="checkbox" name="checkbox-group-checked" value="B" checked>
<input type="checkbox" name="checkbox-group-checked" value="C" checked>
```

###### Radio buttons
```html
<input type="radio" name="radio-button-checked" value="A">
<input type="radio" name="radio-button-checked" value="B">
<input type="radio" name="radio-button-checked" value="C">
```
```js
modelBinder.watch('checked: radio-button-checked', {
    selector: '[name="radio-button-checked"]'
});

model.set('radio-button-checked', 'A');
```
```html
<input type="radio" name="radio-button-checked" value="A" checked>
<input type="radio" name="radio-button-checked" value="B">
<input type="radio" name="radio-button-checked" value="C">
```

##### Type `visible`
```html
<button type="button" name="button-visible" hidden>Visible</button>
```
```js
modelBinder.watch('visible: button-visible', {
    selector: '[name="button-visible"]'
});

model.set('button-visible', true);
```
```html
<button type="button" name="button-visible">Visible</button>
```

##### Type `hidden`
```html
<button type="button" name="button-hidden">Hidden</button>
```
```js
modelBinder.watch('hidden: button-hidden', {
    selector: '[name="button-hidden"]'
});

model.set('button-hidden', true);
```
```html
<button type="button" name="button-hidden" hidden>Hidden</button>
```

##### Type `enabled`
```html
<button type="button" name="button-enabled" disabled>Enabled</button>
```
```js
modelBinder.watch('enabled: button-enabled', {
    selector: '[name="button-enabled"]'
});

model.set('button-enabled', true);
```
```html
<button type="button" name="button-enabled">Enabled</button>
```

##### Type `disabled`
```html
<button type="button" name="button-disabled">Disabled</button>
```
```js
modelBinder.watch('disabled: button-disabled', {
    selector: '[name="button-disabled"]'
});

model.set('button-disabled', true);
```
```html
<button type="button" name="button-disabled" disabled>Disabled</button>
```

#### Option `selector`
Specify selector to find element in the view's DOM tree. Leave selector empty to bind attribute to the root element of the view.
```js
modelBinder.watch('...', {
    selector: 'div.foo' // Any jQuery selector
});
```

#### Option `event`
Specify events that you want to listen (by default equal to `'change'`).
```js
modelBinder.watch('...', {
    event: 'change input keyup' // Space separated event list
});
```

#### Options `getter` and `setter`
If you want to define one-way binding you can disable `getter` (view-to-model binding) or `setter` (model-to-view binding).
```js
modelBinder.watch('...', {
    getter: false // In this case the model will not synchronizes with the element
});
```
```js
modelBinder.watch('...', {
    setter: false // In this case the element will not synchronizes with the model
});
```

### Create view and collection
Define the view and the collection. They should be an instances of `Backbone.View`/`Backbone.Collection` or their inheritors.
```js
var view = new Backbone.View(), collection = new Backbone.Collection();
```

### Create collection binder
`Backbone.CollectionBinder` is a decorator. Just pass the view and the collection into constructor of class to getting started. Don't forget about options.
```js
var collectionBinder = new Backbone.CollectionBinder(view, collection, {
    view: Backbone.View.extend({ ... }),
    dummy: Backbone.View.extend({ ... }),

    selector: '...'
});
```

#### Option `view`
It should be an instance of `Backbone.View` or its inheritor. It will represent each model in collection.

#### Option `dummy`
It should be an instance of `Backbone.View` or its inheritor. It will used in case if collection is empty and no items to be shown.

#### Option `selector`
If specified, views will be inserted into element corresponding this selector. If not, views will be inserted just to the root element of the view.

### Start listening
By default `Backbone.CollectionBinder` listens four collection events: `add`, `remove`, `reset` and `sort`.
```js
collectionBinder.listen();
```

If you don't want to listen some events you should use an additional options.
```js
collectionBinder.listen({
    sort: false // In this case DOM will not react on collection's sorting
});
```

## Changelog
### 0.4.5
  - `Backbone.ModelBinder` and `Backbone.CollectionBinder` could be extended

### 0.4.4
  - Added CommonJS support

### 0.4.3
  - Fixed a lot of issues

### 0.4.2
  - Renaming method `define` to `watch`
  - Update API to getting views

### 0.4.0
  - `Backbone.ModelBinder` and `Backbone.CollectionBinder` configures with any model/collection

### 0.3.9
  - Fixed `checked` binding
  - Using `attr()` instead of `prop()` for standard bindings

### 0.3.7
  - Renaming `types` to `handlers`
  - Method `refresh` moved from view to binders
  - Removed backward reference to binders

### 0.3.4
  - Fixed `visible`, `hidden`, `enabled`, `disabled` bindings

### 0.3.3
  - Plugin implemented as decorator, not a class
  - Readers and writers merged into types
  - Added new binding types `hidden`, `enabled`, `disabled`
  - A lot of fixes

### 0.2.9
  - Readers and writers runs in context `this`
  - Added binding type `visible`

### 0.2.7
  - Method `reset` renamed to `syncToCollection`
  - Changed signature of method `binding`

### 0.2.5
  - Added public method `reset` for refreshing a list manually

### 0.2.4
  - Added views allocation inside the root element

### 0.2.3
  - Methods `sort` and `reset` are private

### 0.2.2
  - `ViewCollection` is sortable
  - Method `reset` is public
  - Removed binding type `data`

### 0.1.9
  - Items removes via collection's listener and not model's
  - Added binding type `data`

### 0.1.7
  - Properties `readers` and `writers` are static

### 0.1.6
  - Removed CommonJS support
  - Databinding moved to `Backbone.ViewModel` class
  - Added `Backbone.ViewCollection` class

### 0.1.3
  - Added CommonJS support

### 0.1.2
  - Methods `delegateBindings` and `undelegateBindings` are public

### 0.1.1
  - Method `addBinding` renamed to `binding`

### 0.1.0
  - Initial release
