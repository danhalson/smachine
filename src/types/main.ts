export type StateFunction = () => Promise<string> | string;

// Make initialState function mandatory
export interface States {
    [key: string]: StateFunction;
}

export interface StateVisits {
    [key: string]: number;
}

export interface StringMap {
    [key: string]: string;
}
export interface Tokens extends StringMap {}
export interface Strings extends StringMap {}