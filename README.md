# Shortcut API Client
[![npm version](https://badge.fury.io/js/shortcut-api.svg)](https://badge.fury.io/js/shortcut-api)
[![codecov](https://codecov.io/gh/JensAstrup/shortcut/graph/badge.svg?token=CteCCD1D6w)](https://codecov.io/gh/JensAstrup/shortcut)

[Full Documentation](https://jensastrup.github.io/shortcut/)

This is an object-oriented Node.js client for interacting with the Shortcut (formerly Clubhouse) REST API. 
It simplifies the process of making requests to the API by providing a set of easy-to-use classes and methods. 

## Features
1. OOP Design: Provides classes for interacting with the Shortcut API, such as `Client`, `Story`, `Iteration`, `Member`, and `Workflow`.
2. Stats: Provides additional stats on stories, such as the cycle time and lead time of individual stories.
3. Type conversions: Automatically converts API responses to JavaScript objects (such as Dates and API resources).
4. Caching: Caches API responses when member or workflow data is requested, reducing subsequent requests.

The structure of the client is designed to be intuitive and easy to use. Depending on your use case,
it can help you reduce the amount of code you need to write in order to interact with the Shortcut
API.

### Example Usage

Navigating between related resources is simplified:

```typescript
const client: Client = new Client()
const story: Story = await client.stories.get('story-id')
const epic: Epic = await story.epic
const owners: Member[] = await epic.owners
const team: Team = await story.team

// Now with that team, we can navigate easily to the team's members
const members: Member[] = await team.members
````

compared to the standard Shortcut Client:

```typescript
const shortcut = new ShortcutClient();
const story = await shortcut.getStory(storyId);
let epic, owners, team;

if (story.epic_id) {
    epic = await shortcut.getEpic(story.epic_id);
}
for (const ownerId of story.owner_ids) {
    ownerDetails = await shortcut.getMember(ownerId);
    owners.push(ownerDetails);
}

if (story.group_id) {
    team = await shortcut.getGroup(story.group_id);
}
````

And taking actions on resources is intuitive, here's how you leave a comment on a story:

```typescript
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const client: Client = new Client()
const stories: Story[] = await client.stories.search('team:engineering is:started')
const outdatedStories: Story[] = stories.filter(story => story.updatedAt < oneWeekAgo)

for (const story of outdatedStories) {
    const comment = 'This story has not been updated in over a week. Please provide an update.'
    await story.comment(comment)
}
````

Using the standard Shortcut Client:

```typescript
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const shortcut = new ShortcutClient();
const {data} = await shortcut.searchStories('team:engineering is:started');
const outdatedStories = stories.filter(story => new Date(story.updated_at) < oneWeekAgo)

for (const story of outdatedStories) {
    const comment = 'This story has not been updated in over a week. Please provide an update.'
    await shortcut.createComment(story.id, {text: comment})
}
````




## Installation

To use the Shortcut API Client in your project, you'll need to have Node.js 18+ installed. 
Once Node.js is set up, you can install the client via npm:

```bash
npm install shortcut-api
```

Or, if you prefer using Yarn:

```bash
yarn add shortcut-api
```

## Configuration

This client requires a Shortcut API key to make requests to the API. You can generate an API key from your Shortcut account settings. 
Once you have your API key, you can pass it to the client when initializing it, or set it as an environment variable:

```bash
export SHORTCUT_API_KEY=YOUR_API_KEY
```

Or

```javascript
const client = new Client('YOUR_API_KEY')
```

## Usage

Full documentation for the package can be found [here](https://jensastrup.github.io/shortcut/).

Full documentation for the Shortcut API can be found [here](https://shortcut.com/api/rest/v3/).

### Searching Stories

```typescript
const client: Client = new Client()
const stories: Story[] = await client.stories.search('team:engineering is:started')
console.log(stories)
```

### Commenting on a Story

_Also available on epics_

```typescript
const client: Client = new Client()
const story: Story = await client.stories.get('story-id')
const comment = await story.comment('This is a comment')
````

### Listing Iterations

```typescript
const client: Client = new Client();
const iterations: Iteration[] = await client.iterations.list();
console.log(iterations);
```

### Creating an Iteration

```typescript
const client: Client = new Client();
const startDate = new Date(2022, 1, 1);
const endDate = new Date(2022, 1, 14);
const iteration: Iteration = new Iteration({
    name: 'Sprint 1',
    start_date: startDate,
    end_date: endDate,
})
await iteration.save()
````

### Delete a label

```typescript
const client: Client = new Client();
const label: Label = await client.labels.get('label-id');
await label.delete();
````

### Get a Team

```typescript
const client: Client = new Client();
const team: Team = await client.teams.get('team-id');
console.log(team);
````

The syntax for all types is shared, so you can use the same methods for stories, iterations,
members, workflows, teams, etc.
Some methods are specific to certain types, such as `comment` for stories and epics. Refer to the
full documentation for more information.

## Contributing

We welcome contributions to make this client better! If you're interested in contributing, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and write tests if applicable.
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Special thanks to the Shortcut team for providing the API.

## Questions or Feedback

If you have any questions or feedback about the Shortcut API Client, please open an issue on GitHub.
```
