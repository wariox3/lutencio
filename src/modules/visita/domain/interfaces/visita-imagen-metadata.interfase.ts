export interface ImagenMetaData {
    uri: string
    localizacionNombre: string | undefined;
    latitude: number | undefined,
    longitude: number | undefined,
    fecha: string;
    hora: string;
    mapColor?: string;
}