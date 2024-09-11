import { Redirect, router } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";

import { supabase } from "../lib/supabase";

import { Session } from "@supabase/supabase-js";

const Home = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-primary-700">
      {session && session.user ? (
        <Redirect href="/(tabs)/home" />
      ) : (
        <>
          <View className="relative w-full h-[400px]">
            <Image
              source={onboarding[activeIndex].image}
              className="w-full h-full"
              resizeMode="cover"
            />

            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "100%",
              }}
            />

            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
              className="absolute top-10 right-5 z-10 px-4 py-2 bg-black/50 rounded-full"
            >
              <Text className="text-white text-md font-JakartaBold">
                Omitir
              </Text>
            </TouchableOpacity>
          </View>

          <Swiper
            ref={swiperRef}
            loop={false}
            dot={
              <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
            }
            activeDot={
              <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
            }
            onIndexChanged={(index) => setActiveIndex(index)}
          >
            {onboarding.map((item) => (
              <View key={item.id} className="flex-1 items-center justify-start">
                <View className="flex flex-row items-center justify-center w-full mt-5">
                  <Text className="text-white text-3xl font-bold mx-10 text-center">
                    {item.title}
                  </Text>
                </View>

                <Text className="text-md font-psemibold text-center text-white/80 mx-10 mt-3">
                  {item.description}
                </Text>
              </View>
            ))}
          </Swiper>

          <CustomButton
            title={isLastSlide ? "Empezar" : "Siguiente"}
            onPress={() =>
              isLastSlide
                ? router.replace("/(auth)/sign-in")
                : swiperRef.current?.scrollBy(1)
            }
            className="w-11/12 mt-10 mb-5"
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
