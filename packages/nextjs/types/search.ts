export interface SearchDTO {
    prompt: string
}

export interface SearchResponseItem {
    num: string,
    nom: string
}

export interface SearchResponse {
    data: SearchResponseItem[]
}