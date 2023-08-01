import axios from 'axios'

let URL;
if (import.meta.env.DEV)
  URL = `http://localhost:5000/api/v1`;
else URL = `https://live-chat-server-98e3b8b76741.herokuapp.com/api/v1`;

const instance = axios.create({baseURL: URL});

export default instance;
