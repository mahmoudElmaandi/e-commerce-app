import { EndpointsConfigs } from "@ecommerce/shared";
import { ROOTENDPOINT } from "../env";

export const LOCAL_STORAGE_JWT = 'jwtToken';

export const getLocalStorageJWT = (): string => {
    return localStorage.getItem(LOCAL_STORAGE_JWT) || '';
};

export const isLoggedIn = (): boolean => {
    return !!getLocalStorageJWT();
};

export const singup = async (username: string, email: string, password: string): Promise<Response> => {

    const response = await fetch(`${ROOTENDPOINT}${EndpointsConfigs.signup.url}`, {
        method: EndpointsConfigs.signup.method,
        headers: {
            'Content-Type': 'application/json',
            ...((isLoggedIn()) && { Authorization: `Bearer ${getLocalStorageJWT()}` }),
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    console.log(data)

    if (response.status === 403) {
        throw new Error(data.error)
    };

    if (response.status === 200) {
        localStorage.setItem(LOCAL_STORAGE_JWT, data.jwt)
    };

    return {} as Response
};

export const singin = async (login: string, password: string): Promise<Response> => {

    const response = await fetch(`${ROOTENDPOINT}${EndpointsConfigs.signin.url}`, {
        method: EndpointsConfigs.signin.method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password })
    });

    const data = await response.json();

    if (response.status === 403) {
        throw new Error(data.error)
    };

    if (response.status === 200) {
        localStorage.setItem(LOCAL_STORAGE_JWT, data.jwt)
    };

    return {} as Response
}

export const signout = () => {
    localStorage.removeItem(LOCAL_STORAGE_JWT);
    window.location.replace('/signin')
};
