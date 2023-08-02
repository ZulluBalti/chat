import Lock from "./icons/Lock";
import Send from "./icons/Send";

const Footer = () => {
  return `
    <footer class="chat-footer">
      <div class="chat-footer__content">
        <div class="relative">
          <textarea class="chat-footer__input" placeholder="Type here..." rows="1" disabled="disabled"></textarea>
          <span class="chat-footer__lock">${Lock()}</span>
        </div>
        <div class="chat-footer__send">
          ${Send()}
        </div>
      </div>
      <a href="https://gchat.sk/" target="_blank"><p>Powered by G CHAT</p></a>
      <div class="chat-footer__model"></div>
    </footer>
`
}

export default Footer;
