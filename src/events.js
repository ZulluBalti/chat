import { renderChat } from "./History";
import axios from "./axios";

const wait = (sec) =>
  new Promise((resolve) => setTimeout(() => resolve(), sec * 1000));

const events = (props) => {
  const lead = {
    name: localStorage.getItem("gchat-lead-name") || "",
    phone: "",
    email: "",
  };

  const myEvent = () => {
    let scrollTop = 0;
    const root = document.querySelector(":root");
    const container = document.getElementById(`chat-container`);
    const openIcon = document.querySelector(`.chat-icon__container`);
    const chatIcon = document.querySelector(`.chat-icon__container .chat-icon`);
    const closeIcon = document.querySelector(`.chat-icon__default .close`);
    const cancelIcon = document.querySelector(`.cancel__container`);
    const askNameCon = document.querySelector(".chat-confirm.ask-name");
    const askEmailCon = document.querySelector(".chat-confirm.ask-email");
    const addNameForm = document.getElementById(`add-name__form`);
    const gdprBtn = document.getElementById(`gdpr-btn`);
    const gdprInfo = document.querySelector(`.gdpr-info`);
    const gdprClose = document.getElementById(`gdpr-close`);
    const addEmailForm = document.getElementById(`add-email__form`);
    const mainChat = document.querySelector(`.chat-main`);
    const textInput = document.querySelector(`.chat-footer__input`);
    const textSendBtn = document.querySelector(`.chat-footer__send`);
    const chatTyping = document.querySelector(`.chat-typing`);
    const prevPreQuestion = document.querySelector(`.q-left`);
    const nextPreQuestion = document.querySelector(`.q-right`);
    const preQuestions = document.querySelector(`.g-questions`);
    const qcarousel = document.querySelector(".question-carousel");

    const chats = document.querySelector(`.chats`);
    const chatHistory = [];

    chats.innerHTML = renderChat(chatHistory);
    let loading = false;
    let simulated = false;

    const simulateChat = () => {
      const forNoneAuthUser = async () => {
        const conversation = JSON.parse(
          localStorage.getItem("gchat-conversation")
        );
        if (conversation) {
          conversation.forEach((itm) => addChat(itm));
        } else {
          if (props.firstTextInChat) {
            await wait(0.5);
            chatTyping.classList.toggle("hide"); // add
            await wait(2);
            addChat({ type: "bot", text: props.firstTextInChat });
            chatTyping.classList.toggle("hide"); // rmeove
          }

          if (props.secondTextInChat) {
            await wait(0.5);
            chatTyping.classList.toggle("hide"); // add
            await wait(2);
            addChat({ type: "bot", text: props.secondTextInChat });
            chatTyping.classList.toggle("hide"); // remove
          }
        }

        await wait(2);
        if (!conversation && props.leadName) {
          askNameCon.classList.toggle("hide");
          askNameCon.scrollIntoView(false);
        } else if (props.leadPhone || props.leadEmail) {
          showEmailContainer();
        }
      };

      const forAuthUser = async (user) => {
        chatTyping.classList.toggle("hide");
        await wait(1);
        chatTyping.classList.toggle("hide");
        addChat({
          type: "bot",
          text: `Vitaj späť ${user ? `, ${user}` : ""}`,
        });
        enableChat();
      };

      if (props.token) forAuthUser(props.userName);
      else forNoneAuthUser();
    };

    const toggle = async () => {
      if (window.innerWidth < 500) {
        if (container.classList.contains("close")) {
          scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        }
      }

      openIcon.classList.toggle("fade");
      mainChat.classList.toggle("fade");
      await wait(0.2);
      if (!simulated) simulateChat();

      simulated = true;
      openIcon.classList.toggle("hide");
      mainChat.classList.toggle("hide");
      if (!mainChat.classList.contains("hide")) {
        textInput.focus();
      }
      container.classList.toggle("close");

      chatIcon.classList.remove("open");
      chatIcon.classList.add("close");
      if (window.innerWidth < 500) {
        if (container.classList.contains("close")) {
          document.body.classList.remove("gchat-no-scroll");
          document.querySelector("html").classList.remove("gchat-no-scroll");
          window.scrollTo({ top: scrollTop, behavior: "instant" });
        } else {
          document.body.classList.add("gchat-no-scroll");
          document.querySelector("html").classList.add("gchat-no-scroll");
        }
      }
    };

    const addChat = (item) => {
      chatHistory.push(item);
      chats.innerHTML = renderChat(chatHistory);
      chats.scrollIntoView(false);
    };

    const getConversation = () => {
      const MAX_CONV = 4;

      let conversation = [];
      const len = chatHistory.length;

      for (let i = len - 2; i > len - MAX_CONV && i > 0; i--) {
        const itm = chatHistory[i];
        conversation.unshift({
          role: itm.type === "bot" ? "assistant" : "user",
          content: itm.text,
        });
      }
      return conversation;
    };

    const ask = async (txt) => {
      loading = true;
      addChat({ type: "human", text: txt });
      await wait(0.3);
      chatTyping.classList.remove("hide");
      chatTyping.parentElement.scrollBy(0, 100);

      try {
        let conversation = getConversation();
        conversation.push({ role: "user", content: txt });
        const res = await axios.post(`/projects/ask`, { conversation });
        addChat({
          type: "bot",
          text:
            res?.data.answer?.content ||
            "Momentálne sme OFFLINE napíšte nám neskôr prosím.",
        });
      } catch (err) {
        console.error(err);
        addChat({
          type: "bot",
          text: "Momentálne sme OFFLINE napíšte nám neskôr prosím.",
        });
      }

      chatTyping.classList.add("hide");
      loading = false;
    };

    const handleSubmit = () => {
      if (loading) return;
      const txt = textInput.value;
      if (!txt) return;
      textInput.value = "";

      ask(txt);
    };

    const handleInput = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    const closeOpenBar = (e) => {
      e.preventDefault();
      e.stopPropagation();
      chatIcon.classList.remove("open");
      chatIcon.classList.add("close");
    };

    const showEmailContainer = () => {
      askEmailCon.classList.remove("hide");
      askEmailCon.scrollIntoView(false);
    };

    const handleAddName = async (e) => {
      e.preventDefault();
      const name = e.target.querySelector("input").value;
      lead.name = name;
      localStorage.setItem("gchat-lead-name", name);

      askNameCon.classList.add("hide");
      addChat({ type: "human", text: name });
      await wait(0.5);
      chatTyping.classList.toggle("hide");
      await wait(1.5);
      chatTyping.classList.toggle("hide");
      addChat({ type: "bot", text: `Rád Vás spoznávam ${name}` });

      if (!props.leadEmail && !props.leadPhone) {
        await handleLeadSubmit();

        await wait(0.5);
        chatTyping.classList.toggle("hide");
        await wait(2);
        chatTyping.classList.toggle("hide");
        addChat({
          type: "bot",
          text: `Ďakujem za poskytnutie všetkých informácií. Teraz môžete používať AI`,
        });
        return enableChat();
      }

      await wait(0.5);
      chatTyping.classList.toggle("hide");
      await wait(2);
      chatTyping.classList.toggle("hide");
      addChat({
        type: "bot",
        text: `Zadajte prosím ešte Vaše kontaktné údaje pre prípad, ak by ste potrebovali podporu cez email, alebo telefón.`,
      });

      localStorage.setItem("gchat-conversation", JSON.stringify(chatHistory));
      await wait(2);
      showEmailContainer();
    };

    const enableChat = () => {
      const model = document.querySelector(".chat-footer__model");
      const lock = document.querySelector(".chat-footer__lock");

      model.classList.toggle("hide");
      lock.classList.toggle("hide");
      qcarousel?.classList?.toggle("hide");
      textInput.removeAttribute("disabled");
      textInput.focus();
      chats.scrollIntoView(false);
    };

    const handleLeadSubmit = async () => {
      try {
        const res = await axios.post(`/leads/${props.projectId}`, lead);
        const token = res.data.token;
        axios.defaults.headers.post["authorization"] = `Bearer ${token}`;
        localStorage.setItem("gchat-token", token);
      } catch (err) {
        console.log(err);
      }
    };

    const handleAddEmail = async (e) => {
      e.preventDefault();

      lead.email = document.getElementById("lead-email").value;
      lead.phone = document.getElementById("lead-phone").value;
      const btn = document.getElementById("lead-submit-txt");
      btn.textContent = "Submiting...";

      await handleLeadSubmit();

      askEmailCon.classList.toggle("hide");
      chatTyping.classList.toggle("hide");
      await wait(2);
      chatTyping.classList.toggle("hide");
      addChat({
        type: "bot",
        text: `Ďakujem za poskytnutie všetkých informácií. Teraz môžete používať AI`,
      });

      enableChat();
    };

    const toggleGdpr = () => {
      gdprInfo.classList.toggle("hide");
      askEmailCon.classList.toggle("hide");
    };

    const handlePrevQ = () => {
      const { width } = preQuestions.getBoundingClientRect();
      preQuestions.scrollLeft -= width;
    };

    const handleNextQ = () => {
      const { width } = preQuestions.getBoundingClientRect();
      preQuestions.scrollLeft += width;
    };

    const selectQuestion = (e) => {
      if (loading) return;
      const questionPr = e.target.closest(".g-question__con");
      const question = questionPr.querySelector(".g-question");
      ask(question.textContent);
      questionPr.remove();
      // check if there's none left
      const questions = Array.from(
        document.querySelectorAll(".g-question__con")
      );
      if (questions.length === 0) qcarousel.classList.add("hide");
    };

    const setCSSVariables = () => {
      root.style.setProperty("--gchat-color", props.color);
      root.style.setProperty("--gchat-accent-color", props.accentColor);
      updateHeight();
    };

    const updateHeight = () => {
      root.style.setProperty("--gchat-height", `${window.innerHeight}px`);
    };

    const disableSafariZoom = () => {
      const el = document.querySelector("head");
      const markup = `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">`;
      el.insertAdjacentHTML("beforeend", markup);
    };

    openIcon.addEventListener("click", toggle);
    closeIcon.addEventListener("click", closeOpenBar);
    cancelIcon.addEventListener("click", toggle);
    textSendBtn.addEventListener("click", handleSubmit);
    textInput.addEventListener("keydown", handleInput);
    addNameForm.addEventListener("submit", handleAddName);
    addEmailForm.addEventListener("submit", handleAddEmail);
    gdprBtn.addEventListener("click", toggleGdpr);
    gdprClose.addEventListener("click", toggleGdpr);
    prevPreQuestion?.addEventListener("click", handlePrevQ);
    nextPreQuestion?.addEventListener("click", handleNextQ);
    preQuestions?.addEventListener("click", selectQuestion);
    window.addEventListener("resize", updateHeight);
    setCSSVariables();
    disableSafariZoom();
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", myEvent);
  else myEvent();
};

export default events;
