const CloseIcon = () => `<span class="chat-actions-close"> 
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M10.1429 1L1 10.1429" stroke="#108D76" stroke-linecap="round"/>
                <path d="M1.0007 0.999939L10.1436 10.1428" stroke="#108D76" stroke-linecap="round"/>
              </svg>
            </span>`;

const Forward = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="38" viewBox="0 0 20 38" fill="none">
  <path d="M1.34032 1.07576L17.7417 19.0756L1.01222 36.7709" stroke="white" stroke-width="2"/>
</svg>`;

const Chat = (config) => {
  const { avatar, openTitle, openSubTitle } = config;

  const UserProfile = () => {
    return `<div class="relative chat-avatar__con">
          <img src="${avatar.replace('/upload/', '/upload/t_auto/')}" class="chat__avatar" alt="Assitant Picture" />
        </div>`;
  };

  return `
      <div class="chat-icon chat-icon-open">
        <div class="chat-icon__close-mobile">
          ${UserProfile()}
          <h2>${config.smallTitle.replace("\\n", "<br />")}</h2>
        </div>

        <div class="chat-icon__close-desktop">
          ${UserProfile()}
          <h2>${config.closeTitle}</h2>
          <p>${config.closeSubTitle}</p>
          <div class="actions">
            ${Forward()}
          </div>
        </div>

        <div class="chat-icon__default">
          ${UserProfile()}
          <h2>${openTitle}</h2>
          <p>${openSubTitle}</p>
          <div class="actions">
            ${CloseIcon()}
            ${Forward()}
          </div>
        </div>
      </div>
  `;
};

export default Chat;
