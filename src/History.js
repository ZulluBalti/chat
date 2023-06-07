import Spinner from "./Spinner"

const renderChat = (chats = []) => {
  const render = (itm) =>  `
    <div class="${itm.type}">
      <div class="chat-item">
        <p class="chat-text">${itm.text}</p>
      </div>
    </div>`

  return chats.map(render).join("");
}

const History = () => {
  return `
    <div class="chat-history">
      <div class="chats">${renderChat()}</div>
      <div class="chat-typing bot hide">
        <div class="chat-item">
          <div class="chat-text">${Spinner()}</div>
        </div>
      </div>
    </div>
`
}

export {History, renderChat};
