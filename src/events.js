import { renderChat } from "./History";
import mainStyles from './assets/style.module.css'
import chatStyles from './assets/history.module.css'
import footStyles from './assets/footer.module.css'

const events = () => {
  const event = () => {
    const openIcon = document.querySelector(`.${mainStyles['chat-icon__container']}`);
    const cancelIcon = document.querySelector(`.${mainStyles['chat-cancel__container']}`);
    const mainChat = document.querySelector(`.${mainStyles['chat-main']}`);
    const textInput = document.querySelector(`.${footStyles['chat-footer__input']}`);
    const textSendBtn = document.querySelector(`.${footStyles['chat-footer__send']}`);
    const chatTyping = document.querySelector(`#chat-typing`);
    const chats = document.querySelector(`#chats`);
    console.log("CS", chatStyles)
    const chatHistory = [
      { type: chatStyles.bot, text: "Hi, I'm CP30, I'm a bot" },
      { type: chatStyles.bot, text: "I'm your assitance here to help you" },
    ];

    chats.innerHTML = renderChat(chatHistory);
    let loading = false;

    const toggle = () => {
      openIcon.classList.toggle(mainStyles.fade);
      mainChat.classList.toggle(mainStyles.fade);
      setTimeout(() => {
        openIcon.classList.toggle(mainStyles.hide);
        mainChat.classList.toggle(mainStyles.hide);
        if (!mainChat.classList.contains(mainStyles.hide)) {
          textInput.focus();
        }
      }, 200);
    };

    const addChat = (item) => {
      chatHistory.push(item);
      chats.innerHTML = renderChat(chatHistory);
      chats.scrollIntoView(false);
    };

    const handleSubmit = async () => {
      if (loading) return;
      const txt = textInput.value;
      if (!txt) return;
      loading = true;

      addChat({ type: chatStyles.human, text: txt });
      setTimeout(() => {
        if (loading)

        chatTyping.classList.remove(mainStyles.hide);
        chatTyping.parentElement.scrollBy(0, 100);
      }, 300);

      try {
        const res = await fetch(`http://localhost:4000/chat?q=${txt}`);
        const resJson = await res.json();

        addChat({ type: chatStyles.bot, text: resJson.answer });
      } catch (err) {
        console.error(err);
      }

      chatTyping.classList.add(mainStyles.hide);
      loading = false;
    };

    const handleInput = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        handleSubmit();
        textInput.value = "";
      }
    };

    openIcon.addEventListener("click", toggle);
    cancelIcon.addEventListener("click", toggle);
    textSendBtn.addEventListener("click", handleSubmit);
    textInput.addEventListener("keydown", handleInput);
  };

  document.addEventListener("DOMContentLoaded", event);
};

export default events;
