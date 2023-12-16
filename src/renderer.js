import ChatIndicator from './ChatIndicator'
import Header from './Header'
import Footer from './Footer';
import { History } from './History';
import { QuestionCarousel } from './QuestionCarousel';


const renderer = (config) => {
  const gchat_closed = sessionStorage.getItem("gchat-closed");
  const gchat_open_ind = sessionStorage.getItem("gchat-open_indicator");
  const small = (gchat_closed || window.innerWidth < 500) && gchat_open_ind !== 'true' && config.auto_open > 0;
  return `
    <div class="chat-container chat-close ${small ? 'chat-small' : ''}" id="chat-container">
      <div class="chat-icon__container gradient-bg">
         ${ChatIndicator(config, small)}
      </div>
      <div class="chat-main hide fade">
        <div class="chat-main__conv">
          ${Header(config)}
          ${History(config)}
        </div>
        ${config.questions?.length > 0 ? QuestionCarousel(config) : ""}
        ${Footer(config)}
      </div>
    </div>
  `
}

export default renderer;


