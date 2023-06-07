import logo from './assets/logo.png'
import profile from './assets/profile.jpg'
import styles from './assets/header.module.css'

const Header = () => {
  return `
    <header class="${styles['chat-header']}">
      <div class="${styles['chat-header__profile']}">
        <img src="${profile}" alt="Support Profile Picutre" />
      </div>
      <div>
        <h2 class="${styles['chat-header__name']}">Andres Demola</h2>
        <p class="${styles['chat-header__role']}">Support</p>
      </div>
      <div class="${styles['chat-header__logo']}">
        <a href="https://www.gchat.sk/" target="_blank"><img src="${logo}" alt="Logo" /></a>
      <div>
    </header>
`
}

export default Header;
