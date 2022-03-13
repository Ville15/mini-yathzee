import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

        let board = [];
        const NBR_OF_DICES = 5;
        const NBR_OF_THROWS = 3
        const POINTS_TO_BONUS = 63;

export default function Gameboard() {

    const [numberOfThrowsLeft, setNumberOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices.');
    const [pointsStatus,setPointsStatus] = useState(
        "You are " + POINTS_TO_BONUS + " points away from bonus");
    
    const [selectedNumbers, setSelectedNumbers] = 
    useState(new Array(6).fill(false));
    
    const [currentPoints, setCurrentPoints] = useState(new Array(6).fill(0));
    
    const [selectedDices, setSelectedDices] =
    useState(new Array(NBR_OF_DICES).fill(false));
    
    const [selectedPoints, setSelectedPoints] = 
    useState(new Array(6).fill(false));
    
    const [roundEnded, setRoundEnded] = useState(false);
    const [totalPoints,setTotalPoints ] = useState(0);
    const [gameFinished,setGameFinished ] = useState(false);
   
    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        row.push(
            <Pressable
            key={"row" + i}
            onPress={() => selectDice(i)}>
            <MaterialCommunityIcons
                name={board[i]}
                key={"row" + i}
                size={50}
                color={getDiceColor(i)}>
            </MaterialCommunityIcons>
            </Pressable>
        );
    }
    const bottomrow = [];
    for (let i = 0; i < 6; i++) {
        bottomrow.push(
            <Pressable
            key={"bottomrow" + i}
            onPress={() => selectNumber(i)} >
            <MaterialCommunityIcons
            name={"numeric-" + ( i + 1) + "-circle"}
            key={"bottomrow" + i}
            size={30}
            color={getNumberColor(i)}>
            </MaterialCommunityIcons>
            </Pressable>
        )
    }

    function checkRoundEnd() {
        let isRoundPlayed = roundEnded;

        if(JSON.stringify(selectedPoints) == JSON.stringify(selectedNumbers)) {
            isRoundPlayed = false;
        }
        return isRoundPlayed;
    }
    function throwDices() {
        if(checkRoundEnd() || numberOfThrowsLeft > 0 ) {
            if(numberOfThrowsLeft != 0) {
                for (let i = 0; i < NBR_OF_DICES; i++){
                    if (!selectedDices[i]) {
                        let randomNumber = Math.floor(Math.random() * 6 + 1);
                        board[i] = "dice-" + randomNumber;
                    }
                }
            }
            setNumberOfThrowsLeft(numberOfThrowsLeft - 1)
        } else {
            setStatus("Select your points before you throw");
        }
    }
    
    function selectDice(i) {
        if (numberOfThrowsLeft != NBR_OF_THROWS){
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
        } else {
            setStatus ("Throw the dices first");
        }
    }
    
    function getDiceColor(i){
            return selectedDices[i] ? "black" : "steelblue"; 
    }

    function selectNumber(i) {
     if( numberOfThrowsLeft == 0){
         if (selectedNumbers[i] == false) {
             let number = [...selectedPoints];
             number[i] = selectedPoints[i] ? false : true;
             setSelectedPoints(number);
             let pointsFromDice = 0;

             for (let j = 0; j < board.length; j++){
             if (board[j] == "dice-" + (i + 1)){
                 pointsFromDice += i + 1
             }
         }

         if(number[i] == true) {
            currentPoints[i] += pointsFromDice;
            addPointsToTotal();
            setRoundEnded(true);
            setStatus("Points selected, click on next round");
         } else {
             currentPoints[i] -= pointsFromDice;
             addPointsToTotal()
             setGameFinished(false);
         }
         }else{
            setStatus("You already selected points for " + (i + 1));
         }
        } else{
            setStatus ("Throw 3 times before setting points");
         }
    }
    function getNumberColor(i){
        if( selectedNumbers[i] === true){
            return "black";
        } else {
            return "steelblue"
        }
        
    }
    function addPointsToTotal() {
        let sumPoints = currentPoints.reduce((partialSum, a) =>
         partialSum + a, 0);
         let pointsToBonus = 63 - sumPoints;
         setTotalPoints(sumPoints);

         if(pointsToBonus < 0) {
             setPointsStatus("Bonus achieved! ")
         } else {
             setPointsStatus (" You are " +  pointsToBonus + "  points away from bonus");
         }
    }

    function resetGame() {
        setNumberOfThrowsLeft(NBR_OF_THROWS);
        board = [];
        setStatus("Throw the Dices");
        setPointsStatus (" You are" + POINTS_TO_BONUS + "points away from bonus");
        setTotalPoints(0);
        setSelectedPoints(new Array(6).fill(false));
        setSelectedNumbers(new Array(6).fill(false));
        setSelectedDices(new Array(6).fill(false));
        setCurrentPoints((new Array(6).fill(0)));
        setGameFinished(false);
        
    }

    useEffect (() =>{

        setRoundEnded(false);

        setSelectedNumbers([...selectedPoints]);

        if(numberOfThrowsLeft < 0){
            setNumberOfThrowsLeft(NBR_OF_THROWS);
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
    
        if(numberOfThrowsLeft == 0){
            setStatus("Select your points");
            setRoundEnded(false);
        } else if (numberOfThrowsLeft == NBR_OF_THROWS) {
            setStatus("Throw dices.");
        } else {
            setStatus("Select and throw dices again.");
        }
        },[numberOfThrowsLeft]);

        useEffect (() => {
            if(selectedPoints.every((val,i,arr) => val == true)) {
                setStatus ("Game over. All points selected");
                setGameFinished(true);
            }
        }, [selectedPoints])
    
      
    return(
        <View style={styles.gameboard}>
        <View style={styles.flex}>{row} </View>
        <Text style={styles.gameinfo}>Throws left: {numberOfThrowsLeft == -1 ? 0 : numberOfThrowsLeft}</Text>
        <Text style={styles.gameinfo}>{status}</Text>
        {gameFinished ? (
         <Pressable style={styles.button} onPress={() => resetGame()}>
             <Text style={styles.buttonText}>Restart game</Text>
        </Pressable>
        ) : (
        <Pressable style={styles.button} onPress={() => throwDices()}>
        <Text style={styles.buttonText}>
            {roundEnded ? "Next round" : "Throw dice"}
            </Text>
        </Pressable> 
         )}
        <Text style={styles.gameinfo}>Total: {totalPoints}</Text>
        <Text style={styles.pointsText}>{pointsStatus}</Text>
        <View style={styles.flex}>
            {currentPoints.map((point, index) =>(
            <Text key={index} style={styles.points}>{point}</Text>))}
        </View> 
        <View style={styles.flex}> {bottomrow}</View>  
    </View>
    )
}