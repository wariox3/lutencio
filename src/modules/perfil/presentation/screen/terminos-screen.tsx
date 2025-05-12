import React from "react";
import { terminoStyles } from "../../stylesheet/terminos.stylesheet";
import { ScrollView, Text, View } from "tamagui";

export default function TerminosScreen() {
  return (
    <ScrollView style={terminoStyles.container}>
      <View style={terminoStyles.wrapper}>
        <View style={terminoStyles.contentSection}>
          <Text style={terminoStyles.title}>Términos de Uso</Text>
          <Text style={terminoStyles.lastUpdated}>Última actualización: 12 de mayo de 2025</Text>
          
          <Text style={terminoStyles.sectionTitle}>1. Aceptación de los Términos</Text>
          <Text style={terminoStyles.paragraph}>
            Al acceder y utilizar esta aplicación, usted acepta estar sujeto a estos Términos de Uso y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, está prohibido utilizar o acceder a esta aplicación.
          </Text>
          
          <Text style={terminoStyles.sectionTitle}>2. Uso de la Aplicación</Text>
          <Text style={terminoStyles.paragraph}>
            Esta aplicación está destinada a ser utilizada para [descripción del propósito de la aplicación]. El uso de la aplicación para cualquier otro propósito no autorizado está prohibido.
          </Text>
          
          <Text style={terminoStyles.sectionTitle}>3. Cuentas de Usuario</Text>
          <Text style={terminoStyles.paragraph}>
            Al registrarse en nuestra aplicación, usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Usted acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta.
          </Text>
          
          <Text style={terminoStyles.sectionTitle}>4. Propiedad Intelectual</Text>
          <Text style={terminoStyles.paragraph}>
            Todos los derechos de propiedad intelectual relacionados con la aplicación y su contenido (incluyendo pero no limitado a texto, gráficos, logotipos, imágenes, clips de audio, descargas digitales y compilaciones de datos) son propiedad de la aplicación o de sus proveedores de contenido y están protegidos por las leyes de propiedad intelectual.
          </Text>
          
          <Text style={terminoStyles.sectionTitle}>5. Limitación de Responsabilidad</Text>
          <Text style={terminoStyles.paragraph}>
            En ningún caso la aplicación, sus directores, empleados o agentes serán responsables por cualquier daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar la aplicación.
          </Text>
          
          <Text style={terminoStyles.sectionTitle}>6. Cambios en los Términos</Text>
          <Text style={terminoStyles.paragraph}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Es su responsabilidad revisar periódicamente estos términos para estar al tanto de las modificaciones.
          </Text>
          
          <Text style={terminoStyles.sectionTitle}>7. Ley Aplicable</Text>
          <Text style={terminoStyles.paragraph}>
            Estos términos se regirán e interpretarán de acuerdo con las leyes del país/región donde opera la aplicación, sin dar efecto a ningún principio de conflictos de leyes.
          </Text>
          
          <Text style={terminoStyles.contactInfo}>
            Si tiene alguna pregunta sobre estos Términos de Uso, por favor contáctenos a: ejemplo@correo.com
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}