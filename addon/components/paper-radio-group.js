/**
 * @module ember-paper
 */
import Ember from 'ember';
import BaseFocusable from './base-focusable';
import ParentMixin from 'ember-paper/mixins/parent-mixin';

const { computed, inject, assert } = Ember;

/**
 * @class PaperRadioGroup
 * @extends BaseFocusable
 * @uses ParentMixin
 */
export default BaseFocusable.extend(ParentMixin, {
  tagName: 'md-radio-group',
  tabindex: 0,

  /* BaseFocusable Overrides */
  focusOnlyOnKey: true,

  constants: inject.service(),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    assert('{{paper-radio-group}} requires an `onChange` action or null for no action', this.get('onChange') !== undefined);
  },

  enabledChildRadios: computed.filterBy('childComponents', 'disabled', false),
  childValues: computed.mapBy('enabledChildRadios', 'value'),

  keyDown(ev) {

    switch (ev.which) {
      case this.get('constants.KEYCODE.LEFT_ARROW'):
      case this.get('constants.KEYCODE.UP_ARROW'):
        ev.preventDefault();
        this.select(-1);
        break;
      case this.get('constants.KEYCODE.RIGHT_ARROW'):
      case this.get('constants.KEYCODE.DOWN_ARROW'):
        ev.preventDefault();
        this.select(1);
        break;
    }
  },

  select(increment) {
    let groupValue = this.get('groupValue');
    let index = 0;

    if (groupValue) {
      index = this.get('childValues').indexOf(groupValue);
      index += increment;
      let length = this.get('childValues.length');
      index = ((index % length) + length) % length;
    }

    let childRadio = this.get('enabledChildRadios').objectAt(index);
    childRadio.set('focused', true);
    this.sendAction('onChange', childRadio.get('value'));
  },

  actions: {
    onChange(value) {
      this.sendAction('onChange', value);
    }
  }
});
