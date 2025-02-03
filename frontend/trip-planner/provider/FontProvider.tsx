import React, { createContext, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as Font from "expo-font";

export const FontContext = createContext(false);

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "OpenSans_Condensed-Bold": require("../assets/fonts/OpenSans_Condensed-Bold.ttf"),
        "OpenSans_Condensed-BoldItalic": require("../assets/fonts/OpenSans_Condensed-BoldItalic.ttf"),
        "OpenSans_Condensed-ExtraBold": require("../assets/fonts/OpenSans_Condensed-ExtraBold.ttf"),
        "OpenSans_Condensed-ExtraBoldItalic": require("../assets/fonts/OpenSans_Condensed-ExtraBoldItalic.ttf"),
        "OpenSans_Condensed-Italic": require("../assets/fonts/OpenSans_Condensed-Italic.ttf"),
        "OpenSans_Condensed-Light": require("../assets/fonts/OpenSans_Condensed-Light.ttf"),
        "OpenSans_Condensed-LightItalic": require("../assets/fonts/OpenSans_Condensed-LightItalic.ttf"),
        "OpenSans_Condensed-Medium": require("../assets/fonts/OpenSans_Condensed-Medium.ttf"),
        "OpenSans_Condensed-MediumItalic": require("../assets/fonts/OpenSans_Condensed-MediumItalic.ttf"),
        "OpenSans_Condensed-Regular": require("../assets/fonts/OpenSans_Condensed-Regular.ttf"),
        "OpenSans_Condensed-SemiBold": require("../assets/fonts/OpenSans_Condensed-SemiBold.ttf"),
        "OpenSans_Condensed-SemiBoldItalic": require("../assets/fonts/OpenSans_Condensed-SemiBoldItalic.ttf"),
        "OpenSans_SemiCondensed-Bold": require("../assets/fonts/OpenSans_SemiCondensed-Bold.ttf"),
        "OpenSans_SemiCondensed-BoldItalic": require("../assets/fonts/OpenSans_SemiCondensed-BoldItalic.ttf"),
        "OpenSans_SemiCondensed-ExtraBold": require("../assets/fonts/OpenSans_SemiCondensed-ExtraBold.ttf"),
        "OpenSans_SemiCondensed-ExtraBoldItalic": require("../assets/fonts/OpenSans_SemiCondensed-ExtraBoldItalic.ttf"),
        "OpenSans_SemiCondensed-Italic": require("../assets/fonts/OpenSans_SemiCondensed-Italic.ttf"),
        "OpenSans_SemiCondensed-Light": require("../assets/fonts/OpenSans_SemiCondensed-Light.ttf"),
        "OpenSans_SemiCondensed-LightItalic": require("../assets/fonts/OpenSans_SemiCondensed-LightItalic.ttf"),
        "OpenSans_SemiCondensed-Medium": require("../assets/fonts/OpenSans_SemiCondensed-Medium.ttf"),
        "OpenSans_SemiCondensed-MediumItalic": require("../assets/fonts/OpenSans_SemiCondensed-MediumItalic.ttf"),
        "OpenSans_SemiCondensed-Regular": require("../assets/fonts/OpenSans_SemiCondensed-Regular.ttf"),
        "OpenSans_SemiCondensed-SemiBold": require("../assets/fonts/OpenSans_SemiCondensed-SemiBold.ttf"),
        "OpenSans_SemiCondensed-SemiBoldItalic": require("../assets/fonts/OpenSans_SemiCondensed-SemiBoldItalic.ttf"),
        "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
        "OpenSans-BoldItalic": require("../assets/fonts/OpenSans-BoldItalic.ttf"),
        "OpenSans-ExtraBold": require("../assets/fonts/OpenSans-ExtraBold.ttf"),
        "OpenSans-ExtraBoldItalic": require("../assets/fonts/OpenSans-ExtraBoldItalic.ttf"),
        "OpenSans-Italic": require("../assets/fonts/OpenSans-Italic.ttf"),
        "OpenSans-Light": require("../assets/fonts/OpenSans-Light.ttf"),
        "OpenSans-LightItalic": require("../assets/fonts/OpenSans-LightItalic.ttf"),
        "OpenSans-Medium": require("../assets/fonts/OpenSans-Medium.ttf"),
        "OpenSans-MediumItalic": require("../assets/fonts/OpenSans-MediumItalic.ttf"),
        "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
        "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
        "OpenSans-SemiBoldItalic": require("../assets/fonts/OpenSans-SemiBoldItalic.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <FontContext.Provider value={true}>{children}</FontContext.Provider>;
};
