import { config } from './config.js'

export const showHistory = () => {
  const history = config.get('history') || []

  if (history.length === 0) {
    console.log('no history yet')
  }

  history.forEach(h => {
    const hasCardNumber = h.card.number
    console.log(hasCardNumber ?
      `${new Date(h.date).toLocaleString()}  [${h.username}] #${h.card.number} ${h.type}: ${h.description}` :
      `${new Date(h.date).toLocaleString()}  ${h.type}: ${h.description}`)
  })
}
