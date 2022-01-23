import { StyleSheet,Image, Text, View,TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Entypo,Ionicons} from "@expo/vector-icons"
import tw from "tailwind-rn"
import Swiper from 'react-native-deck-swiper';
import { useState } from 'react/cjs/react.development';
import { collection, doc, getDocs, onSnapshot, setDoc, where ,query, getDoc, serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const DUMMY_DATA = [
  {
    firstName:"Rahul",
    lastName:"Rai",
    fullName:"Rahul Rai",
    occupation:"Full Stack Developer",
    photoURL:"https://avatars.githubusercontent.com/u/46862628",
    age:19,
  },
  {
    firstName:"Elon",
    lastName:"Musk",
    fullName:"Elon Musk",
    occupation:"Software Developer",
    photoURL:"https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
    age:19,
  },
  {
    firstName:"Sonny",
    lastName:"Sangha",
    fullName:"Sonny Sangha",
    occupation:"Papa React",
    photoURL:"https://avatars.githubusercontent.com/u/24712956",
    age:27,
  },
]

const HomeScreen = () => {
    const navigation = useNavigation()
    const {user,logout} = useAuth()
    const [profiles,setProfiles] = useState([])
    const swipeRef = useRef()

    useLayoutEffect(() => onSnapshot(doc(db,"users",user.uid),(snapshot) => {
        if(!snapshot.exists()){
          navigation.navigate("Modal")
        }
      })
    ,[])

    useEffect(() => {
      let unsubscribe;
      const fetchCards = async () => {

        const passes = await getDocs(collection(db,"users",user.uid,"passes")).then((snapshot) => snapshot.docs.map((doc) => doc.id))

        const swipes = await getDocs(collection(db,"users",user.uid,"swipes")).then((snapshot) => snapshot.docs.map((doc) => doc.id))

        const passedUserIds = passes.length > 0 ? passes : ["test"]
        const swipedUserIds = swipes.length > 0 ? passes : ["test"]

        unsubscribe = await onSnapshot(query(collection(db,"users"),where("id","not-in",[...passedUserIds,...swipedUserIds])),(snapshot) => {
          setProfiles(snapshot.docs.filter((doc) => doc.id !== user.uid).map((doc) => ({
            id:doc.id,
            ...doc.data()
          })))
        })
      }

      fetchCards()

      return unsubscribe;

    },[db])

    const swipeLeft = (cardIndex) => {
      if(!profiles[cardIndex]) return

      const userSwiped = profiles[cardIndex]

      console.log(`You swipped pass on ${userSwiped.displayName}`)

      setDoc(doc(db,"users",user.uid,"passes",userSwiped.id),userSwiped)
    }

    const swipeRight = async (cardIndex) => {
      if(!profiles[cardIndex]) return

      const userSwiped = profiles[cardIndex]

      const loggedInProfile = await(await getDoc(doc(db,"users",user.uid))).data()

      // Check if the user switched on you...
      getDoc(doc(db,"users",userSwiped.id,"swipes",user.uid)).then((documentSnapshot) => {
        if(documentSnapshot.exists()){

          // user has matched with you before you matched with then...
          // Create a MATCH!
          console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`)

          setDoc(doc(db,"users",user.uid,"swipes",userSwiped.id),userSwiped)

          

          setDoc(doc(db,"matches",generateId(user.uid,userSwiped.id)),{
            users:{
              [user.uid]:loggedInProfile,
              [userSwiped.id]:userSwiped,
            },
            usersMatched:[user.uid,userSwiped.id],
            timestamp:serverTimestamp()
          })

          navigation.navigate("Match",{
            loggedInProfile,
            userSwiped
          })

        }else{
          console.log(`you swipped match on`,userSwiped)
    
          setDoc(doc(db,"users",user.uid,"swipes",userSwiped.id),userSwiped)
        }
      }) 

    }

    return (
      <SafeAreaView style={tw("flex-1")}>
        {/* Header */}
          <View style={tw("flex-row justify-between items-center px-5")}>
            <TouchableOpacity onPress={logout}>
              <Image 
                style={tw("h-10 w-10 rounded-full")} 
                source={{uri:user.photoURL}}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
              <Image style={tw("h-14 w-14")} source={require("../logo.png")} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
              <Ionicons 
                name='chatbubbles-sharp'
                size={30} 
                color="#ff5864"
              />
            </TouchableOpacity>

          </View>
        {/* End of Header */}

        {/* Cards Start */}
          <View style={tw("flex-1")}>
            <Swiper 
              ref={swipeRef}
              containerStyle={{backgroundColor:"transparent"}}
              cards={profiles}
              cardIndex={0}
              stackSize= {5}
              verticalSwipe={false}
              onSwipedLeft={(cardIndex) => {
                console.log("Swipe Pass")
                swipeLeft(cardIndex)
              }}
              onSwipedRight={(cardIndex) => {
                console.log("Swipe Match")
                swipeRight(cardIndex)
              }}
              animateCardOpacity
              backgroundColor='#4fd0e9'
              overlayLabels={{
                left:{
                  title:"NOPE",
                  style:{
                    label:{
                      textAlign:"right",
                      color:"red",
                    }
                  }
                },
                right:{
                  title:"Match",
                  style:{
                    label:{
                      color:"#4ded30"
                    }
                  }
                }
              }}
              renderCard={(card,index) => card ? (
                    <View key={index} style={tw("relative bg-red-500 h-3/4 rounded-xl")}>
                        <Image
                          style={tw("h-full w-full rounded-xl")} 
                          source={{uri:card.photoURL}}
                        />

                        <View style={[tw("absolute bottom-0 bg-white flex-row justify-between items-center w-full h-20 px-6 py-2 rounded-b-xl"),styles.cardShadow]}>
                          <View>
                            <Text style={tw("text-xl font-bold")}>
                              {card.displayName}
                            </Text>
                            <Text>
                              {card.occupation}
                            </Text>
                            <Text>
                              {console.log(" ----- card ----- ",card)}
                            </Text>
                          </View>
                          <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                        </View>
                    </View>
                ):(
                  <View
                    style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"),styles.cardShadow,]}
                  >
                    <Text style={tw("font-bold pb-5")}>No More profiles</Text>
                    <Image 
                      style={tw("h-20 w-20")}
                      height={100}
                      width={100}
                      source={{uri:"https://links.papareact.com/6gb"}}
                    />
                  </View>
                )
              }
            />
          </View>
        {/* Cards End */}

        
        <View style={tw("flex flex-row justify-evenly")}>
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeLeft()}
            style={tw("items-center justify-center rounded-full w-16 h-16 bg-red-200")}
          >
              <Entypo name='cross' size={24} color="red" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => swipeRef.current.swipeRight()}
            style={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}
          >
              <Entypo name='heart' size={24} color="green" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow:{
    shadowColor:"#000",
    shadowOffset:{
      width:0,
      height:1,
    },
    shadowOpacity:0.2,
    shadowRadius:1.41,

    elevation:2,
  },
});
