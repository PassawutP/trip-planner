import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";
import { Text } from "react-native";

type GentripScreenProp = StackNavigationProp<RootStackParamList, 'Gentrip'>;

export default function Gentrip() {
    const navigation = useNavigation<GentripScreenProp>();
    return (<Text> Gentrip </Text>);
}