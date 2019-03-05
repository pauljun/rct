import { observable, action } from 'mobx';

const actionList = Service.url.getActionNames();

class ActionPanel {
  actionList = actionList;

  @observable actions = [];

  @action setAction(name) {
    if (!this.actionList.indexOf(name) === -1) {
      return;
    }
    let index = this.actions.indexOf(name);
    if (index === -1) {
      this.actions.push(name);
    }
  }
  @action setActions(names) {
    names = names.filter(v => this.actionList.indexOf(v) > -1);
    let actions = [].concat(this.actions, names);
    this.actions = [...new Set(...actions)];
  }

  @action removeAction(name) {
    if (!this.actionList.indexOf(name) === -1) {
      return;
    }
    let index = this.actions.indexOf(name);
    let actions = this.actions;
    if (index > -1) {
      actions.splice(index, 1);
      this.actions = actions;
    }
  }
  @action removeActions(names) {
    names = names.filter(v => this.actionList.indexOf(v) > -1);
    let actions = this.actions.filter(v => names.indexOf(v) === -1);
    this.actions = actions;
  }

  computedAction(names, condition) {
    const actions = this.actions;
    let flag = false;
    if (condition === 'and') {
      let temp = actions.filter(v => names.indexOf(v) > -1);
      if (temp.length === names.length) {
        flag = true;
      }
    }
    if (condition === 'or') {
      let temp = actions.filter(v => names.indexOf(v) > -1);
      if (temp.length > 0) {
        flag = true;
      }
    }
    return flag;
  }

  @action
  clearStore() {
    this.actions = [];
  }
}

export default new ActionPanel();
