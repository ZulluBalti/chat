import Question from "./icons/Question";
import ChatConfirm from "./icons/ChatConfirm";

const AskAdditional = (props) => {
  return `
      <section class="chat-confirm ask-additional relative hide">
        <div class="ask-additional-btns">
          <button class="buy-btn" id="gchat-buy">${props.buyBtnTxt}</button>
          <button class="sell-btn" id="gchat-sell">${props.sellBtnTxt}</button>
        </div>

        <form id="seller_form" class="chat-confirm__form hide">
          <div class="chat-confirm__info">
            <span class="chat-confirm__icon">${Question()}</span>
            <p class="chat-confirm__popup">${props.infoPopup}</p>
          </div>
          <input class="" type="text" id="gchat-what" placeholder="${props.whatPlc}" required />
          <input class="full-column" type="text" id="gchat-where" placeholder="${props.wherePlc}" required />
          <input class="full-column" type="number" id="gchat-capital" placeholder="${props.capitalPlc}" required />
          <div class="full-column gchat-agree">
            <input type="checkbox" id="gchat-agree" required />
            <label for="gchat-agree">${props.infoAgreeTxt}"</label>
          </div>
          <button class="chat-confirm__btn span-2-col">
            <span id="additional-submit-txt">${props.infoSubmitBtn}</span> ${ChatConfirm()}</button>
          <small class="chat-confirm__error"></small>
        </form>
      </section>
`;
};

export default AskAdditional;
