export default class Word {
  constructor(spelling, meaning) {
    this.spelling = spelling;
    this.meaning = meaning;
  }

  set(field, value) {
    this[field] = value;
    return this;
  }
}
