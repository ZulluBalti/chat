import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question";
import Close from "./icons/Close";

function decodeHTML(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}

const AskEmail = (props) => {
  const e = props.leadEmail;
  const p = props.leadPhone;
  return `
      <section class="chat-confirm ask-email relative hide">
        <form id="add-email__form" class="chat-confirm__form">
            <div class="chat-confirm__info">
              <span class="chat-confirm__icon">${Question()}</span>
              <p class="chat-confirm__popup">${props.emailPopup}</p>
            </div>
            ${e
      ? `<input type="text" id="lead-email" placeholder="${props.emailPlaceholder}" required />`
      : ""
    }
            ${p
      ? `<input type="text"  id="lead-phone" 
                    class="${e ? "span-2-col" : ""}"
                    placeholder="${props.phonePlaceholder}" 
                    required/>`
      : ""
    }
            <span id="gdpr-btn" class="span-2-col chat-confirm__gdpr">${props.gdprInfo}</span>
            <button class="chat-confirm__btn span-2-col"><span id="lead-submit-txt">${props.emailSubmitBtn}</span> ${ChatConfirm()}</button>
            <small class="chat-confirm__error"></small>
        </form>
      </section>
      <div class="gdpr-info hide">
        <header>
          <h2>${props.gdprTitle}</h2>
          <span id="gdpr-close">${Close()}</span>
        </header>
        <p>
          ${decodeHTML(props.gdpr)}
        </p>
      </div>
`;
};

export default AskEmail;
