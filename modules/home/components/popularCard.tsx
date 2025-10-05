import React from 'react';
import { StyleSheet, Pressable, InteractionManager } from 'react-native';
import { ChevronRight, ChevronLeft, IdCard, EllipsisVertical, Clock, Headset, FileCheck2 } from 'lucide-react-native';

import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { ApplyNowAction } from './ApplyNowAction';
import { Separator } from '@/components/ui/separator';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PopularCardData {
  id: string;
  title: string;
  description: string;
  category?: string;
  badges?: { label: string; variant?: 'default' }[];
  icon?: React.ComponentType<any>;
  additionalInfo?: {
    title: string;
    content: string;
  };
}

interface PopularCardProps {
  data: PopularCardData;
  onPress?: (data: PopularCardData) => void;
  showChevron?: boolean;
  containerStyle?: object;
  onApplyNow?: () => void;
}

export type { PopularCardProps, PopularCardData };

export const PopularCard: React.FC<PopularCardProps> = React.memo(({
  data,
  onPress,
  showChevron = true,
  containerStyle,
  onApplyNow,
}) => {
  const borderColor = useThemeColor({}, 'border');
  const secondaryColor = useThemeColor({}, 'secondary');
  const iconColor = useThemeColor({}, 'icon');
  const textMutedColor = useThemeColor({}, 'textMuted');
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');
  const mutedColor = useThemeColor({}, 'muted');

  const IconComponent = data.icon || IdCard;
  const { isVisible, open, close } = useBottomSheet();

  // Derive dynamic labels from provided badges for modal details
  const processingTimeLabel = data.badges?.find((b) => /quick|fast|days|hours/i.test(b.label))?.label;
  const validityLabel = data.badges?.find((b) => /lifetime|years|valid/i.test(b.label))?.label;
  const serviceTypeLabel = data.badges?.find((b) => /online|onsite|walk\s*in|appointment/i.test(b.label))?.label;

  const handlePress = () => {
    open();
    onPress?.(data);
  };

  const handleBackPress = () => {
    close();
  };

  const handleApplyNowPress = () => {
    // Only trigger parent-provided callback; navigation handled by ApplyNowAction
    // Keep UI separation: ApplyNowAction controls its own UI and navigation
    if (onApplyNow) {
      // Defer to ensure smooth UX after closing animation
      close();
      InteractionManager.runAfterInteractions(() => onApplyNow());
    }
  };

  const renderModalHeader = () => (
    <View style={styles.modalHeader}>
      <Pressable
        onPress={handleBackPress}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft color={iconColor} size={24} />
      </Pressable>
      <Text variant="title" style={styles.modalTitle}>
        ID Detail
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      {renderModalHeader()}

      {/* ID Detail Content */}
      <View style={styles.detailSection}>
        <View style={[styles.detailIconContainer, { backgroundColor: secondaryColor }]}>
          <IconComponent color={iconColor} size={32} />
        </View>

        <View style={styles.detailInfo}>
          {data.category && (
            <Text variant='caption' style={[styles.detailCategory, { color: textMutedColor }]}>
              {data.category}
            </Text>
          )}
          <Text variant="heading" style={styles.detailTitle}>
            {data.title}
          </Text>
          <Text variant="body" style={[styles.detailDescription, { color: textMutedColor }]}>
            {data.description}
          </Text>
        </View>
      </View>

      {/* Badges Section in Modal */}
      {data.badges && data.badges.length > 0 && (
        <View style={styles.modalBadgesContainer}>
          <Text variant="subtitle" style={styles.badgesTitle}>
            Requirements
          </Text>
          <View style={styles.badgesGrid}>
            {data.badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || 'secondary'}
                textStyle={styles.modalBadgeText}
              >
                {badge.label}
              </Badge>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Pressable
        style={[styles.container, { borderColor }, containerStyle]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${data.title}`}
        accessibilityHint="Tap to view more information about this government ID"
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: secondaryColor }]}>
              <IconComponent color={iconColor} />
            </View>
            <View style={styles.titleContainer}>
              {data.category && (
                <Text variant='caption' style={styles.category}>
                  {data.category}
                </Text>
              )}
              <Text style={styles.title}>{data.title}</Text>
            </View>
            {showChevron && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View details"
                onPress={handlePress}
                style={({ pressed }) => [
                  styles.chevron,
                  styles.chevronButton,
                  pressed && styles.chevronPressed,
                  pressed && { backgroundColor: mutedColor },
                ]}
              >
                <ChevronRight
                  style={styles.chevronIcon}
                  color={iconColor}
                />
              </Pressable>
            )}
          </View>

          {/* Description Section */}
          <View>
            <Text
              variant='caption'
              numberOfLines={2}
              style={[styles.description, { borderBottomColor: borderColor }]}
            >
              {data.description}
            </Text>
          </View>

          {/* Badges Section */}
          {data.badges && data.badges.length > 0 && (
            <View style={styles.badgesContainer}>
              {data.badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant={badge.variant || 'secondary'}
                  textStyle={{ color: textMutedColor, fontSize: 12 }}
                >
                  {badge.label}
                </Badge>
              ))}
            </View>
          )}
        </View>
      </Pressable>

      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        snapPoints={[0.9]}
        enableBackdropDismiss={true}
        title='ID Detail'
        leftIcon={<ChevronLeft color={iconColor} size={24} />}
        onLeftIconPress={close}
        rightIcon={<EllipsisVertical color={iconColor} size={24} />}
      >
        <View style={styles.modalContainer}>
          {/* Header Separator */}
          <Separator style={{ marginBottom: 20 }} />

          {/* Scrollable Content */}
          <View style={styles.modalScrollContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginBottom: 15 }}>
              <View>
                <Text variant='title'>{data.title}</Text>
                {!!data.category && (
                  <Text variant='subtitle' style={{ color: textMutedColor }}>{data.category}</Text>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 13 }}>
              {processingTimeLabel && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
                  <Clock size={18} />
                  <Text variant='caption'>Processing Time:</Text>
                  <Text style={{ fontWeight: '500' }}>{processingTimeLabel}</Text>
                </View>
              )}
              {validityLabel && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
                  <FileCheck2 size={18} />
                  <Text variant='caption'>Validity:</Text>
                  <Text style={{ fontWeight: '500' }}>{validityLabel}</Text>
                </View>
              )}
              {serviceTypeLabel && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
                  <Headset size={18} />
                  <Text variant='caption'>Service Type:</Text>
                  <Text style={{ fontWeight: '500' }}>{serviceTypeLabel}</Text>
                </View>
              )}
            </View>

            <Separator style={{ marginVertical: 20 }} />

            <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 20 }}>
              <View style={{ gap: 10 }}>
                <Text style={{ fontWeight: '600' }}>About {data.title}</Text>
                <Text variant='caption'>
                  {data.description}
                </Text>
              </View>

              {data.additionalInfo && (
                <View style={{ gap: 10 }}>
                  <Text style={{ fontWeight: '600' }}>{data.additionalInfo.title}</Text>
                  <Text variant='caption'>
                    {data.additionalInfo.content}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.modalButtonContainer}>
            <Separator style={{ marginBottom: 20 }} />
            <ApplyNowAction 
              data={data}
              style={styles.bottomButton}
              beforePress={close}
              extraParams={{
                processingTime: 'Quick',
                validity: 'Lifetime',
                serviceType: 'Online & Onsite',
              }}
            />
          </View>
        </View>
      </BottomSheet>
    </>
  );
});

PopularCard.displayName = 'PopularCard';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'column',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '30%',
    padding: 10,
    borderRadius: 25,
  },
  titleContainer: {
    gap: 3,
    flex: 1,
    marginLeft: 10,
  },
  category: {
    fontSize: 14,
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chevron: {
    justifyContent: 'flex-end',
    opacity: 0.8,
  },
  chevronButton: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 'auto',
  },
  chevronPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.3,
  },
  chevronIcon: {
    alignSelf: 'flex-end',
  },
  description: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    lineHeight: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 15,
    flexWrap: 'wrap',
  },
  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  detailIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  detailInfo: {
    flex: 1,
    gap: 6,
  },
  detailCategory: {
    fontSize: 14,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 4,
  },
  modalBadgesContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalBadgeText: {
    fontSize: 13,
  },
  // New Modal Layout Styles
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  modalScrollContent: {
    flex: 1,
  },
  modalButtonContainer: {
    marginTop: '30%',
  },
  bottomButton: {
    width: '100%',
  },
});