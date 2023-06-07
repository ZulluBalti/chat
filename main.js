import './style.css'
import renderer from './src/renderer'
import events from './src/events'

document.body.insertAdjacentHTML("beforeend", renderer());
events();
