import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, AppState, Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";

import { icons, images } from "@/constants";
import { supabase } from "@/lib/supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <ScrollView className="flex-1 bg-primary-700">
      <View className="flex-1">
        {/* Contenedor de la imagen */}
        <View className="relative w-full h-[250px]">
          <Image
            source={images.signin_signup}
            className="z-0 w-full h-[250px]"
            resizeMode="cover"
          />
          {/* Añadimos un gradiente en la parte inferior de la imagen */}
          <LinearGradient
            // Define los colores y la dirección del gradiente
            colors={["transparent", "#215568"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 70, // Altura del gradiente
            }}
          />
        </View>

        {/* Contenido de la página */}
        <View className="p-5">
          <Text className="text-white text-center text-2xl font-bold mb-3 mt-3">
            Registrate
          </Text>
          <InputField
            label="Correo electrónico"
            placeholder="Ingresa tu correo"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            iconStyle="text-white"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Registrate"
            onPress={() => signUpWithEmail()}
            className="mt-6"
            disabled={loading}
          />

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-100 mt-10"
          >
            ¿Ya tienes una cuenta?{" "}
            <Text className="text-neutral">Iniciar sesión</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};
export default SignUp;
