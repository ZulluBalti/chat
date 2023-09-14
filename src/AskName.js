import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question";

const AskName = (props) => {
  return `
<section class="chat-confirm ask-name hide">
  <form class="chat-confirm__form relative" id="add-name__form">
    <div class="chat-confirm__info">
      <span class="chat-confirm__icon">${Question()}</span>
      <p class="chat-confirm__popup">${props.namePopup}</p>
    </div>
    <input required="true" type="text" placeholder="${props.namePlaceholder}" />
    <button class="chat-confirm__btn span-2-col">${props.nameSubmitBtn} ${ChatConfirm()}</button>
  </form>
</section>
`;
};

export default AskName;
