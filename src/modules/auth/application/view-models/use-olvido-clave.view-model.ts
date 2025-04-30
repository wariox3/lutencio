import { useForm } from "react-hook-form";
import { OlvidoClaveFormType } from "../../domain/types/olvido-clave.type";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard } from "react-native";
import { OlvidoClaveUseCase } from "../user-cases/olvido-clave.use-case";

export default function useOlvidoClaveViewModel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<OlvidoClaveFormType>({
    defaultValues: {
      username: "",
    },
  });

  const handleOlvidoClave = async (data: OlvidoClaveFormType) => {
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const respuestaApiLogin = await new OlvidoClaveUseCase().execute(data);

      if (respuestaApiLogin.verificacion) {
        router.replace("/(app)/(auth)/login");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    control,
    handleSubmit,
    handleOlvidoClave,
  };
}
