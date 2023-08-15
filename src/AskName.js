import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question";

const AskName = () => {
  return `
<section class="chat-confirm ask-name hide">
  <form class="chat-confirm__form" id="add-name__form">
    <div class="chat-confirm__input">
      <input required="true" type="text" placeholder="Vaše meno . . ." />
      <button class="chat-confirm__btn">Potvrdiť ${ChatConfirm()}</button>
    </div>
    <div class="relative">
      <span class="chat-confim__icon">${Question()}</span>
      <p class="chat-confim__popup">Pre pokračovanie napíšte, ako Vás má AI volať.</p>
    </div>
  </form>
</section>
`;
};

export default AskName;
