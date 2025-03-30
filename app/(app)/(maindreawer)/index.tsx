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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
