const CloseIcon = () => `<span class="close"> 
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M10.1429 1L1 10.1429" stroke="#108D76" stroke-linecap="round"/>
                <path d="M1.0007 0.999939L10.1436 10.1428" stroke="#108D76" stroke-linecap="round"/>
              </svg>
            </span>`;

const Forward = () => `<span class="forward">
              <svg xmlns="http://www.w3.org/2000/svg" width="42" height="48" viewBox="0 0 42 48" fill="none">
                <path d="M15.893 11.8446L26.1659 23.6416L15.6779 35.2477" stroke="white" stroke-width="2"/>
              </svg>
            </span>`;

const Chat = (config) => {
  const { avatar, name } = config;

  const UserProfile = () => {
    return `<div class="relative chat-avatar__con">
          <img src="${avatar}" class="chat__avatar" alt="Assitant Picture" />
          <span class="online"></span>
        </div>`;
  };

  return `
      <div class="chat-icon open">
        <div class="chat-icon__close-mobile">
          ${UserProfile()}
          <h2>Start <br />AI Chat</h2>
        </div>

        <div class="chat-icon__close-desktop">
          ${UserProfile()}
          <h2>Just ask ${name}</h2>
          <p>Som k dispozícii 24 hodín denne</p>
          <div class="actions">
            ${Forward()}
          </div>
        </div>

        <div class="chat-icon__default">
          ${UserProfile()}
          <h2>Just ask ${name}</h2>
          <p>Want to talk to our digital AI assistant? ${name} can answer any question you may have.</p>
          <div class="actions">
            ${CloseIcon()}
            ${Forward()}
          </div>
        </div>
      </div>
  `;
};

export default Chat;
