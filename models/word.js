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

  translate(afterTranslate) {
    function DoAfterTranslate(response) {
      if (_.isFunction(afterTranslate)) {
        afterTranslate(response);
      }
    }
    axios.get(`/api/translation/${this.spelling}`)
      .then(({ data }) => DoAfterTranslate(data))
      .catch(({ response: { data } }) => DoAfterTranslate(data));
  }

  get canTranslate() {
    return _.isEmpty(this.meaning) && !_.isEmpty(this.spelling);
  }

  static languages = {
    spelling: 'en-US',
    meaning: 'zh-CN',
  };

  pronounce(field) {
    const speechSynthesis = global.speechSynthesis;
    const SpeechSynthesisUtterance = global.SpeechSynthesisUtterance;
    if (this[field] && speechSynthesis && SpeechSynthesisUtterance) {
      const utterance = new SpeechSynthesisUtterance(this[field]);
      utterance.lang = Word.languages[field];
      speechSynthesis.speak(utterance);
    }
  }
}
