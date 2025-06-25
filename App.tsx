import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    findNodeHandle,
    UIManager,
    StatusBar as ReactStatusBar
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    useAnimatedProps,
    withSpring,
    Easing
} from "react-native-reanimated";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView
} from "react-native-gesture-handler";
import { Circle, Svg } from "react-native-svg";
const { width, height } = Dimensions.get("screen");

const CircleAnimated = Animated.createAnimatedComponent(Circle);
const ballSize = 70;
const radius = ballSize / 2;

const App = () => {
    const ballX = useSharedValue(0);
    const ballY = useSharedValue(0);
    const drag = useSharedValue({ x: 0, y: 0 });
    const start = useSharedValue({ x: 0, y: 0 });
    const rotation = useSharedValue(0);
    const velocityX = useSharedValue(3); // speed and direction on x-axis
    const velocityY = useSharedValue(3); // speed and direction on y-axis
    const deg = useSharedValue(3);
    const scale = useSharedValue(15);
    const [rLayout, setRLayout] = React.useState({});

    const rectangleRef = useRef<Animated.View>(null);

    const animateBall = () => {
        const loop = () => {
            ballX.value += velocityX.value;
            ballY.value += velocityY.value;

            if (ballX.value >= width - ballSize) {
                velocityX.value *= -velocityX.value / 3;
            }
            if (ballY.value >= height - ballSize) {
                velocityY.value *= -velocityY.value / 3;
            }
            if (ballX.value <= 0) {
                velocityX.value *= velocityX.value / 3;
            }
            if (ballY.value <= 0) {
                velocityY.value *= velocityY.value / 3;
            }
            //const handle = findNodeHandle(rectangleRef.current);
            // if (handle) {
            //     UIManager.measure(
            //         handle,
            //         (x, y, width, height, pageX, pageY) => {
            //             const dx = ballX.value + radius - x - radius;
            //             const dy = ballY.value + radius - y;
            //             const distance = Math.sqrt(dx * dx + dy * dy);

            //             if (distance <= ballSize) {
            //                 velocityX.value *= -1;
            //                 velocityY.value *= -1;
            //             }
            //         }
            //     );
            // }
            requestAnimationFrame(loop); // keep animating
        };
        requestAnimationFrame(loop);
    };

    const rotationAnimation = () => {
        const loop = () => {
            rotation.value += deg.value;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    };

    const scaleAnimation = () => {
        const loop = () => {
            scale.value += 0.1;
            if (scale.value >= 50) {
                scale.value *= -0.1;
            }

            requestAnimationFrame(loop, 100);
        };
        requestAnimationFrame(loop, 100);
    };

    useEffect(() => {
        animateBall();
        rotationAnimation();
        scaleAnimation();
    }, []);

    const ballAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: ballX.value },
                { translateY: ballY.value },
                { rotate: rotation.value + "deg" }
            ]
        };
    });

    const dragAnimated = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: drag.value.x },
                { translateY: drag.value.y }
            ]
        };
    });

    const rectangleAnimated = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: rotation.value + "deg" }]
        };
    });

    const scaleAnimated = useAnimatedProps(() => {
        return {
            r: withSpring(scale.value, { duration: 1000 })
        };
    });

    const dragGesture = Gesture.Pan()
        .onStart(e => {})
        .onUpdate(e => {
            let x = e.translationX + start.value.x;
            let y = e.translationY + start.value.y;
            drag.value = {
                x: x,
                y: y
            };
        })
        .onEnd(e => {
            start.value = {
                x: drag.value.x,
                y: drag.value.y
            };
        });

    const Compose = Gesture.Race(dragGesture);

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.button}>
                    <Text>Get Source Code</Text>
                </TouchableOpacity>
                <Animated.View style={[styles.ball, ballAnimatedStyle]}>
                    <Text style={styles.innerText}>Bounce</Text>
                </Animated.View>
                <Svg style={styles.svg}>
                    <CircleAnimated
                        animatedProps={scaleAnimated}
                        cx="50%"
                        cy="50%"
                        fill="#1e90ffff"
                    >
                        <Text style={styles.innerText}>Scale</Text>
                    </CircleAnimated>
                </Svg>
                <Animated.View
                    ref={rectangleRef}
                    style={[styles.rectangle, rectangleAnimated]}
                >
                    <Text style={styles.innerText}>Rotation</Text>
                </Animated.View>
            </View>
            <GestureDetector gesture={Compose}>
                <Animated.View style={[styles.ball, dragAnimated, styles.drag]}>
                    <Text style={styles.innerText}>Drag</Text>
                </Animated.View>
            </GestureDetector>
            <StatusBar backgroundColor="dodgerblue" style="light" />
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightgray"
    },
    ball: {
        width: ballSize,
        height: ballSize,
        backgroundColor: "dodgerblue",
        borderRadius: 100,
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    scale: {
        position: "absolute",
        bottom: height / 5,
        right: width / 1.5
    },
    reset: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        padding: 10,
        backgroundColor: "#eee",
        borderRadius: 5
    },
    rectangle: {
        height: ballSize + 10,
        width: ballSize + 10,
        position: "absolute",
        bottom: height / 3,
        right: width / 3,
        backgroundColor: "dodgerblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    drag: {
        position: "absolute",
        bottom: height / 7,
        right: width / 2
    },
    innerText: {
        color: "white",
        fontWeight: "light"
    },
    svg: {
        height: 250,
        width: "100%"
    },

    button: {
        
    }
});

export default App;
