export interface LocationMapping {
  addressParts: LocationPart[];
  coordinates?: number[];
}
interface LocationPart {
  placeType: string;
  text: string;
}
