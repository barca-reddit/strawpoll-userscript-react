import type { IStrawpollAPIRequest, IDiscordWebhookRequest, IStrawpollAPIResponse, IDiscordWebhookResponse, IModalProps, IPlayer } from '../types.js';

const fetchWrapper = async<T extends { [key: string]: any }, R>({ url, body, key, toJson }: { url: string, body: T, key?: string, toJson?: boolean, }): Promise<R> => {
    const req = await fetch(url, {
        method: 'post',
        credentials: 'omit',
        headers: {
            'Content-type': 'application/json',
            ...key && { 'X-API-Key': key }
        },
        body: JSON.stringify(body),
    });

    if (!req.ok || req.status >= 300) {
        throw req;
    }

    if (toJson) {
        return await req.json();
    }

    return req as unknown as R;
};

export const postStrawpoll = async (title: IModalProps['poll']['title'], players: IModalProps['players'], settings: IModalProps['settings'],): Promise<IStrawpollAPIResponse> => {
    const position = (pos: IPlayer['position']) => {
        switch (pos) {
            case 'gk': return 1;
            case 'def': return 2;
            case 'mid': return 3;
            case 'att': return 4;
        }
    };

    const pollOptions =
        Object.values(players.byId)
            .filter(p => p.selected)
            .map(p => ({ ...p, position: position(p.position) }))
            .sort((a, b) => a.number - b.number)
            .sort((a, b) => a.position - b.position)
            .map<IStrawpollAPIRequest['poll_options'][number]>(p => ({ type: 'text', value: p.name }));

    return await fetchWrapper<IStrawpollAPIRequest, IStrawpollAPIResponse>({
        // url: 'http://localhost:8000/strawpoll',
        url: 'https://api.strawpoll.com/v3/polls',
        body: {
            title: title,
            type: 'multiple_choice',
            poll_options: pollOptions,
            poll_config: {
                allow_other_option: false,
                allow_vpn_users: true,
                duplication_checking: 'ip',
                ...settings.strawpollExpiry && settings.strawpollExpiry > 0 && {
                    deadline_at: Math.round((Date.now() + (settings.strawpollExpiry * 3600000)) / 1000)
                }
            },
        },
        key: settings.strawpollKey,
        toJson: true,
    });
};

export const postDiscordWebhook = async (webhookUrl: string, poll: IModalProps['poll']): Promise<IDiscordWebhookResponse> => {
    return await fetchWrapper<IDiscordWebhookRequest, IDiscordWebhookResponse>({
        // url: 'http://localhost:8000/discord',
        url: webhookUrl,
        body: { content: `**${poll.title}**\n\nPlease vote for your MOTM:\n\n${poll.url}` },
        toJson: false
    });
};