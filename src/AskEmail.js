import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question";
import Close from "./icons/Close";

const AskEmail = (props) => {
  const e = props.leadEmail;
  const p = props.leadPhone;
  return `
      <section class="chat-confirm ask-email relative hide">
        <form id="add-email__form" class="chat-confirm__form">
            <div class="chat-confirm__info">
              <span class="chat-confim__icon">${Question()}</span>
              <p class="chat-confim__popup">Spustite chat napísaním Vašich kontaktných údajov pre prípad komunikácie cez e-mail / telefón.</p>
            </div>
            ${
              e
                ? '<input type="text" id="lead-email" placeholder="Váš e-mail . . ." required />'
                : ""
            }
            ${
              p
                ? `<input type="text"  id="lead-phone" 
                    class="${e ? "span-2-col" : ""}"
                    placeholder="Vaše telefónne číslo . . ." 
                    required/>`
                : ""
            }
            <span id="gdpr-btn" class="span-2-col chat-confirm__gdpr">Moje dáta a GDPR</span>
            <button class="chat-confirm__btn span-2-col"><span id="lead-submit-txt">Spustiť AI chat</span> ${ChatConfirm()}</button>
            <small class="chat-confirm__error"></small>
        </form>
      </section>
      <div class="gdpr-info hide">
        <header>
          <h2>Moje dáta a GDPR</h2>
          <span id="gdpr-close">${Close()}</span>
        </header>
        <p>
          Osobné údaje spracúva spoločnosť gchat.sk, (ďalej len 
          "G CHAT") ako sprostredkovateľ osobných údajov pre majiteľa webovej stránky, 
          ktorý je prevádzkovateľom osobných údajov. GCHAT spracúva osobné údaje v súlade s GDPR. 
          Informácie o tom, ako GCHAT chráni a spracúva osobné údaje, nájdete na 
          <a href="https://www.gchat.sk/gdpr" target="_blank">www.gchat.sk/gdpr</a>. 
          Spracúvanie vašich osobných údajov je nevyhnutné na poskytovanie zákazníckej podpory. 
          Ak máte akékoľvek otázky týkajúce sa spracúvania vašich osobných údajov alebo chcete požiadať o 
          vymazanie vašich osobných údajov, obráťte sa na vlastníka webovej stránky.
        </p>
      </div>
`;
};

export default AskEmail;
