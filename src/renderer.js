import Chat from './icons/Chat'
import Cancel from './icons/Cancel'
import Header from './Header'
import Footer from './Footer';
import { History } from './History';

const renderer = () => {
  return `
    <div class="chat-container">
      <div class="chat-icon__container">
        ${Chat()}
      </div>
      <div class="chat-main hide fade">
        <section>
          ${Header()}
          ${History()}
          ${Footer()}
        </section>
        <div class="chat-cancel__container">
          ${Cancel()}
        </div>
      </div>
    </div>
  `
}

export default renderer;


