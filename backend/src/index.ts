import app from './app'
import { PORT } from './env'
import { AppDataSource } from './data-source'

app.listen(PORT, () => {
  const terminalWidth = process.stdout.columns || 80
  const terminalLine = '─'.repeat(terminalWidth)

  AppDataSource.initialize()
    .then(() => {
      console.log(terminalLine)
      console.log('Server running in the port: ' + PORT)
      console.log('Database running successfully!')
      console.log(terminalLine)
    })
    .catch((err) => {
      console.log(terminalLine)
      console.log('Server running in the port: ' + PORT)
      console.error('Database running not successfully with error is:', err)
      console.log(terminalLine)
    })
})
