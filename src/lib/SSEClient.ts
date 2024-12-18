import { fetchEventSource } from '@microsoft/fetch-event-source';

type TypeSendParam = {
    url: string;
    payload: string;
    method?: string;
    callback: (data: string) => void;
    headers?: {
        [key: string]: string;
    };
    options?: {
        [key: string]: string | number;
    };
};

class SSEClient {
    sseController: AbortController;
    accessToken?: string;
    retryCounter: number;

    constructor(controller: AbortController, accessToken?: string) {
        this.sseController = controller;
        this.accessToken = accessToken;
        this.retryCounter = 0;
    }

    handleError(params: TypeSendParam, callback: (data: string) => void, msg: string) {
        this.retryCounter++;
        const { options = {} } = params;
        if (
            options['retryCount'] &&
            typeof options['retryCount'] === 'number' &&
            this.retryCounter < options['retryCount']
        ) {
            this.send(params);
        } else {
            this.sseController.abort();
            callback(JSON.stringify({ error: true }));
            throw new Error(msg);
        }
    }

    async send(params: TypeSendParam) {
        const { url, payload, method = 'POST', callback, headers = {} } = params;
        const defaultHeaders: {
            [key: string]: string;
        } = {
            'Content-Type': 'application/json',
        };

        if (this.accessToken) {
            defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const _self = this;
        await fetchEventSource(url, {
            method,
            openWhenHidden: true,
            headers: { ...defaultHeaders, ...headers },
            signal: this.sseController.signal,
            body: payload,
            async onopen(response) {
                if (response.ok) {
                    return;
                } else if (response.status === 401 || response.status === 429) {
                    let limitType = '';
                    let limitValue = 0;
                    const { headers } = response;
                    const retryAfter = headers.get('Retry-After');
                    const renewalPeriod = headers.get('renewal-period');

                    if (retryAfter) {
                        limitType = 'per_minute';
                        limitValue = Number(retryAfter);
                    } else if (renewalPeriod) {
                        limitType = 'per_day';
                        limitValue = Number(renewalPeriod);
                    }

                    _self.sseController.abort();
                    callback(
                        JSON.stringify({
                            error: true,
                            status: response.status,
                            content: {
                                key: limitType,
                                value: limitValue,
                                message: headers.get('Errormessage'),
                            },
                        })
                    );
                    return;
                } else {
                    _self.handleError(params, callback, 'SSE connection failed');
                }
            },
            onmessage({ data, event }) {
                try {
                    callback(data);
                } catch (e) {
                    _self.handleError(params, callback, 'SSE Data error');
                }
                if (event === 'FatalError') {
                    _self.handleError(params, callback, 'SSE Data error');
                }
            },
        });
    }
}

export default SSEClient;
