export interface SearchDTO {
    prompt: string
}

export interface SearchDTOWithData {
    prompt: string,
    data: string[],
    contexts: string[]
}

export interface SearchResponseItem {
    num: string,
    nom: string
}

export interface SearchResponse {
    contexte: string,
    terrains: SearchResponseItem[],
    usedData: string[]
}