import React from 'react';
import { StyleSheet } from 'react-native';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  OptionType
} from '@/components/ui/combobox';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { PHILIPPINE_GOVERNMENT_IDS } from '@/data/philippine-government-ids';

interface GovernmentIdSelectorProps {
  value: OptionType | null;
  onValueChange: (value: OptionType | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export const GovernmentIdSelector: React.FC<GovernmentIdSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select government ID...",
  searchPlaceholder = "Search government IDs...",
  emptyMessage = "No government ID found.",
}) => {
  return (
    <Combobox
      value={value}
      onValueChange={onValueChange}
    >
      <ComboboxTrigger>
        <ComboboxValue placeholder={placeholder} />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput 
          placeholder={searchPlaceholder}
        />
        <ComboboxList>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          {PHILIPPINE_GOVERNMENT_IDS.map((govId) => (
            <ComboboxItem
              key={govId.id}
              value={govId.id}
              searchValue={`${govId.title} ${govId.subtitle || ""}`}
            >
              <View style={styles.itemContent}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{govId.title}</Text>
                  {govId.subtitle && (
                    <Text
                      variant="caption"
                      style={styles.itemSubtitle}
                    >
                      {govId.subtitle}
                    </Text>
                  )}
                </View>
                <View 
                  style={styles.processingBadge}
                >
                  <Text style={styles.badgeText}>5-7 days</Text>
                </View>
              </View>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

const styles = StyleSheet.create({
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontWeight: "500",
  },
  itemSubtitle: {
    opacity: 0.6,
    marginTop: 2,
  },
  processingBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#1976d2",
  },
});