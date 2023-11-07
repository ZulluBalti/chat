import Cancel from "./icons/Cancel";
import Reset from "./icons/Reset";

const Header = (props) => {
  return `
    <header class="chat-header">
      <div class="reset__container hide"><span>${props.resetTxt || "Rest chat"}</span> ${Reset()}</div>
      <div class="cancel__container">${Cancel()}</div>
      <div class="relative avatar__container">
        <img src="${props.avatar.replace('/upload/', '/upload/t_auto/')}" class="header__avatar" alt="Support Profile Picutre" />
      </div>
      <h2 class="chat-header__name">${props.welcomeTitle}</h2>
      <p class="chat-header__extra">${props.welcomeSubTitle}</p>
    </header>`;
};

export default Header;
