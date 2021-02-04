export default class Yoda {
    constructor(holder) {
      this._holder = holder;
      this._ref = this.init();
      //this.setUpEvents();
    }
    init = () => {
        this._holder.insertAdjacentHTML(
          "beforeend",
          `
          <div class="yoda">
            <img src="./images/yoda.png">
          </div>
          ` 
        );
        console.log('yodaaaaaa');
        return this._holder.querySelector('.yoda:last-child');
      }
}