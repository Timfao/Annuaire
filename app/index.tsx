import { router } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)"); // 🔁 redirection vers les actualités après 5 secondes
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2095E8", // couleur de fond (modifiable)
      }}
    >
      {/* 🖼️ Image */}
      <Image
        source={require("../assets/images/ecole.png")} // ← mets ton image ici
        style={{
          width: 120,
          height: 120,
          marginBottom: 20,
          resizeMode: "contain",
        }}
      />

      {/* 📝 Texte */}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Bienvenue sur MyCampus ⛪
      </Text>
      <Text style={{ marginTop: 10 }}>Chargement en cours...</Text>
    </View>
  );
}
