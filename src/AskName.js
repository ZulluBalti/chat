import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question";

const AskName = () => {
  return `
<section class="chat-confirm ask-name hide">
  <form class="chat-confirm__form relative" id="add-name__form">
    <div class="chat-confirm__info">
      <span class="chat-confim__icon">${Question()}</span>
      <p class="chat-confim__popup">Pre pokračovanie napíšte, ako Vás má AI volať.</p>
    </div>
    <input required="true" type="text" placeholder="Vaše meno . . ." />
    <button class="chat-confirm__btn span-2-col">Potvrdiť ${ChatConfirm()}</button>
  </form>
</section>
`;
};

export default AskName;
