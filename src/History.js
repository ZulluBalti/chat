import Spinner from "./Spinner"
import styles from './assets/history.module.css'
import mainStyles from './assets/style.module.css'


const renderChat = (chats = []) => {
  const render = (itm) =>  `
    <div class="${itm.type}">
      <div class="${styles['chat-item']}">
        <p class="${styles['chat-text']}">${itm.text}</p>
      </div>
    </div>`

  return chats.map(render).join("");
}

const History = () => {
  return `
    <div class="${styles['chat-history']}">
      <div id="chats">${renderChat()}</div>
      <div id="chat-typing" class="${styles.bot} ${mainStyles.hide}">
        <div class="${styles['chat-item']}">
          <div class="${styles['chat-text']}">${Spinner()}</div>
        </div>
      </div>
    </div>
`
}

export {History, renderChat};
