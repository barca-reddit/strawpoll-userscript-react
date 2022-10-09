import type { IStrawpollSettings } from '../types.js';

export class Storage {
    public static async getAll() {
        const keys = await GM.listValues();

        const data = await Promise.all(keys.map(async key => {
            return { [key]: await GM.getValue(key) };
        }));

        return Object.assign({}, ...data) as IStrawpollSettings;
    }

    public static async deleteAll() {
        const keys = await GM.listValues();

        await Promise.all(keys.map(async key => {
            return await GM.deleteValue(key);
        }));
    }

    public static async setValues({ items }: { items: Partial<IStrawpollSettings> }) {
        for (const [key, value] of Object.entries(items)) {
            await GM.setValue(key as keyof IStrawpollSettings, value);
        }
    }
}