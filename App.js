/*
Loading the app, you have a variety of buttons and features that you can use to 
your heart's content. Touching the color palette opens up a color picker, which you can choose colors by rotating it and moving the black circle inside the triangle. I have two color
swatches in case you want to keep a certain color for later or want to work between two. I also have a brush, eraser, brush stroke, and shape option that do their corresponding functions.
You can also rewind and delete the entire canvas.

In terms of logistics, I put all my functionality except my rewind and delete in app.js so that I can use them as props in pad.js. Pad.js takes these props to look for the corresponding
button pressed. For shapes, pad.js mainly looks at the first and last coordinate of the finger on the canvas. This way it can set the boundaries for shapes created. It works by passing
and fetching values from pen and point.js to pad.js.

Some limitations:
-Clicking two places on the screen very fast will draw a line between them.
-A large brush stroke will often cause random spikes of lines to appear.
-No feature to align shapes together along the same coordinate.
*/
import React, { useState } from 'react'
import { StyleSheet, Text, View, Modal, StatusBar, Image, TouchableOpacity } from 'react-native';
import ExpoDraw from 'expo-draw'
import { TriangleColorPicker } from "react-native-color-picker";
import { FontAwesome5, Foundation } from "@expo/vector-icons"; 
import Slider from "@react-native-community/slider";

import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

/*
Notes:


Extra: onChangeStrokes={(strokes) => console.log(strokes)}
*/


export default function App() {
  const [colorOne, setColorOne] = useState('#000000')
  const [colorTwo, setColorTwo] = useState("#ffffff");
  const [colorOneSelected, setColorOneSelected] = useState(true)
  const [colorTwoSelected, setColorTwoSelected] = useState(false)
  const [colorModalVisible, setColorModalVisible] = useState(false)
  const [sliderModalVisible, setSliderModalVisible] = useState(false)
  const [tool, setTool] = useState("brush")
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [shapeModalVisible, setShapeModalVisible] = useState(false)
  const [shape, setShape] = useState(null)

  function changeTool(temp) {
    setShape(null)
    setTool(temp)
  }

  function changeShape(temp) {
    setTool(null)
    setShape(temp)
  }

  function selectColorOne() {
    setColorOneSelected(true)
    setColorTwoSelected(false)
  }

  function selectColorTwo() {
    setColorOneSelected(false)
    setColorTwoSelected(true)
  }

  function PressedIndicator({ check, leftPercent }) {
    if (shape == check) {
      return (
        <View
          style={{
            width: "33.33%",
            height: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: "50%",
              width: "75%",
              backgroundColor: "#DFF8EB",
              borderRadius: 15,
              left: windowWidth * .8 * leftPercent
            }}
          />
        </View>
      );
    } else {
      return null
    }
  }
  
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={shapeModalVisible}
        onRequestClose={() => {
          setShapeModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={[styles.container, { backgroundColor: "rgba(0,0,0,.15)" }]}
          activeOpacity={1}
          onPressOut={() => {
            setShapeModalVisible(false);
          }}
        >
          <View style={styles.shapeModal}>
            <View
              style={{ height: "20%", width: "100%", flexDirection: "row" }}
            >
              <PressedIndicator check={"line"} leftPercent={0} />
              <PressedIndicator check={"circle"} leftPercent={0.3333} />
              <PressedIndicator check={"rectangle"} leftPercent={0.6666} />
            </View>
            <View
              style={{ height: "80%", width: "100%", flexDirection: "row" }}
            >
              <TouchableOpacity
                style={(styles.button, styles.shapeButton)}
                onPress={() => changeShape("line")}
              >
                <Image
                  style={styles.image}
                  resizeMode="contain"
                  source={require("./icons/line.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={(styles.button, styles.shapeButton)}
                onPress={() => changeShape("circle")}
              >
                <Image
                  style={styles.image}
                  resizeMode="contain"
                  source={require("./icons/circle.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={(styles.button, styles.shapeButton)}
                onPress={() => changeShape("rectangle")}
              >
                <Image
                  style={styles.image}
                  resizeMode="contain"
                  source={require("./icons/square.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={colorModalVisible}
        onRequestClose={() => {
          setColorModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={[styles.container, { backgroundColor: "rgba(0,0,0,.15)" }]}
          activeOpacity={1}
          onPressOut={() => {
            setColorModalVisible(false);
          }}
        >
          <View
            style={[styles.shapeModal, {
              height: "40%",
              width: "80%",
            }]}
          >
            <TriangleColorPicker
              onColorSelected={(color) =>
                colorOneSelected ? setColorOne(color) : setColorTwo(color)
              }
              style={{ height: "70%", width: "60%", margin: 25 }}
            />
            <Text style={styles.sliderText}> Click the bar to change colors </Text>
          </View>
          
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={sliderModalVisible}
        onRequestClose={() => {
          setSliderModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={[styles.container, { backgroundColor: "rgba(0,0,0,.15)" }]}
          activeOpacity={1}
          onPressOut={() => {
            setSliderModalVisible(false);
          }}
        >
          <View
            style={[styles.shapeModal, {
              height: "30%",
              width: "70%",
            }]}
          >
            <Text style={styles.sliderText}> Stroke Width: {strokeWidth} </Text>
            <Slider
              style={{ width: "80%", height: "50%"}}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={strokeWidth}
              onValueChange={(value) => setStrokeWidth(value)}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <ExpoDraw
        strokes={[]}
        containerStyle={{
          backgroundColor: "transparent",
          width: "100%",
          borderWidth: 1,
        }}
        color={colorOneSelected ? colorOne : colorTwo}
        strokeWidth={strokeWidth}
        enabled={true}
        tool={tool}
        shape={shape}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setColorModalVisible(!colorModalVisible)}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require("./icons/palette.png")}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.button,
            { justifyContent: "none", alignItems: "none" },
          ]}
        >
          <View style={styles.circle}>
            <TouchableOpacity
              onPress={() => selectColorOne()}
              style={[
                styles.circleButton,
                colorOneSelected
                  ? {
                      backgroundColor: colorOne,
                      borderWidth: 3,
                      borderColor: "#DFF8EB",
                    }
                  : { backgroundColor: colorOne },
              ]}
            />
          </View>
          <View style={[styles.circle, { alignItems: "flex-end" }]}>
            <TouchableOpacity
              onPress={() => selectColorTwo()}
              style={[
                styles.circleButton,
                colorTwoSelected
                  ? {
                      backgroundColor: colorTwo,
                      borderWidth: 3,
                      borderColor: "#DFF8EB",
                    }
                  : { backgroundColor: colorTwo },
              ]}
            />
          </View>
        </View>
        <TouchableOpacity
          style={tool == "brush" ? styles.pressedButton : styles.button}
          onPress={() => changeTool("brush")}
        >
          <FontAwesome5 name="paint-brush" size={59} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={tool == "eraser" ? styles.pressedButton : styles.button}
          onPress={() => changeTool("eraser")}
        >
          <FontAwesome5 name="eraser" size={59} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={sliderModalVisible ? styles.pressedButton : styles.button}
          onPress={() => setSliderModalVisible(!sliderModalVisible)}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require("./icons/brush-stroke.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={shapeModalVisible ? styles.pressedButton : styles.button}
          onPress={() => setShapeModalVisible(true)}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require("./icons/shapes.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: "16.67%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#785e5e",
  },
  pressedButton: {
    height: "16.67%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5c3f3f",
    borderColor: "#DFF8EB",
    borderWidth: 3,
  },
  buttonContainer: {
    left: 0,
    top: 0,
    width: "20%",
    height: "60%",
    position: "absolute",
    borderColor: "black",
    borderWidth: 3,
    borderTopWidth: 0
  },
  image: {
    height: "100%",
    width: "100%",
  },
  shapeModal: {
    height: "15%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#785e5e",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  shapeButton: {
    width: "33.33%",
    height: "100%",
  },
  circle: {
    height: "50%",
    width: "100%",
  },
  circleButton: {
    height: "100%",
    width: "58%",
    borderRadius: 50,
  },
  sliderText: {
    color: "#DFF8EB",
    fontSize: 20,
    fontWeight: 'bold'
  },
});
