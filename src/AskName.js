import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question";

const AskName = () => {
  return `
<section class="chat-confirm ask-name hide">
  <div class="chat-confirm__header">
    <span>${Question()}</span>
    <p>Pre pokračovanie napíšte, ako Vás má AI volať.</p>
  </div>
  <form class="chat-confirm__input" id="add-name__form">
    <input required="true" type="text" placeholder="Vaše meno . . ." />
    <button class="chat-confirm__btn">Potvrdiť ${ChatConfirm()}</button>
  </form>
</section>
`;
};

export default AskName;
