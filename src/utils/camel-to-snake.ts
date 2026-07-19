function camelToSnake(camelString: string): string {
  return camelString.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export { camelToSnake as default }

