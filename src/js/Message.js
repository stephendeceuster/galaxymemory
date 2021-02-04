export default class Message {
    constructor(holder, msg) {
      this._holder = holder;
      this._msg = msg
      this._ref = this.init();
    }
    init = () => {
        this._holder.insertAdjacentHTML(
          "beforeend",
          `
          <div class="msg">
            <p>${this._msg}</p>
          </div>
          ` 
        );
        return this._holder.querySelector('.msg:last-child');
      }
}