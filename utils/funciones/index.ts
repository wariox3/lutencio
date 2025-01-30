export const validarCorreoElectronico = (
    correoElectronico: string,
  ): boolean => {
    const expresionRegular =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (correoElectronico === '') {
      return true;
    }
    return expresionRegular.test(correoElectronico);
  };