import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
      <View style={{ gap: 16 }}>
        <Text variant='heading'>Privacy Policy for AdulThinks</Text>
        <Text variant='body' style={{ textAlign: 'center', opacity: 0.7 }}>
          Effective Date: October 10, 2025{'\n'}
          Last Updated: October 10, 2025
        </Text>
        
        <Text variant='subtitle'>1. Introduction</Text>
        <Text>
          Welcome to AdulThinks ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
        </Text>
        <Text>
          By using AdulThinks, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our application.
        </Text>

        <Text variant='subtitle'>2. Information We Collect</Text>
        <Text variant='body' style={{ fontWeight: '600' }}>2.1 Personal Information</Text>
        <Text>
          When you create an account or use our services, we may collect:
          • Account Information: Name, email address, username, and password
          • Profile Information: Age range, educational background, career interests, and goals
          • User-Generated Content: Posts, comments, questions, and discussions shared in the community hub
        </Text>
        
        <Text variant='body' style={{ fontWeight: '600' }}>2.2 Usage Data</Text>
        <Text>
          We automatically collect certain information when you use AdulThinks:
          • Device information (device type, operating system, unique device identifiers)
          • App usage statistics (features accessed, time spent, interaction patterns)
          • Mock exam results and practice test performance
          • AI roadmap inputs and preferences
          • Log data (IP address, access times, app crashes)
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>2.3 AI Roadmap Data</Text>
        <Text>
          When you use our AI-powered roadmap feature, we collect:
          • Skills, interests, and career goals you provide
          • Educational background and experience
          • Preferences for career pathways and timelines
          • Interaction history with roadmap recommendations
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>2.4 Community Platform Data</Text>
        <Text>
          • Questions, answers, and discussions posted on the platform
          • Interactions with other users (likes, replies, shares)
          • Reported content and moderation-related information
        </Text>

        <Text variant='subtitle'>3. How We Use Your Information</Text>
        <Text>
          We use the collected information for the following purposes:
        </Text>
        
        <Text variant='body' style={{ fontWeight: '600' }}>3.1 Service Provision</Text>
        <Text>
          • Creating and managing your user account
          • Providing access to guides, mock exams, and practice forms
          • Generating personalized AI-powered career roadmaps
          • Facilitating community discussions and peer-to-peer learning
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>3.2 Improvement and Personalization</Text>
        <Text>
          • Analyzing usage patterns to improve app functionality
          • Personalizing content and recommendations based on your interests
          • Updating and enhancing the AI roadmap algorithms
          • Developing new features and services
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>3.3 Communication</Text>
        <Text>
          • Sending important updates about the app and services
          • Responding to your inquiries and support requests
          • Notifying you of community activity (replies, mentions)
          • Providing educational content and tips (with your consent)
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>3.4 Safety and Security</Text>
        <Text>
          • Monitoring and preventing fraudulent activity
          • Enforcing our Terms of Service and community guidelines
          • Protecting user safety and moderating inappropriate content
          • Maintaining the security and integrity of our platform
        </Text>

        <Text variant='subtitle'>4. Information Sharing and Disclosure</Text>
        <Text>
          We do not sell your personal information. We may share your information only in the following circumstances:
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>4.1 With Your Consent</Text>
        <Text>
          We may share your information with third parties when you explicitly consent to such sharing.
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>4.2 Community Platform</Text>
        <Text>
          Information you post in the community hub (questions, comments, discussions) is visible to other users of AdulThinks. Please do not share sensitive personal information in public forums.
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>4.3 Service Providers</Text>
        <Text>
          We may share information with trusted third-party service providers who assist us in:
          • Cloud hosting and data storage
          • Analytics and app performance monitoring
          • AI and machine learning services for the roadmap feature
          • Customer support tools
        </Text>
        <Text>
          These providers are contractually obligated to protect your information and use it only for specified purposes.
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>4.4 Legal Requirements</Text>
        <Text>
          We may disclose your information if required to do so by law or in response to:
          • Valid legal processes (court orders, subpoenas)
          • Requests from government authorities
          • Protection of our rights, property, or safety
          • Prevention of illegal activities or policy violations
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>4.5 Business Transfers</Text>
        <Text>
          If AdulThinks is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
        </Text>

        <Text variant='subtitle'>5. Data Security</Text>
        <Text>
          We implement appropriate technical and organizational measures to protect your personal information, including:
          • Encryption of data in transit and at rest
          • Secure authentication and password protection
          • Regular security assessments and updates
          • Access controls limiting data access to authorized personnel
          • Monitoring for suspicious activities
        </Text>
        <Text>
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
        </Text>

        <Text variant='subtitle'>6. Your Rights and Choices</Text>
        
        <Text variant='body' style={{ fontWeight: '600' }}>6.1 Access and Update</Text>
        <Text>
          You can access and update your account information at any time through your profile settings.
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>6.2 Data Deletion</Text>
        <Text>
          You may request deletion of your account and personal information by contacting us at [insert contact email]. Please note:
          • Community posts may remain anonymized after deletion
          • Some information may be retained for legal or legitimate business purposes
          • Deletion is permanent and cannot be undone
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>6.3 Communication Preferences</Text>
        <Text>
          You can opt out of promotional emails by:
          • Using the unsubscribe link in our emails
          • Adjusting notification settings in the app
          • Contacting us directly
        </Text>
        <Text>
          You cannot opt out of essential service communications related to your account.
        </Text>

        <Text variant='body' style={{ fontWeight: '600' }}>6.4 Data Portability</Text>
        <Text>
          You may request a copy of your personal data in a portable format by contacting us.
        </Text>

        <Text variant='subtitle'>7. Children's Privacy</Text>
        <Text>
          AdulThinks is designed for young adults and is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will promptly delete it.
        </Text>

        <Text variant='subtitle'>8. Third-Party Links and Services</Text>
        <Text>
          Our app may contain links to third-party websites or reference government resources. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
        </Text>
        <Text variant='body' style={{ fontWeight: '600' }}>
          Important Disclaimer: AdulThinks is not affiliated with any government agency. We do not process official applications, submit forms on your behalf, or modify government ID information. All official transactions must be completed through authorized government channels.
        </Text>

        <Text variant='subtitle'>9. International Users</Text>
        <Text>
          AdulThinks is operated from the Philippines. If you access our services from outside the Philippines, your information may be transferred to and processed in the Philippines. By using our services, you consent to this transfer and processing.
        </Text>

        <Text variant='subtitle'>10. Data Retention</Text>
        <Text>
          We retain your personal information for as long as:
          • Your account is active
          • Necessary to provide you with services
          • Required for legal, tax, or regulatory purposes
          • Needed to resolve disputes or enforce our agreements
        </Text>
        <Text>
          When data is no longer needed, we will securely delete or anonymize it.
        </Text>

        <Text variant='subtitle'>11. AI and Automated Decision-Making</Text>
        <Text>
          Our AI-powered roadmap feature uses algorithms to generate personalized career guidance. This automated processing is based on:
          • Information you provide (skills, interests, goals)
          • General career and educational data
          • Usage patterns and preferences
        </Text>
        <Text>
          The AI roadmap is advisory only and does not make decisions that have legal or similarly significant effects on you.
        </Text>

        <Text variant='subtitle'>12. Changes to This Privacy Policy</Text>
        <Text>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by:
          • Posting the updated policy in the app
          • Sending an email notification (for significant changes)
          • Displaying a prominent notice within the app
        </Text>
        <Text>
          Your continued use of AdulThinks after changes are posted constitutes acceptance of the updated policy.
        </Text>

        <Text variant='subtitle'>13. Contact Us</Text>
        <Text>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        </Text>
        <Text>
          Email: [insert contact email]{'\n'}
          Address: [insert physical address if applicable]{'\n'}
          Response Time: We aim to respond to all inquiries within 5-7 business days
        </Text>

        <Text variant='subtitle'>14. Consent</Text>
        <Text>
          By using AdulThinks, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
        </Text>
        
        <Text variant='body' style={{ textAlign: 'center', marginTop: 20, fontStyle: 'italic' }}>
          ---{'\n'}
          AdulThinks Team{'\n'}
          Empowering Young Adults in Their Journey to Adulthood
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
