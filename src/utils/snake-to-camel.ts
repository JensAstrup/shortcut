export default function snakeToCamel(snakeString: string): string {
    return snakeString.replaceAll(/(_\w)/g, (k) => k[1].toUpperCase())
}
