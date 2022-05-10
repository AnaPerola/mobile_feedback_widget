import { View, TouchableOpacity } from "react-native";
import { ChatTeardropDots } from 'phosphor-react'

import { styles } from "./styles";
import { theme } from "../../theme";

export function Widget() {
  return (
    <>
      <TouchableOpacity>
        <ChatTeardropDots 
          size={24}
          weight="bold"
          color={theme.colors.text_on_brand_color}
        />
      </TouchableOpacity>
    </>
  )
}