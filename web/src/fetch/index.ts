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
    request?: Request,
    queryParams?: { paramKey: string, paramValue: string }[],
    params?: { paramKey: string, paramValue: string },
): Promise<Response> {
    let { url, method, authorized } = endpoint;
    const requestBody = request ? JSON.stringify(request) : undefined;
    if (queryParams?.length) {
        queryParams.forEach(({ paramKey, paramValue, }, index) => {
            url = url + `${index === 0 ? "?" : ""}${paramKey}=${paramValue}${index !== queryParams.length - 1 ? "&" : ""}`
        })
        // console.log("url", url)
    }
    if (params) {
        url = url.replace(`:${params.paramKey}`, params.paramValue)
    }

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