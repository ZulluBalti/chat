import logo from './assets/logo.png'
import profile from './assets/profile.jpg'

const Header = () => {
  return `
    <header class="chat-header">
      <div class="chat-header__profile">
        <img src="${profile}" alt="Support Profile Picutre" />
      </div>
      <div>
        <h2 class="chat-header__name">Andres Demola</h2>
        <p class="chat-header__role">Support</p>
      </div>
      <div class="chat-header__logo">
        <a href="https://www.gchat.sk/" target="_blank"><img src="${logo}" alt="Logo" /></a>
      <div>
    </header>
`
}

export default Header;
