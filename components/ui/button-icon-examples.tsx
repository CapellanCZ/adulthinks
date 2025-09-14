// Example: How to use Button with ALL VARIANTS and both Lucide and Expo icons
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { ExpoIcons, createLucideIcon } from '@/components/ui/flexible-icon';
import { Heart, Settings, User, Trash2, CheckCircle, Eye } from 'lucide-react-native';

export function IconButtonExamples() {
  return (
    <View style={styles.container}>
      
      {/* ========== ALL VARIANTS WITH EXPO ICONS ========== */}
      
      {/* DEFAULT VARIANT */}
      <Button 
        flexibleIcon={ExpoIcons.ionicon('home')} 
        variant="default"
      >
        Default Home
      </Button>

      {/* DESTRUCTIVE VARIANT */}
      <Button 
        flexibleIcon={ExpoIcons.ionicon('trash')} 
        variant="destructive"
      >
        Delete Item
      </Button>

      {/* SUCCESS VARIANT */}
      <Button 
        flexibleIcon={ExpoIcons.ionicon('checkmark-circle')} 
        variant="success"
      >
        Save Changes
      </Button>

      {/* OUTLINE VARIANT */}
      <Button 
        flexibleIcon={ExpoIcons.material('edit')} 
        variant="outline"
      >
        Edit Profile
      </Button>

      {/* SECONDARY VARIANT */}
      <Button 
        flexibleIcon={ExpoIcons.fontAwesome('user')} 
        variant="secondary"
      >
        View Profile
      </Button>

      {/* GHOST VARIANT */}
      <Button 
        flexibleIcon={ExpoIcons.feather('eye')} 
        variant="ghost"
      >
        Preview
      </Button>

      {/* LINK VARIANT */}
      <Button 
        flexibleIcon={ExpoIcons.antDesign('link')} 
        variant="link"
      >
        Learn More
      </Button>

      {/* ========== ALL VARIANTS WITH LUCIDE ICONS ========== */}

      {/* DEFAULT VARIANT */}
      <Button 
        flexibleIcon={createLucideIcon(Heart)} 
        variant="default"
      >
        Like Post
      </Button>

      {/* DESTRUCTIVE VARIANT */}
      <Button 
        flexibleIcon={createLucideIcon(Trash2)} 
        variant="destructive"
      >
        Delete Forever
      </Button>

      {/* SUCCESS VARIANT */}
      <Button 
        flexibleIcon={createLucideIcon(CheckCircle)} 
        variant="success"
      >
        Confirm Action
      </Button>

      {/* OUTLINE VARIANT */}
      <Button 
        flexibleIcon={createLucideIcon(Settings)} 
        variant="outline"
      >
        Settings
      </Button>

      {/* SECONDARY VARIANT */}
      <Button 
        flexibleIcon={createLucideIcon(User)} 
        variant="secondary"
      >
        Account
      </Button>

      {/* GHOST VARIANT */}
      <Button 
        flexibleIcon={createLucideIcon(Eye)} 
        variant="ghost"
      >
        View Details
      </Button>

      {/* ========== ICON-ONLY BUTTONS WITH VARIANTS ========== */}

      <View style={styles.iconRow}>
        <Button 
          flexibleIcon={ExpoIcons.ionicon('add')} 
          size="icon"
          variant="default"
        />
        
        <Button 
          flexibleIcon={ExpoIcons.ionicon('close')} 
          size="icon"
          variant="destructive"
        />
        
        <Button 
          flexibleIcon={ExpoIcons.ionicon('checkmark')} 
          size="icon"
          variant="success"
        />
        
        <Button 
          flexibleIcon={ExpoIcons.ionicon('create')} 
          size="icon"
          variant="outline"
        />
        
        <Button 
          flexibleIcon={ExpoIcons.ionicon('person')} 
          size="icon"
          variant="secondary"
        />
      </View>

      {/* ========== DIFFERENT SIZES WITH VARIANTS ========== */}

      <Button 
        flexibleIcon={ExpoIcons.materialCommunity('account-circle')} 
        size="sm"
        variant="outline"
      >
        Small Outline
      </Button>

      <Button 
        flexibleIcon={ExpoIcons.ionicon('settings')} 
        size="lg"
        variant="success"
      >
        Large Success
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
});

/* 
========== COMPLETE USAGE GUIDE ==========

1. ALL VARIANTS ARE AVAILABLE:
   - variant="default"     (Blue background)
   - variant="destructive" (Red background) 
   - variant="success"     (Green background)
   - variant="outline"     (Transparent with border)
   - variant="secondary"   (Gray background)
   - variant="ghost"       (Transparent)
   - variant="link"        (Underlined text)

2. EXPO ICONS WITH VARIANTS:
<Button flexibleIcon={ExpoIcons.ionicon('home')} variant="default">Home</Button>
<Button flexibleIcon={ExpoIcons.material('delete')} variant="destructive">Delete</Button>
<Button flexibleIcon={ExpoIcons.fontAwesome('check')} variant="success">Success</Button>
<Button flexibleIcon={ExpoIcons.feather('edit')} variant="outline">Edit</Button>
<Button flexibleIcon={ExpoIcons.antDesign('user')} variant="secondary">User</Button>
<Button flexibleIcon={ExpoIcons.ionicon('eye')} variant="ghost">View</Button>
<Button flexibleIcon={ExpoIcons.material('link')} variant="link">Link</Button>

3. LUCIDE ICONS WITH VARIANTS:
<Button flexibleIcon={createLucideIcon(Heart)} variant="default">Like</Button>
<Button flexibleIcon={createLucideIcon(Trash2)} variant="destructive">Delete</Button>
<Button flexibleIcon={createLucideIcon(CheckCircle)} variant="success">Done</Button>
<Button flexibleIcon={createLucideIcon(Settings)} variant="outline">Settings</Button>
<Button flexibleIcon={createLucideIcon(User)} variant="secondary">Profile</Button>
<Button flexibleIcon={createLucideIcon(Eye)} variant="ghost">Preview</Button>

4. ICON-ONLY BUTTONS WITH VARIANTS:
<Button flexibleIcon={ExpoIcons.ionicon('add')} size="icon" variant="default" />
<Button flexibleIcon={ExpoIcons.ionicon('close')} size="icon" variant="destructive" />
<Button flexibleIcon={ExpoIcons.ionicon('checkmark')} size="icon" variant="success" />

5. DIFFERENT SIZES WITH VARIANTS:
<Button flexibleIcon={ExpoIcons.ionicon('home')} size="sm" variant="outline">Small</Button>
<Button flexibleIcon={ExpoIcons.ionicon('home')} size="default" variant="default">Normal</Button>
<Button flexibleIcon={ExpoIcons.ionicon('home')} size="lg" variant="success">Large</Button>

6. LEGACY SUPPORT (still works with variants):
<Button icon={Heart} variant="destructive">Legacy Heart</Button>
<Button icon={Settings} variant="outline">Legacy Settings</Button>
*/