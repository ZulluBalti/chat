import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question"

const AskName = () => {
  return `
<section class="chat-confirm ask-name hide">
  <div class="chat-confirm__header">
    <span>${Question()}</span>
    <p>To continue, write down what you want the AI to call you.</p>
  </div>
  <form class="chat-confirm__input" id="add-name__form">
    <input required="true" type="text" placeholder="Your name..." />
    <button class="chat-confirm__btn">Confirm ${ChatConfirm()}</button>
  </form>
</section>
`
}

export default AskName;
