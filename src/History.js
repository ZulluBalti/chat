import AskAdditional from "./AskAdditional";
import AskEmail from "./AskEmail";
import AskName from "./AskName";
import Spinner from "./Spinner";

const renderChat = (chats = []) => {
  const render = (itm) => `
    <div class="${itm.type}">
      <div class="chat-item gradient-bg">
        <p class="chat-text">${itm.text.replaceAll("\n", "<br />")}</p>
      </div>
    </div>`;

  return chats.map(render).join("");
};

const History = (props) => {
  return `
    <div class="chat-history">
      <div class="chats">${renderChat()}</div>
      <div class="bot chat-typing hide">
        <div class="chat-item gradient-bg">
          <div class="chat-text">${Spinner()}</div>
        </div>
      </div>
      ${AskName(props)}
      ${AskEmail(props)}
      ${AskAdditional(props)}
    </div>
`;
};

export { History, renderChat };
