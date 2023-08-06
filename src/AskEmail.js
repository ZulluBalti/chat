import ChatConfirm from "./icons/ChatConfirm";
import Question from "./icons/Question";
import Close from "./icons/Close";

const AskEmail = (props) => {
  return `
      <section class="chat-confirm ask-email hide">
        <div class="chat-confirm__header">
          <span>${Question()}</span>
          <p>Spustite chat napísaním Vašich kontaktných údajov pre prípad komunikácie cez e-mail / telefón.</p>
        </div>
        <form id="add-email__form" class="chat-confirm__input">
          ${
            props.leadEmail
              ? '<input type="email" id="lead-email" placeholder="Váš e-mail . . ." />'
              : ""
          }
          ${
            props.leadPhone
              ? '<input type="text" id="lead-phone" placeholder="Vaše telefónne číslo . . ." />'
              : ""
          }
          <span id="gdpr-btn" class="chat-confirm__gdpr">Moje dáta a GDPR</span>
          <button class="chat-confirm__btn"><span id="lead-submit-txt">Spustiť AI chat</span> ${ChatConfirm()}</button>
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
