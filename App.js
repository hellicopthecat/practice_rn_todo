import {StatusBar} from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {theme} from "./color";
import {useEffect, useState} from "react";
import {FontAwesome} from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [work, setWork] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travelBtn = () => setWork(false);
  const workBtn = () => setWork(true);
  const textChange = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    //try catch 문으로 작성하는게 더 좋음
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {}
  };

  const loadToDos = async () => {
    //try catch 문으로 작성하는게 더 좋음
    try {
      const todo = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(todo));
    } catch (e) {}
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
    //   [Date.now()]: {text, work: work},
    // });
    const newToDos = {...toDos, [Date.now()]: {text, work}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteTodo = async (key) => {
    Alert.alert("R U SURE?", "REALLY DELETE?", [
      {text: "cancel"},
      {
        text: "ok",
        style: "destructive",
        onPress: async () => {
          const newToDos = {...toDos};
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={workBtn}>
          <Text style={{...styles.btnText, color: work ? "white" : theme.grey}}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travelBtn}>
          <Text
            style={{...styles.btnText, color: !work ? "white" : theme.grey}}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder={work ? "ADD TODO" : "WHERE DO YOU WANNA GO?"}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={textChange}
          onSubmitEditing={addTodo}
          value={text}
        />
      </View>

      <ScrollView>
        {Object.keys(toDos).map((key, i) =>
          toDos[key].work === work ? (
            <View style={styles.toDo} key={i}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <FontAwesome name="trash-o" size={24} color="orange" />
              </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
