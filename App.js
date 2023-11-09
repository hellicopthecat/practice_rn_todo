import {StatusBar} from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {theme} from "./color";
import {useEffect, useState} from "react";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [active, setActive] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setActive(false);
  const work = () => setActive(true);
  const textChange = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    //try catch 문으로 작성하는게 더 좋음
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    //try catch 문으로 작성하는게 더 좋음
    const todo = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(todo));
  };
  useEffect(() => {
    loadToDos();
  }, []);
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    //save TO do
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: {text, work: active},
    // });
    const newToDos = {...toDos, [Date.now()]: {text, active}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{...styles.btnText, color: active ? "white" : theme.grey}}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{...styles.btnText, color: !active ? "white" : theme.grey}}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder={active ? "ADD TODO" : "WHERE DO YOU WANNA GO?"}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={textChange}
          onSubmitEditing={addTodo}
          value={text}
        />
      </View>

      <ScrollView>
        {Object.keys(toDos).map((key, i) =>
          toDos[key].active === active ? (
            <View style={styles.toDo} key={i}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 30,
    fontWeight: "800",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  toDoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
/* 
TouchableOpacity : 터치 할 때 투명도
TouchableHighlight : 터치 할 때 반짝임
TouchableWithoutFeedback : 터치 할 때 아무 일 하지 않음
Pressalble : 더 많은 반응을 조정할 수 있다.
hitSlope : 요소 바깥 어디까지 탭 누르는 것을 감지할지 정함
*/
