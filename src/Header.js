import Cancel from "./icons/Cancel";

const Header = (props) => {
  return `
    <header class="chat-header">
      <div class="cancel__container">${Cancel()}</div>
      <div class="relative avatar__container">
        <img src="${
          props.avatar
        }" class="header__avatar" alt="Support Profile Picutre" />
        <span class="online" />
      </div>
      <h2 class="chat-header__name">Dobrý deň, volám sa ${props.name},</h2>
      <h2 class="chat-header__name">som digitálny asistent ${
        props.project
      }.</h2>
      <p class="chat-header__extra">Opýtajte sa ma na akúkoľvek otázku ohľadne spoločnosti ${
        props.project
      }.</p>
    </header>`;
};

export default Header;
