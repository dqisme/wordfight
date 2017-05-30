import * as _ from 'lodash';
import axios from 'axios';

export default class Word {
  constructor(spelling, meaning) {
    this.spelling = spelling;
    this.meaning = meaning;
  }

  set(field, value) {
    this[field] = value;
    return this;
  }

  translate(afterTranslateDo) {
    axios.get(`/api/translation/${this.spelling}`)
      .then(({ data: { translation } }) => {
        if (translation && _.isFunction(afterTranslateDo)) {
          afterTranslateDo(translation);
        }
      });
  }

  get canTranslate() {
    return _.isEmpty(this.meaning) && !_.isEmpty(this.spelling);
  }
}
