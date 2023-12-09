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
  let prevNode = null;
  let free_q = parseInt(localStorage.getItem("gchat-free_q") || 0);

  const myEvent = () => {
    let scrollTop = 0;
    const root = document.querySelector(":root");
    const container = document.getElementById(`chat-container`);
    const openIcon = document.querySelector(`.chat-icon__container`);
    const chatIcon = document.querySelector(`.chat-icon__container .chat-icon`);
    const closeIcon = document.querySelector(
      `.chat-icon__default .chat-actions-close`,
    );
    const cancelIcon = document.querySelector(`.cancel__container`);
    const askNameCon = document.querySelector(".chat-confirm.ask-name");
    const askEmailCon = document.querySelector(".chat-confirm.ask-email");
    const askAddCon = document.querySelector(".chat-confirm.ask-additional");
    const addNameForm = document.getElementById(`add-name__form`);
    const sellerForm = document.getElementById(`seller_form`);
    const sellBtn = document.getElementById("gchat-sell");
    const buyBtn = document.getElementById("gchat-buy");
    const gdprBtn = document.getElementById(`gdpr-btn`);
    const gdprInfo = document.querySelector(`.gdpr-info`);
    const gdprClose = document.getElementById(`gdpr-close`);
    const addEmailForm = document.getElementById(`add-email__form`);
    const emailPopup = document.querySelector(
      `#add-email__form .chat-confirm__icon`,
    );
    const namePopup = document.querySelector(
      `#add-name__form .chat-confirm__icon`,
    );
    const infoPopup = document.querySelector(
      `#seller_form .chat-confirm__icon`,
    );
    const mainChat = document.querySelector(`.chat-main`);
    const scrollCon = document.querySelector(`.chat-main__conv`);
    const textInput = document.querySelector(`.chat-footer__input`);
    const textSendBtn = document.querySelector(`.chat-footer__send`);
    const chatTyping = document.querySelector(`.chat-typing`);
    const preQuestions = document.querySelector(`.g-questions`);
    const qcarousel = document.querySelector(".question-carousel");
    const reset = document.querySelector("#chat-container .reset__container");

    const chats = document.querySelector(`.chats`);
    const prev_chat = JSON.parse(sessionStorage.getItem("gchat-chat"));
    let chatHistory = prev_chat || [];

    chats.innerHTML = renderChat(chatHistory);
    let loading = false;
    let simulated = false;

    const showEnd = () => {
      scrollCon.scrollTop = scrollCon.scrollHeight;
    }

    const toggleTyping = () => {
      chatTyping.classList.toggle("hide");
      showEnd();
    };

    const simulateChat = () => {
      const forNoneAuthUser = async () => {
        if (props.firstTextInChat && chatHistory[0]?.text !== props.firstTextInChat) {
          await wait(0.5);
          toggleTyping();
          await wait(2);
          addChat({ type: "bot", text: props.firstTextInChat });
          toggleTyping();
        }

        if (props.secondTextInChat && chatHistory[1]?.text !== props.secondTextInChat) {
          await wait(0.5);
          toggleTyping();
          await wait(2);
          addChat({ type: "bot", text: props.secondTextInChat });
          toggleTyping();
        }

        await wait(2);

        const prev_name = localStorage.getItem("gchat-lead-name");
        if (!prev_name && props.leadName) {
          askNameCon.classList.toggle("hide");
          showEnd();
        } else if (
          props.leadInfo &&
          free_q >= props.free_limit &&
          !lead.info
        ) {
          showAddContainer();
        } else if (
          (props.leadPhone || props.leadEmail) &&
          free_q >= props.free_limit
        ) {
          showEmailContainer();
        } else {
          enableChat();
          localStorage.setItem("gchat-visited", "true");
        }
      };

      const forAuthUser = async (user) => {
        const tkn = localStorage.getItem("gchat-token");
        const text = props.welcomeBack?.replace?.(/%USER%/gi, user);
        const last = chatHistory.length - 1;
        if (tkn && chatHistory[last]?.text !== text && !prev_chat) {
          toggleTyping();
          await wait(1);
          toggleTyping();
          addChat({
            type: "bot",
            text
          });
        }
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

    const toggle = async (e) => {
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
      container.classList.add("chat-small");
      sessionStorage.setItem("gchat-closed", true);

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
      if (e) {
        const prev = sessionStorage.getItem("gchat-open");
        const update = !prev || prev === "false" ? "true" : "false";
        sessionStorage.setItem("gchat-open", update);
      }
    };

    const addChat = (item) => {
      chatHistory.push({ ...item, text: linkify(item.text).trim() });
      chats.innerHTML = renderChat(chatHistory);
      showEnd();
      sessionStorage.setItem("gchat-chat", JSON.stringify(chatHistory));
    };

    const getConversation = () => {
      const MAX_CONV = props.history_size * 2 || 4;

      let conversation = [];
      const len = chatHistory.length;

      for (let i = len - 2; i >= len - MAX_CONV && i > 0; i--) {
        const itm = chatHistory[i];
        conversation.unshift({
          role: itm.type === "bot" ? "assistant" : "user",
          content: itm.text,
        });
      }
      return conversation;
    };

    function isInvalidCharacter(url) {
      const unsafeCharacters = '"<>@\\^`|\n';
      return unsafeCharacters.includes(url);
    }

    const invalidateUrl = (word, c) => {
      if (!word && c !== "h") return true;
      if (!word.startsWith("http".slice(0, word.length))) return true;

      if (
        word.includes("(") ||
        word.includes(")") ||
        word.includes("[") ||
        word.includes("]")
      ) {
        if (!word.includes("=")) return true;
      }

      return false;
    };

    function extractUrl(text) {
      let result = [];
      for (let i = 0; i < text.length; i++) {
        let c = text[i];
        let word = "";
        while (i <= text.length) {
          const invalidC = isInvalidCharacter(c);
          const invalidWord = invalidateUrl(word, c);
          if (invalidC || invalidWord) {
            if (invalidWord) word = word.slice(0, word.length - 1);
            i++;
            break;
          }

          if (i >= text.length) break;

          word += c;
          i++;
          c = text[i];
        }
        i--;
        result.push(word);
      }
      return result
        .filter((itm) => !!itm)
        .filter((itm) => /^(http|https|ftp):\/\/.*/.test(itm))
        .map((itm) => (itm.endsWith(".") ? itm.slice(0, itm.length - 1) : itm));
    }

    const linkify = (text) => {
      const answer = [];
      const parts = text.split(" ");
      for (const part of parts) {
        const partT = part.trim();
        if (/(https?:\/\/[^\s]+)/.test(partT)) {
          const urls = extractUrl(partT);
          let result = part;
          for (const url of urls) {
            const str = url.replace(/[-[\]/\{\}\(\)\*\+\?\^\$\.]/g, "\\$&");
            const exp = new RegExp(`(?<!href="|target="_blank">)${str}`);
            result = result.replace(
              exp,
              `<a href="${url}" target="_blank">${url}</a>`,
            );
          }
          answer.push(result);
        } else {
          answer.push(part);
        }
      }
      return answer.join(" ");
    };

    const ask = async (txt) => {
      loading = true;
      addChat({ type: "human", text: txt });
      await wait(0.3);
      toggleTyping();
      showEnd();

      try {
        let conversation = getConversation();
        conversation.push({ role: "user", content: txt?.trim() });

        const res = await axios.post(`/projects/ask/${props.projectId}`, {
          conversation,
          free_q,
          prevNode,
        });
        const text = res?.data.answer?.content || props.errorMsg;
        addChat({
          type: "bot",
          text: text,
        });
        prevNode = res?.data.nodeId;
      } catch (err) {
        console.error(err);
        addChat({
          type: "bot",
          text: props.errorMsg,
        });
      }

      toggleTyping();
      loading = false;

      free_q++;
      localStorage.setItem("gchat-free_q", free_q);

      if (free_q >= props.free_limit && !props.token) {
        disableChat();
        if (props.leadInfo) showAddContainer();
        else if (props.leadPhone || props.leadEmail) showEmailContainer();
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
      container.classList.add("chat-small");
      sessionStorage.setItem("gchat-closed", true);
    };

    const showEmailContainer = async () => {
      const last = chatHistory.length - 1;
      if (props.textAfterName && chatHistory[last]?.text !== props.textAfterName) {
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
      showEnd();
    };

    const showAddContainer = async () => {
      toggleTyping();
      await wait(1);
      toggleTyping();
      await wait(1);
      addChat({ type: "bot", text: props.textBeforeInfo });
      await wait(1);
      askAddCon.classList.remove("hide");
      showEnd();
    };

    const showAddForm = async () => {
      await wait(1);
      sellerForm.classList.remove("hide");
      showEnd();
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

      if (free_q + 1 > props.free_limit) {
        if (props.leadInfo) return showAddContainer();
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

      lead.info = `${lead.action}\n${what}\n${where}\n${capital}`;
      localStorage.setItem("gchat-lead-info", lead.info);

      sellerForm.classList.add("hide");

      if (!props.leadEmail && !props.leadPhone) {
        await handleLeadSubmit(askAddCon);
        return;
      }

      if (
        (props.leadPhone || props.leadEmail) &&
        free_q + 1 >= props.free_limit
      ) {
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
      showEnd();
      reset.classList.add("hide");
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
      showEnd();
      reset.classList.remove("hide");
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
        showEnd();
      } catch (err) {
        console.log(err);
      }
    };

    const validatePhone = (number) => {
      const min = props.minPhoneLength;
      const max = props.maxPhoneLength;

      if (number[0] === "+") number = number.replace("+", "");
      let n = number.replaceAll(" ", "");
      if (n.length < min) return [null, props.minPhoneError];
      if (n.length > max) return [null, props.maxPhoneError];
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

      if (lead.email) addChat({ type: "human", text: lead.email });
      if (lead.phone) addChat({ type: "human", text: lead.phone });

      await handleLeadSubmit(askEmailCon);
    };

    const toggleGdpr = () => {
      gdprInfo.classList.toggle("hide");
      askEmailCon.classList.toggle("hide");
    };

    const selectQuestion = (e) => {
      if (loading) return;
      const questionPr = e.target.closest(".g-question__con");
      const question = questionPr.querySelector(".g-question");
      ask(question.textContent);
      questionPr.remove();
      // check if there's none left
      const questions = Array.from(
        document.querySelectorAll(".g-question__con"),
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
      const parent = e.target.closest(".chat-confirm__info");
      const el = parent.querySelector(".chat-confirm__popup");
      el.classList.toggle("show-chat__popup");
    };

    const closeInfoPopups = () => {
      const nameEl = namePopup
        .closest(".chat-confirm__info")
        .querySelector(".chat-confirm__popup");
      nameEl.classList.remove("show-chat__popup");
      const emailEl = emailPopup
        .closest(".chat-confirm__info")
        .querySelector(".chat-confirm__popup");
      emailEl.classList.remove("show-chat__popup");
      const infoEl = infoPopup
        .closest(".chat-confirm__info")
        .querySelector(".chat-confirm__popup");
      infoEl.classList.remove("show-chat__popup");
    };

    const resetHistory = () => {
      if (loading) return;
      chatHistory = [];
      addChat({
        type: "bot",
        text:
          props.resetMsg ||
          "Chat has been reset, Now you can start a new conversation",
      });
      if (qcarousel) {
        const container = qcarousel.querySelector(".g-questions");
        const html = renderQ(props.questions);
        container.innerHTML = html;
        if (qcarousel.classList.contains("hide"))
          qcarousel.classList.remove("hide");
      }
      sessionStorage.removeItem("gchat-chat");
    };

    const handleSellBtn = (e) => {
      lead.action = e.target.textContent;
      addChat({ type: "human", text: lead.action });
      showAddForm();
      e.target.closest(".ask-additional-btns").classList.add("hide");
    };

    openIcon.addEventListener("click", toggle);
    closeIcon.addEventListener("click", closeOpenBar);
    cancelIcon.addEventListener("click", toggle);
    textSendBtn.addEventListener("click", handleSubmit);
    textInput.addEventListener("keydown", handleInput);
    addNameForm.addEventListener("submit", handleAddName);
    addEmailForm.addEventListener("submit", handleAddEmail);
    sellerForm.addEventListener("submit", handleAdditionalSubmit);
    sellBtn.addEventListener("click", handleSellBtn);
    buyBtn.addEventListener("click", handleSellBtn);
    gdprBtn.addEventListener("click", toggleGdpr);
    gdprClose.addEventListener("click", toggleGdpr);
    preQuestions?.addEventListener?.("click", selectQuestion);
    emailPopup.addEventListener("click", toggleInfoPopup);
    namePopup.addEventListener("click", toggleInfoPopup);
    infoPopup.addEventListener("click", toggleInfoPopup);
    reset.addEventListener("click", resetHistory);
    window.addEventListener("click", closeInfoPopups);
    window.addEventListener("resize", updateHeight);
    setCSSVariables();
    disableSafariZoom();
    if (sessionStorage.getItem("gchat-open") === "true") {
      toggle(false);
      showEnd();
    }
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", myEvent);
  else myEvent();
};

export default events;
