// Quick Reference: Button Variants with Icons

import { ExpoIcons, createLucideIcon } from '@/components/ui/flexible-icon';
import { Heart, Settings, Trash2, CheckCircle, Eye, User } from 'lucide-react-native';

/* 
🎨 AVAILABLE BUTTON VARIANTS:

1. variant="default"      → Blue primary color background
2. variant="destructive"  → Red background (for delete/danger actions)  
3. variant="success"      → Green background (for positive actions)
4. variant="outline"      → Transparent with colored border
5. variant="secondary"    → Gray background
6. variant="ghost"        → Transparent background
7. variant="link"         → Underlined text style

📱 USAGE WITH EXPO ICONS:
*/

export const VariantExamples = {
  // Default - Primary blue background
  default: () => (
    <Button flexibleIcon={ExpoIcons.ionicon('home')} variant="default">
      Home
    </Button>
  ),

  // Destructive - Red background for dangerous actions
  destructive: () => (
    <Button flexibleIcon={ExpoIcons.ionicon('trash')} variant="destructive">
      Delete
    </Button>
  ),

  // Success - Green background for positive actions  
  success: () => (
    <Button flexibleIcon={ExpoIcons.ionicon('checkmark-circle')} variant="success">
      Save
    </Button>
  ),

  // Outline - Transparent with border
  outline: () => (
    <Button flexibleIcon={ExpoIcons.material('edit')} variant="outline">
      Edit
    </Button>
  ),

  // Secondary - Gray background
  secondary: () => (
    <Button flexibleIcon={ExpoIcons.fontAwesome('user')} variant="secondary">
      Profile
    </Button>
  ),

  // Ghost - Transparent background  
  ghost: () => (
    <Button flexibleIcon={ExpoIcons.feather('eye')} variant="ghost">
      Preview
    </Button>
  ),

  // Link - Underlined text style
  link: () => (
    <Button flexibleIcon={ExpoIcons.antDesign('link')} variant="link">
      Learn More
    </Button>
  ),
};

/* 
🚀 QUICK EXAMPLES FOR COPY-PASTE:

// Expo Icons with variants
<Button flexibleIcon={ExpoIcons.ionicon('save')} variant="success">Save</Button>
<Button flexibleIcon={ExpoIcons.material('delete')} variant="destructive">Delete</Button>
<Button flexibleIcon={ExpoIcons.fontAwesome('edit')} variant="outline">Edit</Button>
<Button flexibleIcon={ExpoIcons.antDesign('user')} variant="secondary">Profile</Button>
<Button flexibleIcon={ExpoIcons.feather('eye')} variant="ghost">View</Button>
<Button flexibleIcon={ExpoIcons.ionicon('link')} variant="link">Website</Button>

// Lucide Icons with variants  
<Button flexibleIcon={createLucideIcon(Heart)} variant="default">Like</Button>
<Button flexibleIcon={createLucideIcon(Trash2)} variant="destructive">Remove</Button>
<Button flexibleIcon={createLucideIcon(CheckCircle)} variant="success">Done</Button>
<Button flexibleIcon={createLucideIcon(Settings)} variant="outline">Settings</Button>
<Button flexibleIcon={createLucideIcon(User)} variant="secondary">Account</Button>
<Button flexibleIcon={createLucideIcon(Eye)} variant="ghost">Details</Button>

// Icon-only buttons with variants
<Button flexibleIcon={ExpoIcons.ionicon('add')} size="icon" variant="default" />
<Button flexibleIcon={ExpoIcons.ionicon('close')} size="icon" variant="destructive" />
<Button flexibleIcon={ExpoIcons.ionicon('checkmark')} size="icon" variant="success" />
<Button flexibleIcon={ExpoIcons.ionicon('create')} size="icon" variant="outline" />
<Button flexibleIcon={ExpoIcons.ionicon('person')} size="icon" variant="secondary" />

// Different sizes with variants
<Button flexibleIcon={ExpoIcons.ionicon('home')} size="sm" variant="outline">Small</Button>
<Button flexibleIcon={ExpoIcons.ionicon('home')} size="default" variant="default">Normal</Button>  
<Button flexibleIcon={ExpoIcons.ionicon('home')} size="lg" variant="success">Large</Button>

// Legacy Lucide icons (still work with variants!)
<Button icon={Heart} variant="destructive">Legacy Delete</Button>
<Button icon={Settings} variant="outline">Legacy Settings</Button>
*/