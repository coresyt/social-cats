import 'dotenv/config'

const errorMessage = (x: string) => `I forgot to put the env called "${x}"`

const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD
if (typeof MYSQL_ROOT_PASSWORD !== 'string') throw new Error(errorMessage('MYSQL_ROOT_PASSWORD'))

  const MYSQL_DATABASE = process.env.MYSQL_DATABASE
if (typeof MYSQL_DATABASE !== 'string') throw new Error(errorMessage('MYSQL_DATABASE'))

  const MYSQL_PORT = Number(process.env.MYSQL_PORT)
if (typeof MYSQL_PORT !== 'number') throw new Error(errorMessage('MYSQL_PORT'))

  const MYSQL_HOST = process.env.MYSQL_HOST
if (typeof MYSQL_HOST !== 'string') throw new Error(errorMessage('MYSQL_HOST'))

  const SECRET_KEY = process.env.SECRET_KEY
if (typeof SECRET_KEY !== 'string') throw new Error(errorMessage('SECRET_KEY'))

  const PORT = process.env.PORT || 3000

export {
  MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_HOST, 
  MYSQL_PORT, 
  SECRET_KEY,
  PORT,
}
