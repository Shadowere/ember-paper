import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('paper-group-radio', 'Integration | Component | paper radio group', {
  integration: true
});

function triggerKeydown(domElement, k) {
  let oEvent = document.createEvent('Events');
  oEvent.initEvent('keydown', true, true);
  Ember.$.extend(oEvent, {
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: k,
    charCode: k
  });
  Ember.run(() => {
    domElement.dispatchEvent(oEvent);
  });
}

test('should set and remove checked css class', function(assert) {
  assert.expect(2);

  this.set('groupValue', '1');
  this.render(hbs`
    {{#paper-radio-group groupValue=groupValue onchange=(action (mut groupValue)) as |group|}}
      {{#group.paper-radio value="1"}}
        Radio button 1
      {{/group.paper-radio}}
      {{#group.paper-radio value="2"}}
        Radio button 2
      {{/group.paper-radio}}
      {{#group.paper-radio value="3"}}
        Radio button 3
      {{/group.paper-radio}}
    {{/paper-radio-group}}
  `);
  assert.ok(this.$('md-radio-button').hasClass('md-checked'));

  this.set('groupValue', null);
  assert.ok(!this.$('md-radio-button').hasClass('md-checked'));
});

test('should trigger an action when checking', function(assert) {
  assert.expect(1);

  this.set('handleChange', (value) => {
    assert.equal(value, '1');
  });

  this.render(hbs`
    {{#paper-radio-group groupValue=groupValue onchange=handleChange as |group|}}
      {{#group.paper-radio value="1"}}
        Radio button 1
      {{/group.paper-radio}}
      {{#group.paper-radio value="2"}}
        Radio button 2
      {{/group.paper-radio}}
      {{#group.paper-radio value="3"}}
        Radio button 3
      {{/group.paper-radio}}
    {{/paper-radio-group}}
  `);

  this.$('md-radio-button').first().click();
});

test('should trigger an action when unchecking (toggle is true)', function(assert) {
  assert.expect(1);

  this.set('groupValue', '1');
  this.set('handleChange', (value) => {
    assert.equal(value, null);
  });

  this.render(hbs`
    {{#paper-radio-group groupValue=groupValue toggle=true onchange=handleChange as |group|}}
      {{#group.paper-radio value="1"}}
        Radio button 1
      {{/group.paper-radio}}
      {{#group.paper-radio value="2"}}
        Radio button 2
      {{/group.paper-radio}}
      {{#group.paper-radio value="3"}}
        Radio button 3
      {{/group.paper-radio}}
    {{/paper-radio-group}}
  `);

  this.$('md-radio-button').first().click();
});

test('shouldn\'t trigger an action when disabled', function(assert) {
  assert.expect(0);

  this.set('handleChange', (checked) => {
    assert.equal(checked, '1');
  });

  this.render(hbs`
    {{#paper-radio-group groupValue=groupValue disabled=true onchange=(action (mut groupValue)) as |group|}}
      {{#group.paper-radio value="1"}}
        Radio button 1
      {{/group.paper-radio}}
      {{#group.paper-radio value="2"}}
        Radio button 2
      {{/group.paper-radio}}
      {{#group.paper-radio value="3"}}
        Radio button 3
      {{/group.paper-radio}}
    {{/paper-radio-group}}
  `);

  this.$('md-radio-button').click();
});

test('should be possible to select next with down/right arrow in a paper-radio-group', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#paper-radio-group groupValue=groupValue onchange=(action (mut groupValue)) as |group|}}
      {{#group.paper-radio value="1"}}
        Radio button 1
      {{/group.paper-radio}}
      {{#group.paper-radio value="2"}}
        Radio button 2
      {{/group.paper-radio}}
      {{#group.paper-radio value="3"}}
        Radio button 3
      {{/group.paper-radio}}
    {{/paper-radio-group}}
  `);

  triggerKeydown(this.$('md-radio-group').get(0), 40);

  assert.equal(this.get('groupValue'), '1');

  triggerKeydown(this.$('md-radio-group').get(0), 39);

  assert.equal(this.get('groupValue'), '2');
});

test('should be possible to select next with up/left arrow in a paper-radio-group', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#paper-radio-group groupValue=groupValue onchange=(action (mut groupValue)) as |group|}}
      {{#group.paper-radio value="1"}}
        Radio button 1
      {{/group.paper-radio}}
      {{#group.paper-radio value="2"}}
        Radio button 2
      {{/group.paper-radio}}
      {{#group.paper-radio value="3"}}
        Radio button 3
      {{/group.paper-radio}}
    {{/paper-radio-group}}
  `);

  triggerKeydown(this.$('md-radio-group').get(0), 38);

  assert.equal(this.get('groupValue'), '1');

  triggerKeydown(this.$('md-radio-group').get(0), 37);

  assert.equal(this.get('groupValue'), '3');
});

test('the `onchange` function is mandatory for paper-radio-group', function(assert) {
  assert.expect(1);

  assert.throws(() => {
    this.render(hbs`
      {{#paper-radio-group groupValue=groupValue as |group|}}
        {{#group.paper-radio value="1"}}
          Radio button 1
        {{/group.paper-radio}}
      {{/paper-radio-group}}
    `);
  }, /requires an `onchange` function/);
});