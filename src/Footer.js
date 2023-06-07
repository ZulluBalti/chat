import Send from "./icons/Send";

const Footer = () => {
  return `
    <footer class="chat-footer">
      <textarea class="chat-footer__input"></textarea>
      <div class="chat-footer__send">
        ${Send()}
      </div>
    </footer>
`
}

export default Footer;
