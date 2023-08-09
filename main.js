import jwtDecode from "jwt-decode";
import renderer from "./src/renderer";
import events from "./src/events";
import axios from "./src/axios";
import "./src/assets/style.css";
import "./src/assets/ask-name.css";
import "./src/assets/carousel.css";
import "./src/assets/footer.css";
import "./src/assets/chat-indicator.css";
import "./src/assets/chat-main.css";

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

  document.body.insertAdjacentHTML("beforeend", renderer(config));
  const container = document.getElementById("chat-container");
  container.classList.add(config.position);

  events(config);
};

// Chat("64d0ad4cd3416f0d3be4032e");
export default Chat;
