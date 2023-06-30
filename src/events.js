import { renderChat } from "./History";

const events = () => {
  const event = () => {
    const openIcon = document.querySelector(`.chat-icon__container`);
    const cancelIcon = document.querySelector(`.chat-cancel__container`);
    const mainChat = document.querySelector(`.chat-main`);
    const textInput = document.querySelector(`.chat-footer__input`);
    const textSendBtn = document.querySelector(`.chat-footer__send`);
    const chatTyping = document.querySelector(`.chat-typing`);
    const chats = document.querySelector(`.chats`);
    const chatHistory = [{ type: "bot", text: "Som AI poradca pre stránku Buongiorno. Opýtajte sa ma akúkoľvek otázku." }];

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

    const getConversation = () => {
      const MAX_CONV = 4;

      let conversation = "";
      const len = chatHistory.length;

      for (let i = len - 2; i > len - MAX_CONV && i > 0; i--) {
        const itm = chatHistory[i];
        conversation =
          `${itm.type === "bot" ? "Martin" : "User"}: ${itm.text}\n` +
          conversation;
      }
      return conversation;
    };

    const handleSubmit = async () => {
      if (loading) return;
      const txt = textInput.value;
      if (!txt) return;
      loading = true;
      textInput.value = "";

      addChat({ type: "human", text: txt });
      setTimeout(() => {
        if (loading) chatTyping.classList.remove("hide");
        chatTyping.parentElement.scrollBy(0, 100);
      }, 300);

      try {
        let conversation = getConversation();
        let URL;

        if (import.meta.env.VITE_NODE_ENV === "development")
          URL = `http://localhost:5000/chat`;
         else URL = `https://chatbot-express-server.vercel.app/ask`;
        // else URL = `https://chat-server-flask-production.up.railway.app/chat`;

        const res = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversation, question: txt }),
        });
        const resJson = await res.json();

        addChat({
          type: "bot",
          text:
            resJson.answer ||
            "Momentálne sme OFFLINE napíšte nám neskôr prosím.",
        });
      } catch (err) {
        console.error(err);
      }

      chatTyping.classList.add("hide");
      loading = false;
    };

    const handleInput = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
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
