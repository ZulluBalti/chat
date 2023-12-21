import axios from "axios";

const mode = import.meta.env.MODE;
let URL;

if (mode === "development") 
  URL = `http://localhost:5000/api/v1`;
else if (mode === "production")
  URL = `https://live-chat-server-98e3b8b76741.herokuapp.com/api/v1`;
else 
  URL = `https://dev-live-chat-e7c53dd8a416.herokuapp.com/api/v1`;

const instance = axios.create({ baseURL: URL });

export default instance;
