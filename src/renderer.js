import Chat from './Chat'
import Header from './Header'
import Footer from './Footer';
import { History } from './History';
import QuestionCarousel from './QuestionCarousel';


const renderer = (config) => {
  return `
    <div class="chat-container">
      <div class="chat-icon__container gradient-bg">
         ${Chat(config)}
      </div>
      <div class="chat-main hide fade">
        <section>
          ${Header(config)}
          ${History(config)}
          ${config.questions?.length > 0 ? QuestionCarousel(config) : ""}
          ${Footer()}
        </section>
      </div>
    </div>
  `
}

export default renderer;


