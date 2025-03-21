import { HelloWave } from "@/components/HelloWave";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView
} from "react-native";


export default function MainDreawerIndex() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HelloWave></HelloWave>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
