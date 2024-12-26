import SSEClient from "../lib/SSEClient";
import { TypeChatMessage } from "../type/CustomTypes";
import AppStateUtil from "../utils/AppStateUtil";


class ChatApi {
    interactionId: string;
    sseController: any;
    accessToken: any;

    constructor() {
        this.interactionId = '';
        this.accessToken = (AppStateUtil.isVendorLoggedIn()) ? AppStateUtil.getVendorAuthToken() : AppStateUtil.getAuthToken()
    }

    async askQuestion(
        question: string,
        chatResponseType: string,
        callback?: (data: string) => void
    ): Promise<TypeChatMessage | null | void> {
        try {
            if (chatResponseType === 'stream' && callback) {
                return await this.getStreamResponse(question, callback);
            } else {
                // await this.getSingleResponse(question, conversationId);
            }
        } catch (error) {
            return null;
        }
    }

    async getStreamResponse(
        ask: string,
        callback: (data: string) => void
    ) {
        this.sseController = new AbortController();

        try {
            const sseClient = new SSEClient(this.sseController, this.accessToken);
            await sseClient.send({
                url: `${import.meta.env.VITE_SKAN_APP_API_BASE_URL}/chat`,
                payload: JSON.stringify(
                    { userQuery : ask }
                ),
                method: 'POST',
                callback,
                options: { retryCount: 3 },
            });
        } catch (e) {
            throw new Error('Failed to get response stream');
        }
    }

    async terminateStreaming() {
        this.sseController?.abort();
        // const { api } = new ApiClient(this.apiUrl, (!this.accessToken) && HHAuthUtil.getHHAccessToken() || DynUserUtil.getUserId());
        // try {
        //   await api.post(`${import.meta.env.VITE_SKAN_APP_API_BASE_URL}/chat`, {
        //     status: 'terminated',
        //   });
        // } catch (e) {
        //   throw new Error('Failed to terminate response stream');
        // }
    }
}

export default ChatApi;