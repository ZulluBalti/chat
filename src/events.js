import { renderChat } from "./History";
import axios from "./axios";
import isEmail from "validator/es/lib/isEmail";
import { renderQ } from "./QuestionCarousel";

const wait = (sec) =>
  new Promise((resolve) => setTimeout(() => resolve(), sec * 1000));

const events = (props) => {
  const lead = {
    name: localStorage.getItem("gchat-lead-name") || "",
    phone: "",
    email: "",
    info: localStorage.getItem("gchat-lead-info") || "",
  };
  let free_q = parseInt(localStorage.getItem("gchat-free_q") || 0);

  const myEvent = () => {
    let scrollTop = 0;
    const root = document.querySelector(":root");
    const container = document.getElementById(`chat-container`);
    const openIcon = document.querySelector(`.chat-icon__container`);
    const chatIcon = document.querySelector(`.chat-icon__container .chat-icon`);
    const closeIcon = document.querySelector(`.chat-icon__default .chat-actions-close`);
    const cancelIcon = document.querySelector(`.cancel__container`);
    const askNameCon = document.querySelector(".chat-confirm.ask-name");
    const askEmailCon = document.querySelector(".chat-confirm.ask-email");
    const askAddCon = document.querySelector(".chat-confirm.ask-additional");
    const addNameForm = document.getElementById(`add-name__form`);
    const sellerForm = document.getElementById(`seller_form`);
    const sellBtn = document.getElementById('gchat-sell');
    const buyBtn = document.getElementById('gchat-buy');
    const gdprBtn = document.getElementById(`gdpr-btn`);
    const gdprInfo = document.querySelector(`.gdpr-info`);
    const gdprClose = document.getElementById(`gdpr-close`);
    const addEmailForm = document.getElementById(`add-email__form`);
    const emailPopup = document.querySelector(`#add-email__form .chat-confirm__icon`);
    const namePopup = document.querySelector(`#add-name__form .chat-confirm__icon`);
    const infoPopup = document.querySelector(`#seller_form .chat-confirm__icon`);
    const mainChat = document.querySelector(`.chat-main`);
    const textInput = document.querySelector(`.chat-footer__input`);
    const textSendBtn = document.querySelector(`.chat-footer__send`);
    const chatTyping = document.querySelector(`.chat-typing`);
    const prevPreQuestion = document.querySelector(`.q-left`);
    const nextPreQuestion = document.querySelector(`.q-right`);
    const preQuestions = document.querySelector(`.g-questions`);
    const qcarousel = document.querySelector(".question-carousel");
    const reset = document.querySelector("#chat-container .reset__container");

    const chats = document.querySelector(`.chats`);
    let chatHistory = [];

    chats.innerHTML = renderChat(chatHistory);
    let loading = false;
    let simulated = false;

    const toggleTyping = () => {
      chatTyping.classList.toggle("hide");
      chatTyping.scrollIntoView(true);
    };

    const simulateChat = () => {
      const forNoneAuthUser = async () => {
        const conversation = JSON.parse(localStorage.getItem("gchat-conversation"));

        if (conversation) {
          conversation.forEach((itm) => addChat(itm));
        } else {
          if (props.firstTextInChat) {
            await wait(0.5);
            toggleTyping();
            await wait(2);
            addChat({ type: "bot", text: props.firstTextInChat });
            toggleTyping();
          }

          if (props.secondTextInChat) {
            await wait(0.5);
            toggleTyping();
            await wait(2);
            addChat({ type: "bot", text: props.secondTextInChat });
            toggleTyping();
          }
        }

        await wait(2);
        if (!conversation && props.leadName) {
          askNameCon.classList.toggle("hide");
          askNameCon.scrollIntoView(true);
        } else if (props.leadInfo && free_q + 1 >= props.free_limit && !lead.info) {
          showAddContainer();
        } else if ((props.leadPhone || props.leadEmail) && free_q + 1 >= props.free_limit) {
          showEmailContainer();
        } else {
          enableChat();
          localStorage.setItem("gchat-visited", "true");
        }
      };

      const forAuthUser = async (user) => {
        toggleTyping();
        await wait(1);
        toggleTyping();
        addChat({
          type: "bot",
          text: props.welcomeBack?.replace?.(/%USER%/gi, user),
        });
        enableChat();
      };

      if (
        props.token ||
        (props.visited &&
          !props.leadName &&
          !props.leadPhone &&
          !props.leadInfo &&
          !props.leadEmail)
      )
        forAuthUser(props.userName);
      else forNoneAuthUser();
    };

    const toggle = async () => {
      if (window.innerWidth < 500) {
        if (container.classList.contains("chat-close")) {
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
      container.classList.toggle("chat-close");

      chatIcon.classList.remove("chat-icon-open");
      chatIcon.classList.add("chat-icon-close");
      if (window.innerWidth < 500) {
        if (container.classList.contains("chat-close")) {
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
      toggleTyping();
      chatTyping.parentElement.scrollBy(0, 100);

      try {
        let conversation = getConversation();
        conversation.push({ role: "user", content: txt });

        const res = await axios.post(`/projects/ask/${props.projectId}`, {
          conversation,
          free_q
        });
        addChat({
          type: "bot",
          text:
            res?.data.answer?.content ||
            props.errorMsg
        });
      } catch (err) {
        console.error(err);
        addChat({
          type: "bot",
          text: props.errorMsg
        });
      }

      toggleTyping();
      loading = false;

      if (free_q + 1 >= props.free_limit && !props.token) {
        disableChat();
        if (props.leadInfo)
          showAddContainer();
        else if (props.leadPhone || props.leadEmail)
          showEmailContainer();
      } else {
        free_q++;
        localStorage.setItem("gchat-free_q", free_q);
      }
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
      chatIcon.classList.remove("chat-icon-open");
      chatIcon.classList.add("chat-icon-close");
    };

    const showEmailContainer = async () => {
      if (props.textAfterName) {
        await wait(0.5);
        toggleTyping();
        await wait(2);
        toggleTyping();
        addChat({
          type: "bot",
          text: props.textAfterName,
        });
      }
      await wait(1);
      askEmailCon.classList.remove("hide");
      askEmailCon.scrollIntoView(true);
    };

    const showAddContainer = async () => {
      await wait(1);
      askAddCon.classList.remove("hide");
      askAddCon.scrollIntoView(true);
    };

    const showAddForm = async () => {
      await wait(1);
      sellerForm.classList.remove("hide");
      sellerForm.scrollIntoView(true);
    };

    const handleAddName = async (e) => {
      e.preventDefault();
      const name = e.target.querySelector("input").value;
      lead.name = name;
      localStorage.setItem("gchat-lead-name", name);

      askNameCon.classList.add("hide");
      addChat({ type: "human", text: name });
      await wait(0.5);
      toggleTyping();
      await wait(1.5);
      toggleTyping();
      addChat({ type: "bot", text: props.greet?.replace?.(/%NAME%/gi, name) });


      if (!props.leadEmail && !props.leadPhone && !props.leadInfo) {
        await handleLeadSubmit(askNameCon);
        return;
      }

      localStorage.setItem("gchat-conversation", JSON.stringify(chatHistory));
      if (free_q + 1 >= props.free_limit) {
        if (props.leadInfo)
          return showAddContainer();
        else if (props.leadPhone || props.leadEmail)
          return showEmailContainer();
      }

      return enableChat();
    };

    const handleAdditionalSubmit = async (e) => {
      e.preventDefault();
      const what = document.getElementById("gchat-what").value;
      const where = document.getElementById("gchat-where").value;
      const capital = document.getElementById("gchat-capital").value;

      lead.info = `${what}\n${where}\n${capital}`;
      localStorage.setItem("gchat-lead-info", lead.info);

      sellerForm.classList.add("hide");
      // askAddCon.classList.add('hide')

      if (!props.leadEmail && !props.leadPhone) {
        await handleLeadSubmit(askAddCon);
        return;
      }

      localStorage.setItem("gchat-conversation", JSON.stringify(chatHistory));
      if ((props.leadPhone || props.leadEmail) && free_q + 1 >= props.free_limit) {
        showEmailContainer();
      } else enableChat();
    };

    const disableChat = () => {
      const model = document.querySelector(".chat-footer__model");
      const lock = document.querySelector(".chat-footer__lock");

      model.classList.remove("hide");
      lock.classList.remove("hide");
      qcarousel?.classList?.add("hide");
      textInput.setAttribute("disabled", "disabled");
      textInput.setAttribute("placeholder", props.chatLockPlaceholder);
      chats.scrollIntoView(true);
      reset.classList.add("hide")
    };

    const enableChat = () => {
      const model = document.querySelector(".chat-footer__model");
      const lock = document.querySelector(".chat-footer__lock");

      model.classList.add("hide");
      lock.classList.add("hide");
      qcarousel?.classList?.remove("hide");
      textInput.removeAttribute("disabled");
      textInput.focus();
      textInput.setAttribute("placeholder", props.chatOpenPlaceholder);
      chats.scrollIntoView(true);
      reset.classList.remove("hide")
    };

    const handleLeadSubmit = async (parentForm) => {
      try {
        const res = await axios.post(`/leads/${props.projectId}`, lead);
        const token = res.data.token;
        axios.defaults.headers.post["authorization"] = `Bearer ${token} `;
        localStorage.setItem("gchat-token", token);
        props.token = token;

        parentForm.classList.add("hide");
        toggleTyping();
        await wait(2);
        toggleTyping();
        addChat({
          type: "bot",
          text: props.thankTxt,
        });

        enableChat();
        chats.scrollIntoView(false)
      } catch (err) {
        console.log(err);
      }
    };

    const validatePhone = (number) => {
      const min = props.minPhoneLength;
      const max = props.maxPhoneLength;

      if (number[0] === "+") number = number.replace("+", "");
      let n = number.replaceAll(" ", "");
      if (n.length < min)
        return [null, props.minPhoneError];
      if (n.length > max)
        return [null, props.maxPhoneError];
      return [Number(n)];
    };

    const handleAddEmail = async (e) => {
      e.preventDefault();
      const error = document.querySelector(".chat-confirm__error");
      error.textContent = "";

      // validation
      if (props.leadPhone) {
        lead.phone = document.getElementById("lead-phone").value;
        const [valid, msg] = validatePhone(lead.phone);
        if (!valid) {
          error.textContent = msg || props.invalidPhone;
          return;
        }
      }
      if (props.leadEmail) {
        lead.email = document.getElementById("lead-email").value?.trim?.();
        if (!isEmail(lead.email)) {
          error.textContent = props.invalidEmail;
          return;
        }
      }
      const btn = document.getElementById("lead-submit-txt");
      btn.textContent = props.emailSubmitingBtn;

      await handleLeadSubmit(askEmailCon);
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
      const markup = `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />`;
      el.insertAdjacentHTML("beforeend", markup);
    };

    const toggleInfoPopup = (e) => {
      e.stopPropagation();
      const parent = e.target.closest('.chat-confirm__info')
      const el = parent.querySelector('.chat-confirm__popup')
      el.classList.toggle("show-chat__popup")
    }

    const closeInfoPopups = () => {
      const nameEl = namePopup.closest('.chat-confirm__info').querySelector('.chat-confirm__popup')
      nameEl.classList.remove("show-chat__popup")
      const emailEl = emailPopup.closest('.chat-confirm__info').querySelector('.chat-confirm__popup')
      emailEl.classList.remove("show-chat__popup")
      const infoEl = infoPopup.closest('.chat-confirm__info').querySelector('.chat-confirm__popup')
      infoEl.classList.remove("show-chat__popup")
    }

    const resetHistory = () => {
      if (loading) return;
      chatHistory = [];
      addChat({ type: "bot", text: props.resetMsg || "Chat has been reset, Now you can start a new conversation" })
      const container = qcarousel.querySelector('.g-questions');
      const html = renderQ(props.questions);
      container.innerHTML = html;
      if (qcarousel.classList.contains('hide'))
        qcarousel.classList.remove('hide')
      localStorage.removeItem("gchat-conversation")
    }

    const handleSellBtn = (e) => {
      const type = e.target.id;
      console.log(type);
      showAddForm();
      e.target.closest('.ask-additional-btns').classList.add('hide')
    }

    openIcon.addEventListener("click", toggle);
    closeIcon.addEventListener("click", closeOpenBar);
    cancelIcon.addEventListener("click", toggle);
    textSendBtn.addEventListener("click", handleSubmit);
    textInput.addEventListener("keydown", handleInput);
    addNameForm.addEventListener("submit", handleAddName);
    addEmailForm.addEventListener("submit", handleAddEmail);
    sellBtn.addEventListener("click", handleSellBtn);
    buyBtn.addEventListener("click", handleSellBtn);
    sellerForm.addEventListener("submit", handleAdditionalSubmit);
    gdprBtn.addEventListener("click", toggleGdpr);
    gdprClose.addEventListener("click", toggleGdpr);
    prevPreQuestion?.addEventListener("click", handlePrevQ);
    nextPreQuestion?.addEventListener("click", handleNextQ);
    preQuestions?.addEventListener("click", selectQuestion);
    emailPopup.addEventListener("click", toggleInfoPopup);
    namePopup.addEventListener("click", toggleInfoPopup);
    infoPopup.addEventListener("click", toggleInfoPopup);
    reset.addEventListener("click", resetHistory);
    window.addEventListener("click", closeInfoPopups);
    window.addEventListener("resize", updateHeight);
    setCSSVariables();
    disableSafariZoom();
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", myEvent);
  else myEvent();
};

export default events;
