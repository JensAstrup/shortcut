import axios from 'axios'

export default async function getMentionName(memberId: string): Promise<string> {
    const url = `https://api.app.shortcut.com/api/v3/members/${memberId}`

    const headers = {
        'Content-Type': 'application/json',
        'Shortcut-Token': process.env.SHORTCUT_API_KEY || ''
    }

    const response = await axios.get(url, {headers})
    if (response.status >= 400) {
        throw new Error('HTTP error ' + response.status)
    }
    return response.data['profile']['mention_name']
}
