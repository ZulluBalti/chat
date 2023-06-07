import renderer from './renderer'
import events from './events'
import './assets/style.css'

const Chat = () => {
  document.body.insertAdjacentHTML("beforeend", renderer());
  events();
}

export default Chat;
