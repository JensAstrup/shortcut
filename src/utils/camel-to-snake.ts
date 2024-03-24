export default function camelToSnake(camelString: string): string {
    return camelString.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
