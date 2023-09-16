import Angle from './icons/Angle'
import Tap from './icons/Tap'

const question = q => `
          <div class="g-question__con">
            <p class="g-question">${q}</p>
            <span>${Tap()}</span>
          </div>`

const renderQ = (questions) => {
  return questions.map(itm => itm.trim()).filter(itm => !!itm).map(question).join("")
}

const QuestionCarousel = (props) => {
  return `
    <div class="question-carousel hide">
      <span class="q-left">${Angle()}</span>
      <div class="g-questions">${renderQ(props.questions)}</div>
      <span class="q-right">${Angle()}</span>
    </div>
`

}

export { QuestionCarousel, renderQ }
