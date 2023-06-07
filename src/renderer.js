import Chat from './icons/Chat'
import Cancel from './icons/Cancel'
import Header from './Header'
import Footer from './Footer';
import { History } from './History';
import styles from './assets/style.module.css'

const renderer = () => {
  return `
    <div class="${styles['chat-container']}">
      <div class="${styles['chat-icon__container']}"}>
        ${Chat()}
      </div>
      <div class="${styles['chat-main']} ${styles.hide} ${styles.fade}">
        <div class="${styles['chat-cancel__container']}">
          ${Cancel()}
        </div>
        <section>
          ${Header()}
          ${History()}
          ${Footer()}
        </section>
      </div>
    </div>
  `
}

export default renderer;


