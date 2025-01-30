import { SearchResponse } from "./search";

export interface chatItem {
    id: number,
    prompt: string,
    response: string,
    data: string[]
}