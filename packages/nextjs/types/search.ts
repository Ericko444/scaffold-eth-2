export interface SearchDTO {
    prompt: string
}

export interface SearchDTOWithData {
    prompt: string,
    data: string[]
}

export interface SearchResponseItem {
    num: string,
    nom: string
}

export interface SearchResponse {
    data: SearchResponseItem[]
}