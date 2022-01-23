import {  Text, View,ImageBackground, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import tw from "tailwind-rn"

const LoginSCreen = () => {
    const {loading,signInWithGoogle} = useAuth()
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown:false,
        })
    },[])

    const image = { uri: "https://tinder.com/static/tinder.png" };

    return (
        <View style={tw("flex-1")}>
            <ImageBackground 
                resizeMode='cover'
                style={tw("flex-1")}
                source={image}
            >
                <TouchableOpacity
                    style={[tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),{marginHorizontal:"25%"},]}
                    onPress={signInWithGoogle}
                >
                    <Text style={tw("font-semibold text-center")}>
                        Sign in & get swiping
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};


  
  

export default LoginSCreen;

