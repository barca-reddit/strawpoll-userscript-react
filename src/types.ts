export interface IPlayer {
    id: number;
    name: string;
    number: number;
    position: 'gk' | 'def' | 'mid' | 'att';
    photo: string;
    selected: boolean;
}

export interface IPlayerList {
    byId: {
        [key: IPlayer['number']]: IPlayer;
    }
    byPosition: {
        [key in IPlayer['position']]: IPlayer['number'][];
    }
    selectedCount: number;
}

export interface IModalProps {
    visible: boolean;
    page: 'settings' | 'poll' | 'results';
    poll: {
        title: string;
        titleEdited: boolean;
        url?: string;
    }
    players: IPlayerList;
    settings: IStrawpollSettings;
    request?: IRequest<IStrawpollAPIResponse | IDiscordWebhookResponse>;
    setVisible(): void;
    setPage({ page }: { page: 'settings' | 'poll' | 'results' }): void;
    setPlayers({ id }: { id?: IPlayerList['byId'][number]['id'] }): void;
    setSettings({ items }: { items: Partial<IModalProps['settings']> }): void;
    setRequest({ type }: { type?: 'strawpoll' | 'discord' }): Promise<void>;
    setPoll({ items }: { items: Partial<IModalProps['poll']> }): void;
    resetPoll(): void;
}

export type IRequest<T> =
    {
        state: 'fetching';
    } |
    {
        state: 'complete';
        payload: T
    } |
    {
        state: 'error';
        payload: Response | Error;
    }

export interface IContainerProps {
    children: JSX.Element | JSX.Element[];
}

export interface IStrawpollSettings {
    strawpollKey?: string;
    strawpollExpiry?: number;
    discordWebhook?: string;
    darkMode?: boolean;
}

interface IStrawpollAPIRequestMediaOptions {
    id: string;
    type: 'image' | 'video' | 'youtube' | 'giphy';
    source: string;
    url: string;
    width: number;
    height: number;
}

interface IStrawpollAPIRequestPollOptions {
    id?: string;
    position?: number;
    max_votes?: number;
    description?: string;
}

/** 
 * Request parameters for Strawpoll.com `createPoll` endpoint
 * @see https://strawpoll.com/docs/api/strawpoll-api-v3.html#/operations/createPoll
 */
export interface IStrawpollAPIRequest {
    title: string;
    media?: IStrawpollAPIRequestMediaOptions;
    poll_options: IStrawpollAPIRequestPollOptions & (
        {
            type: 'text',
            value: string
        } |
        {
            type: 'image',
            media: IStrawpollAPIRequestMediaOptions;
            value: string
        } |
        {
            type: 'date';
            date: string;
        } |
        {
            type: 'time_range'
            start_time: number
            end_time: number;
        }
    )[]
    poll_config?: {
        is_private?: boolean;
        vote_type?: 'default' | 'box_small' | 'participant_grid';
        allow_comments?: boolean;
        allow_indeterminate?: boolean;
        allow_other_option?: boolean;
        custom_design_colors?: object;
        deadline_at?: number;
        duplication_checking?: 'ip' | 'session' | 'invite' | 'none';
        allow_vpn_users?: boolean;
        edit_vote_permissions?: string;
        force_appearance?: string;
        hide_participants?: boolean;
        is_multiple_choice?: boolean;
        multiple_choice_min?: number;
        multiple_choice_max?: number;
        number_of_winners?: number;
        randomize_options?: boolean;
        require_voter_names?: boolean;
        results_visibility?: 'always' | 'after_deadline' | 'after_vote' | 'never';
        use_custom_design?: boolean;
    },
    poll_meta?: {
        description?: string;
        location?: string;
        timezone?: string;
    },
    type: 'multiple_choice' | 'meeting' | 'ranked_choice';
}

/** 
 * Request parameters for Discord webhooks
 * @see https://discord.com/developers/docs/resources/webhook#execute-webhook
 */
export interface IDiscordWebhookRequest {
    content: string;
}

export interface IStrawpollAPIResponse {
    title: string;
    url: string;
    user?: {
        id?: string;
    }
}

export type IDiscordWebhookResponse = Response;

declare interface ViolentMonkey {
    /**
     * An object that exposes information about the current userscript.
     * @see https://violentmonkey.github.io/api/gm/#gm_info
     */
    info: {
        /** A unique ID of the script. */
        uuid: string;
        /** The meta block of the script. */
        scriptMetaStr: string;
        /** Whether the script will be updated automatically. */
        scriptWillUpdate: boolean;
        /** The name of userscript manager, which should be the string Violentmonkey. */
        scriptHandler: string;
        /** Version of Violentmonkey. */
        version: string;
        /**
         * Unlike `navigator.userAgent`, which can be overriden by other extensions/userscripts
         * or by devtools in device-emulation mode, `GM_info.platform` is more reliable as the
         * data is obtained in the background page of Violentmonkey using a specialized extension
         * API (browser.runtime.getPlatformInfo and getBrowserInfo).
         */
        platform: {
            arch: 'arm' | 'mips' | 'mips64' | 'x86-32' | 'x86-64';
            browserName: string;
            browserVersion: string;
            os: 'android' | 'cros' | 'linux' | 'mac' | 'openbsd' | 'win';
        }
        script: {
            /** A brief summary to describe the script. */
            description: string;
            /** The old way to decide whether a script should be executed. */
            excludes: string[];
            /** If supplied, the home icon in the user scripts list will link to this. */
            homepageURL?: string;
            /** Specify an icon for the script. */
            icon?: string;
            /** The old way to decide whether a script should be executed. */
            includes: string[];
            /** 
             * Define rules to decide whether a script should be executed. It is recommended to
             * use @match instead of @include.
             */
            matches: string[];
            /**
             * The name of the script, shown in script list and menus. It must be unique within
             * a `@namespace`. If a script is being installed, and a script with the same
             * `@namespace` and `@name` already exists, it will be replaced by the new one.
             * Creating a script with same `@namespace` and `@name` will cause a conflict error.
             */
            name: string;
            /**
             * The combination of `@namespace` and `@name` is the unique identifier for a userscript.
             * `@namespace` can be any string, for example the homepage of a group of userscripts by
             * the same author. If not provided the `@namespace` falls back to an empty string (`''`).
             */
            namenamespace: string;
            /**
             * Some static resources that can be accessed in the script by `GM_getResourceText` and
             * `GM_getResourceURL`. The value is composed of two parts, joined with one or more
             * white spaces. The first part is the name of the resource, no white space is allowed
             * in it. The second part is the URL to the resource, which may be relative to the URL
             * the script is being installed from.
             * 
             * The resource will be downloaded along with installation and can be accessed when
             * the script executes.
             * 
             * @example ```@resource logo https://my.cdn.com/logo.png```
             * @example ```@resource text https://my.cdn.com/some-text.txt```
             */
            resources: { name: string, url: string }[];
            /**
             * Decide when the script will execute.
             */
            runAt: 'document-end' | 'document-start' | 'document-idle';
            /**
             * Version of the script, it can be used to check if a script has new versions. It is
             * composed of several parts, joined by `.`. Each part must start with numbers, and
             * can be followed by alphabetic characters.
             * @remarks Note: If no `@version` is specified, the script will not be updated automatically.
             */
            version: string;
        }
        /** The injection mode of current script. */
        injectInto: string;
    };

    /**
     * Retrieves a value for current script from storage.
     * @example let value = GM.getValue(key, defaultValue)
     * @see https://violentmonkey.github.io/api/gm/#gm_getvalue
     */
    getValue<T extends keyof IStrawpollSettings>(key: T): Promise<IStrawpollSettings[T] | undefined>;
    getValue<T extends keyof IStrawpollSettings, V extends any>(key: T, defaultValue?: V): Promise<IStrawpollSettings[T] | V>;

    /**
     * Sets a key / value pair for current script to storage.
     * @example GM.setValue(key, value)
     * @see https://violentmonkey.github.io/api/gm/#gm_setvalue
     */
    setValue<T extends keyof IStrawpollSettings, V extends IStrawpollSettings[T]>(key: T, value: V): Promise<void>;

    /**
     * Deletes an existing key / value pair for current script from storage.
     * @example GM.deleteValue(key)
     * @see https://violentmonkey.github.io/api/gm/#gm_deletevalue
     */
    deleteValue<T extends keyof IStrawpollSettings>(key: T): Promise<void>;

    /**
     * Returns an array of keys of all available values within this script.
     * @example let arrayOfKeys = GM.listValues()
     * @see https://violentmonkey.github.io/api/gm/#gm_listvalues
     */
    listValues(): Promise<(keyof IStrawpollSettings)[]>;

    /**
     * Appends and returns a `<style>` element with the specified CSS.
     * @example let styleElement = GM.addStyle(css);
     * @see https://violentmonkey.github.io/api/gm/#gm_addstyle
     */
    addStyle(css: string): Promise<void>;
}

declare global {
    const GM: {
        getValue: ViolentMonkey['getValue'];
        setValue: ViolentMonkey['setValue'];
        deleteValue: ViolentMonkey['deleteValue'];
        listValues: ViolentMonkey['listValues'];
        addStyle: ViolentMonkey['addStyle'];
        info: ViolentMonkey['info'];
    };
}