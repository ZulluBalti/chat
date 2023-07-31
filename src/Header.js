import Cancel from './icons/Cancel'

const Header = (props) => {
  return `
    <header class="chat-header">
      <div class="cancel__container">${Cancel()}</div>
      <div class="relative avatar__container">
        <img src="${props.avatar}" class="header__avatar" alt="Support Profile Picutre" />
        <span class="online" />
      </div>
      <h2 class="chat-header__name">Hello my name is ${props.name}</h2>
      <h2 class="chat-header__name">I'm a ${props.project} digital assistant</h2>
      <p class="chat-header__extra">Ask me any question you have about ${props.project}.</p>
    </header>`
}

export default Header;
