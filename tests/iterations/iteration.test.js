import Iteration from '../../src/iterations/iteration'

class ShortcutResource {}
class Label {}
class IterationStats {}

describe('Iteration class', () => {
    it('should have the correct baseUrl static property', () => {
        expect(Iteration.baseUrl).toBe('https://api.app.shortcut.com/api/v3/iterations');
    });

    it('should properly initialize with given properties', () => {
        const mockInitObject = {
            appUrl: 'https://app.shortcut.com/iteration/123',
            createdAt: new Date(),
            endDate: '2023-12-31',
            entityType: 'iteration',
            followerIds: ['f1', 'f2'],
            groupIds: ['g1', 'g2'],
            groupMentionIds: ['gm1', 'gm2'],
            id: 123,
            labelIds: [1, 2],
            labels: [new Label(), new Label()],
            memberMentionIds: ['mm1', 'mm2'],
            mentionIds: ['m1', 'm2'],
            name: 'Iteration 1',
            startDate: new Date(),
            stats: new IterationStats(),
            status: 'started',
            updatedAt: new Date(),
        };

        const iteration = new Iteration(mockInitObject);

        Object.entries(mockInitObject).forEach(([key, value]) => {
            expect(iteration[key]).toEqual(value);
        });
    });

    it('should have createFields static array with specific fields', () => {
        const expectedFields = ['name', 'startDate', 'endDate', 'labels'];
        const iteration = new Iteration({});
        expect(iteration.createFields).toEqual(expect.arrayContaining(expectedFields));
        expect(iteration.createFields.length).toBe(expectedFields.length);
    });
});
