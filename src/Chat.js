import './assets/style.css'
import renderer from './src/renderer'
import events from './src/events'

const Chat = () => {
  document.body.insertAdjacentHTML("beforeend", renderer());
  events();
}

export default Chat;
