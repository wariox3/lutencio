import { useAppSelector } from "@/src/application/store/hooks";
import {
  selectCantidadVisitasTotal
} from "../../../application/slice/entrega.selector";
import CardGestionEntrega from "./card-gestion-entrega";
import CardTerminarEntrega from "./card-terminar-entrega";

const SinElementos = () => {
  const cantidadVisitasTotal = useAppSelector(selectCantidadVisitasTotal);



  return (
    <>
      {cantidadVisitasTotal > 0 ? (
        <CardTerminarEntrega></CardTerminarEntrega>
      ) : (
        <CardGestionEntrega></CardGestionEntrega>
      )}
    </>
  );
};

export default SinElementos;
