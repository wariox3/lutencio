import { View, Text, ScrollView } from "react-native";
import React from "react";
import { privacidadStyles } from "../../stylesheet/privacidad.stylesheet";

export default function PrivacyScreen() {
  return (
    <ScrollView style={privacidadStyles.container}>
      <View style={privacidadStyles.wrapper}>
        <View style={privacidadStyles.contentSection}>
          <Text style={privacidadStyles.title}>Políticas de Privacidad</Text>
          <Text style={privacidadStyles.lastUpdated}>Última actualización: 12 de mayo de 2025</Text>
          
          <Text style={privacidadStyles.paragraph}>
            Esta Política de Privacidad describe cómo se recopila, utiliza y comparte su información personal cuando utiliza nuestra aplicación.
          </Text>
          
          <Text style={privacidadStyles.sectionTitle}>1. Información que Recopilamos</Text>
          <Text style={privacidadStyles.paragraph}>
            <Text style={privacidadStyles.bold}>Información personal:</Text> Podemos recopilar información personal como su nombre, dirección de correo electrónico, número de teléfono y dirección cuando se registra en nuestra aplicación.
          </Text>
          <Text style={privacidadStyles.paragraph}>
            <Text style={privacidadStyles.bold}>Información de uso:</Text> Recopilamos información sobre cómo interactúa con nuestra aplicación, incluyendo las páginas que visita, el tiempo que pasa en ellas y las acciones que realiza.
          </Text>
          <Text style={privacidadStyles.paragraph}>
            <Text style={privacidadStyles.bold}>Información del dispositivo:</Text> Podemos recopilar información sobre el dispositivo que utiliza para acceder a nuestra aplicación, incluyendo el modelo de hardware, sistema operativo y versión, identificadores únicos de dispositivo y datos de red móvil.
          </Text>
          
          <Text style={privacidadStyles.sectionTitle}>2. Cómo Utilizamos su Información</Text>
          <Text style={privacidadStyles.paragraph}>
            Utilizamos la información que recopilamos para:
          </Text>
          <Text style={privacidadStyles.bulletPoint}>• Proporcionar, mantener y mejorar nuestra aplicación</Text>
          <Text style={privacidadStyles.bulletPoint}>• Procesar y completar transacciones</Text>
          <Text style={privacidadStyles.bulletPoint}>• Enviar información técnica, actualizaciones y mensajes de soporte</Text>
          <Text style={privacidadStyles.bulletPoint}>• Responder a sus comentarios, preguntas y solicitudes</Text>
          <Text style={privacidadStyles.bulletPoint}>• Desarrollar nuevos productos y servicios</Text>
          <Text style={privacidadStyles.bulletPoint}>• Detectar, investigar y prevenir actividades fraudulentas y no autorizadas</Text>
          
          <Text style={privacidadStyles.sectionTitle}>3. Compartición de Información</Text>
          <Text style={privacidadStyles.paragraph}>
            No compartimos su información personal con terceros excepto en las siguientes circunstancias:
          </Text>
          <Text style={privacidadStyles.bulletPoint}>• Con su consentimiento</Text>
          <Text style={privacidadStyles.bulletPoint}>• Para cumplir con las leyes y regulaciones aplicables</Text>
          <Text style={privacidadStyles.bulletPoint}>• Para proteger los derechos, la privacidad, la seguridad o la propiedad de nuestra aplicación o de otros</Text>
          <Text style={privacidadStyles.bulletPoint}>• En relación con una venta, fusión o cambio de control</Text>
          
          <Text style={privacidadStyles.sectionTitle}>4. Seguridad de Datos</Text>
          <Text style={privacidadStyles.paragraph}>
            Tomamos medidas razonables para proteger su información personal contra pérdida, robo, uso indebido y acceso no autorizado, divulgación, alteración y destrucción.
          </Text>
          
          <Text style={privacidadStyles.sectionTitle}>5. Sus Derechos</Text>
          <Text style={privacidadStyles.paragraph}>
            Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, como el derecho a acceder, corregir, eliminar o restringir el procesamiento de su información personal.
          </Text>
          
          <Text style={privacidadStyles.sectionTitle}>6. Cambios en esta Política</Text>
          <Text style={privacidadStyles.paragraph}>
            Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.
          </Text>
          
          <Text style={privacidadStyles.contactInfo}>
            Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos a: ejemplo@correo.com
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}