import jwtDecode from "jwt-decode";
import renderer from "./src/renderer";
import events from "./src/events";
import axios from "./src/axios";
import main_style from "./src/assets/style.css?inline";
import name_style from "./src/assets/ask-name.css?inline";
import carousel_style from "./src/assets/carousel.css?inline";
import footer_style from "./src/assets/footer.css?inline";
import chat_ind_style from "./src/assets/chat-indicator.css?inline";
import chat_style from "./src/assets/chat-main.css?inline";

const getSettings = async (project) => {
  if (!project) return null;
  try {
    const res = await axios.get(`/ux/${project}/chat-settings`);
    return res.data.data.settings;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const isLoggedIn = () => {
  const token = localStorage.getItem("gchat-token");
  const name = localStorage.getItem("gchat-lead-name");
  const visited = localStorage.getItem("gchat-visited");
  if (!token) return { visited };

  const decoded = jwtDecode(token);
  const expire = new Date(decoded.exp * 1000).getTime();
  const now = new Date().getTime();
  if (now < expire) {
    axios.defaults.headers.post["authorization"] = `Bearer ${token}`;
    return { name, token };
  }

  localStorage.removeItem("gchat-token");
  localStorage.removeItem("gchat-lead-name");
  localStorage.removeItem("gchat-conversation");
  return {};
};

const Chat = async (project) => {
  const config = await getSettings(project);
  if (!config) return;
  config.projectId = project;

  const auth = isLoggedIn();
  config.token = auth.token;
  config.userName = auth.name;
  config.visited = auth.visited;
  if (!config.enabled) return;

  const host = document.createElement("div");
  host.setAttribute("id", "gchat-host");
  document.body.appendChild(host);

  const font = document.createElement("link")
  font.setAttribute("rel", "stylesheet")
  font.setAttribute("type", "text/css")
  font.setAttribute("href", "https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;800&display=swap")
  document.head.appendChild(font);

  const shadow = host.attachShadow({ mode: "closed" });
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`${main_style} ${name_style} ${carousel_style} ${footer_style} ${chat_ind_style} ${chat_style}`);

  shadow.adoptedStyleSheets = [sheet]
  shadow.innerHTML = renderer(config);

  const container = shadow.getElementById("chat-container");
  container.classList.add(`chat-${config.position}`);
  
  events(config, shadow);
};

if (import.meta.env.MODE === "developement")
  Chat("6583fc30ca9fb4b3cccd0340"); // stage
  // Chat("656ffb2d3d7414cf8981539f");
  // Chat("650d9cfe7fb69583f1fc2514"); // live 


export default Chat;
