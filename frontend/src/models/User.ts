export default class User {
    id: string;
    name: string;
    latency: number = 0;
    hotseatTime: string = '';

    constructor(data?: Partial<User>) {
        Object.assign(this, data);
    }

    /**
     * Helper method to truncate the user's name
     * @param length    The maximum length of the name
     * @returns 
     */
    truncateName(length: number): string {
        if (this.name.length <= length) {
            return this.name;
        }

        return this.name.substr(0, length) + '...';
    }
}