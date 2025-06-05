export interface MapResponse {
  text: string;
  mapEmbed: string;
  reply: string;
}

export interface ChatMessageWithMap extends MapResponse {
  type: 'map';
} 