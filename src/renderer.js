import Chat from './icons/Chat'
import Cancel from './icons/Cancel'
import Header from './Header'
import Footer from './Footer';
import { History } from './History';

const renderer = () => {
  return `
    <div class="chat-container">
      <div class="chat-icon__container hide fade">
        ${Chat()}
      </div>
      <div class="chat-main">
        <div class="chat-cancel__container">
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


