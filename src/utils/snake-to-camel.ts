export default function snakeToCamel(snakeString: string): string {
  const SECOND_LETTER = 1
  return snakeString.replaceAll(/(_\w)/g, (word) => word[SECOND_LETTER].toUpperCase())
}
