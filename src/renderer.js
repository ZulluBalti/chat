import ChatIndicator from './ChatIndicator'
import Header from './Header'
import Footer from './Footer';
import { History } from './History';
import QuestionCarousel from './QuestionCarousel';


const renderer = (config) => {
  return `
    <div class="chat-container chat-close" id="chat-container">
      <div class="chat-icon__container gradient-bg">
         ${ChatIndicator(config)}
      </div>
      <div class="chat-main hide fade">
        <div class="chat-main__conv">
          ${Header(config)}
          ${History(config)}
        </div>
        ${config.questions?.length > 0 ? QuestionCarousel(config) : ""}
        ${Footer()}
      </div>
    </div>
  `
}

export default renderer;


