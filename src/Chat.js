import renderer from './renderer'
import events from './events'

const Chat = () => {
  document.body.insertAdjacentHTML("beforeend", renderer());
  events();
}

export default Chat;
