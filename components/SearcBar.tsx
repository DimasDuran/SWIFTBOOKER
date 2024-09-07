import { StyleSheet, TextInput, TouchableOpacity, View, TextInputProps } from "react-native";
import React, { useState } from 'react';
import { colors } from "@/styles/colores";
import { Feather } from '@expo/vector-icons';

interface SearchBarProps extends TextInputProps {
  placeholder_text: string;
  onSearch: (text: string) => void;
  token: boolean;
  onPress:() => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder_text, onSearch,onPress, token, value, ...props }) => {
  const [isSearchFocused, setSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    onSearch("");
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
  };
console.log('Valor',token)
  return (
    <View style={styles.container}>
      <Feather
        name='search'
        size={20}
        color={colors.color_light_gray}
        style={styles.icon}
      />
      <TextInput
        editable={token}
        onPress={onPress}
        style={styles.input_line}
        placeholder={placeholder_text}
        onChangeText={onSearch}
        onBlur={handleSearchBlur}
        onFocus={handleSearchFocus}
        value={value}
        {...props} 
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.color_white,
    padding: 12,
    borderRadius: 20,
    flexDirection: "row",
    shadowColor: colors.color_gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 6,
    alignItems: 'center',
  },
  icon: {
    paddingEnd: 8,
  },
  input_line: {
    flex: 1,
  },
});
