import React from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { useState } from "react/cjs/react.development";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase";

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation()
  const [image,setImage] = useState("")
  const [occupation,setOccupation] = useState("")
  const [age,setAge] = useState("")

  const inCompleteForm = !image || !occupation || !age

  const updateUserProfile = () => {
      console.log(image,occupation,age)
      setDoc(doc(db,"users",user.uid),{
          id:user.uid,
          displayName:user.displayName,
          photoURL:image,
          occupation:occupation,
          age:age,
          timestamp:serverTimestamp()
      }).then(() => {
          navigation.navigate("Home")
      }).catch((error) => alert(error.message))
  }

  return (
    <SafeAreaView style={tw("flex-1 items-center justify-center")}>
      <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />

      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 1: The Profile Pic
      </Text>

      <TextInput
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter a Profile Pic URL"
        value={image}
        onChangeText={setImage}
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 2: The Occupation
      </Text>

      <TextInput
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter a occupation"
        value={occupation}
        onChangeText={setOccupation}
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 3: The Age
      </Text>

      <TextInput
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
        maxLength={2}
        keyboardType="numeric"
      />

      <TouchableOpacity
        disabled={inCompleteForm}
        style={[tw("w-64 rounded-xl absolute bottom-10"),inCompleteForm ? tw("bg-gray-400") : tw("bg-red-400")]}
        onPress={updateUserProfile}
      >
        <Text style={tw("text-white text-center text-xl")}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ModalScreen;
