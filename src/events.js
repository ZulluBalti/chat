import { renderChat } from "./History";

const events = () => {
  console.log("EVENTS");
  const event = () => {
    console.log("STARTED");
    const openIcon = document.querySelector(`.chat-icon__container`);
    const cancelIcon = document.querySelector(`.chat-cancel__container`);
    const mainChat = document.querySelector(`.chat-main`);
    const textInput = document.querySelector(`.chat-footer__input`);
    const textSendBtn = document.querySelector(`.chat-footer__send`);
    const chatTyping = document.querySelector(`.chat-typing`);
    const chats = document.querySelector(`.chats`);
    const chatHistory = [
      { type: "bot", text: "Hi, I'm CP30, I'm a bot" },
      { type: "bot", text: "I'm your assitance here to help you" },
    ];

    chats.innerHTML = renderChat(chatHistory);
    let loading = false;

    const toggle = () => {
      openIcon.classList.toggle("fade");
      mainChat.classList.toggle("fade");
      setTimeout(() => {
        openIcon.classList.toggle("hide");
        mainChat.classList.toggle("hide");
        if (!mainChat.classList.contains("hide")) {
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

      addChat({ type: "human", text: txt });
      setTimeout(() => {
        if (loading) chatTyping.classList.remove("hide");
        chatTyping.parentElement.scrollBy(0, 100);
      }, 300);

      try {
        const res = await fetch(`http://localhost:4000/chat?q=${txt}`);
        const resJson = await res.json();

        addChat({ type: "bot", text: resJson.answer });
      } catch (err) {
        console.error(err);
      }

      chatTyping.classList.add("hide");
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

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", event);
  else event();
};

export default events;
