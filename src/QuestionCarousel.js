const question = q => `
          <div class="g-question__con">
            <p class="g-question">${q}</p>
          </div>`

const renderQ = (questions) => {
  return questions.map(itm => itm.trim()).filter(itm => !!itm).map(question).join("")
}

const QuestionCarousel = (props) => {
  const asked = JSON.parse(sessionStorage.getItem("gchat-q__asked")) || [];
  return `
    <div class="question-carousel hide">
      <div class="g-questions">${renderQ(props.questions.filter(itm => !asked.includes(itm)))}</div>
    </div>
`

}

export { QuestionCarousel, renderQ }
