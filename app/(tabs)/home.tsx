import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { sendPrompt } from "@/lib/api/gemini";
import { Ionicons } from "@expo/vector-icons";

// Lista de géneros infantiles
const genres = [
  { label: "Aventura", value: "Aventura" },
  { label: "Fantasía", value: "Fantasía" },
  { label: "Cuentos de hadas", value: "Cuentos de hadas" },
  { label: "Ciencia ficción", value: "Ciencia ficción" },
  { label: "Superhéroes", value: "Superhéroes" },
  { label: "Animales", value: "Animales" },
];

const StoryGenerator = () => {
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; message: string }[]
  >([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [storyGenerated, setStoryGenerated] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSubmitPrompt = async () => {
    if (!userPrompt.trim() || !selectedGenre) return;
    setLoading(true);

    setChatHistory((prev) => [...prev, { role: "user", message: userPrompt }]);

    try {
      const response = await sendPrompt(`${selectedGenre}: ${userPrompt}`);
      setChatHistory((prev) => [...prev, { role: "bot", message: response }]);
      setStoryGenerated(true);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", message: "Error al generar la historia." },
      ]);
    } finally {
      setLoading(false);
      setUserPrompt("");
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleGenerateAnotherStory = () => {
    setChatHistory([]);
    setSelectedGenre(null);
    setStoryGenerated(false);
  };

  const renderGenreButton = ({
    item,
  }: {
    item: { label: string; value: string };
  }) => (
    <TouchableOpacity
      className={`py-2 px-3 rounded-full mr-2 ${
        selectedGenre === item.value ? "bg-blue-500" : "bg-gray-200"
      }`}
      onPress={() => setSelectedGenre(item.value)}
    >
      <Text
        className={`text-xs ${
          selectedGenre === item.value ? "text-white" : "text-gray-800"
        }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderChatMessage = ({
    item,
    index,
  }: {
    item: { role: string; message: string };
    index: number;
  }) => (
    <View
      className={`mb-4 ${item.role === "user" ? "items-end" : "items-start"}`}
    >
      <View
        className={`rounded-lg p-3 max-w-[80%] ${
          item.role === "user" ? "bg-blue-500" : "bg-gray-200"
        }`}
      >
        <Text className={item.role === "user" ? "text-white" : "text-gray-800"}>
          {item.message}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#215568", "#3b5998"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-4">
        <Text className="text-2xl text-white font-bold text-center mb-4">
          Generador de Historias Mágicas
        </Text>

        <View className="mb-4">
          <FlatList
            data={genres}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderGenreButton}
            keyExtractor={(item) => item.value}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={100}
        >
          <FlatList
            ref={flatListRef}
            data={chatHistory}
            renderItem={renderChatMessage}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            inverted={false}
          />

          {!storyGenerated ? (
            <View className="flex-row items-end justify-center mt-4">
              <TextInput
                className="flex-1 bg-white rounded-xl py-2 px-4 max-w-xs text-gray-800"
                placeholder="Escribe tu idea para una historia..."
                value={userPrompt}
                onChangeText={setUserPrompt}
                multiline
              />
              <TouchableOpacity
                onPress={handleSubmitPrompt}
                disabled={loading || !userPrompt || !selectedGenre}
                className={`p-1 rounded-full ml-4 ${
                  !userPrompt || !selectedGenre ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                {loading ? (
                  <Ionicons name="hourglass-outline" size={22} color="white" />
                ) : (
                  <Ionicons name="arrow-up" size={22} color="white" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center justify-center mt-4">
              <TouchableOpacity
                className="bg-blue-500 py-2 px-4 rounded-full mr-4"
                onPress={() => console.log("Save Story")}
              >
                <Text className="text-white">Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 py-2 px-4 rounded-full"
                onPress={handleGenerateAnotherStory}
              >
                <Text className="text-white">Generar otra historia</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default StoryGenerator;
