import process from 'process'


export function getHeaders(): Record<string, string> {
  if (process.env.SHORTCUT_API_KEY === undefined) throw new Error('Shortcut API Key not found')
  return {
    'Content-Type': 'application/json',
    'Shortcut-Token': process.env.SHORTCUT_API_KEY
  }
}
