export interface Entrega {
  id: number;
  guia: any;
  numero: number;
  fecha: string;
  documento: string;
  destinatario: string;
  destinatario_direccion: string;
  destinatario_direccion_formato: string;
  ciudad_id?: number;
  ciudad_nombre: string;
  destinatario_telefono: string;
  destinatario_correo: any;
  peso: number;
  volumen: number;
  tiempo: number;
  tiempo_servicio: number;
  tiempo_trayecto: number;
  estado_decodificado: boolean;
  estado_decodificado_alerta: boolean;
  estado_despacho: boolean;
  estado_entregado: boolean;
  estado_sincronizado: boolean;
  estado_novedad:boolean;
  estado_error: boolean;
  mensaje_error: string;
  novedad_tipo: string;
  novedad_descripcion: string;
  latitud: number;
  longitud: number;
  orden: number;
  distancia: number;
  franja_id: any;
  franja_codigo: any;
  despacho_id: number;
  resultados: Resultado[];
  seleccionado: boolean;
  arrImagenes: { uri: string }[];
  firmarBase64: string | null;
}

export interface Resultado {
  types: string[];
  geometry: Geometry;
  place_id: string;
  partial_match?: boolean;
  formatted_address: string;
  navigation_points?: NavigationPoint[];
  address_components: AddressComponent[];
  plus_code?: PlusCode;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
  location_type: string;
  bounds?: Bounds;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Bounds {
  northeast: Northeast2;
  southwest: Southwest2;
}

export interface Northeast2 {
  lat: number;
  lng: number;
}

export interface Southwest2 {
  lat: number;
  lng: number;
}

export interface NavigationPoint {
  location: Location2;
  road_name: string;
}

export interface Location2 {
  latitude: number;
  longitude: number;
}

export interface AddressComponent {
  types: string[];
  long_name: string;
  short_name: string;
}

export interface PlusCode {
  global_code: string;
  compound_code: string;
}

