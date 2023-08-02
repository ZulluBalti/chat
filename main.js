import jwtDecode from 'jwt-decode';
import renderer from './src/renderer'
import events from './src/events'
import axios from './src/axios'
import './src/assets/style.css'
import './src/assets/ask-name.css';
import './src/assets/carousel.css';
import './src/assets/footer.css';
import './src/assets/chat-indicator.css';
import './src/assets/chat-main.css';

const getSettings = async (project) => {
  try {
    const res = await axios.get(`/ux/${project}/chat-settings`);
    return res.data.data.settings;
  }catch(err) {
   console.log(err)
  }
} 

const isLoggedIn = () => {
  const token = localStorage.getItem('gchat-token');
  const name = localStorage.getItem('gchat-lead-name');
  if (!token) return {};

  const decoded = jwtDecode(token);
  const expire = new Date(decoded.exp * 1000).getTime()
  const now = new Date().getTime();
  if (now < expire)
    return {name, token};

  localStorage.removeItem('gchat-token');
  localStorage.removeItem('gchat-lead-name');
  return {};
}

const Chat = async (project) => {
  const config = await getSettings(project);  
  config.projectId = project; 
  const auth = isLoggedIn();
  config.token = auth.token;
  config.userName = auth.name;

  const root = document.querySelector(':root');
  root.style.setProperty('--gchat-color', config.color);
  root.style.setProperty('--gchat-accent-color', config.accentColor);

  document.body.insertAdjacentHTML("beforeend", renderer(config));
  const size = window.innerWidth > 500 ? "3em" : "0"
  document.getElementById('chat-container').style[config.position] = size;

  events(config);
}

Chat("64c8b9d4738a40224d0e1279");
// export default Chat;
