import { Usuario } from "@/src/modules/user/domain/interfaces/user.interface";

export interface CrearCuentaResponse {
    usuario: Usuario
}

export type CrearCuentaFormType = {
    username: string,
    password: string,
    confirmarPassword: string,
    aceptarTerminosCondiciones: boolean,
};