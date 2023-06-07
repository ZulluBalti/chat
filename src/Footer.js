import Send from "./icons/Send";
import styles from './assets/footer.module.css'

const Footer = () => {
  return `
    <footer class="${styles['chat-footer']}">
      <textarea class="${styles['chat-footer__input']}"></textarea>
      <div class="${styles['chat-footer__send']}">
        ${Send()}
      </div>
    </footer>
`
}

export default Footer;
