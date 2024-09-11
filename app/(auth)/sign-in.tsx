import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
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

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);

      return;
    }
    setLoading(false);

    router.push("/home");
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
            Iniciar sesión
          </Text>
          <InputField
            label="Correo electrónico"
            placeholder="Ingresa tu Correo"
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
            title="Iniciar sesión"
            onPress={() => signInWithEmail()}
            className="mt-6 text-white"
            disabled={loading}
          />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-100 mt-10"
          >
            ¡No tienes una cuenta?{" "}
            <Text className="text-neutral">Registrate</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
