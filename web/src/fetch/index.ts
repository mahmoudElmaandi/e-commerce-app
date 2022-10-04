import { EndpointConfig, ERRORS } from "@ecommerce/shared";
import { getLocalStorageJWT, isLoggedIn, signout } from "./auth";
import { ROOTENDPOINT } from "../env";

export class ApiError extends Error {
    public status: number;

    constructor(status: number, msg: string) {
        super(msg);
        this.status = status;
    }
};

export async function callEndpoint<Request, Response>(
    endpoint: EndpointConfig,
    request?: Request
): Promise<Response> {
    const { url, method, authorized } = endpoint;
    const requestBody = request ? JSON.stringify(request) : undefined;
    const response = await fetch(`${ROOTENDPOINT}${url}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...((authorized || isLoggedIn()) && { Authorization: `Bearer ${getLocalStorageJWT()}` }),
        },
        body: requestBody,
    });
    if (!response.ok) {
        let msg = '';
        try {
            msg = (await response.json()).error;
            if (msg === ERRORS.TOKEN_EXPIRED) {
                signout();
                window.location.reload();
            }
        } finally {
            throw new ApiError(response.status, msg);
        }
    }
    const isJson = response.headers.get('content-type')?.includes('application/json');
    return isJson ? ((await response.json()) as Response) : ({} as Response);
}