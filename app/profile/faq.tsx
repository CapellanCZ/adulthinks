import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Collapsible } from '@/components/ui/collapsible';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

export default function FAQScreen() {
  const faqs = [
    {
      question: 'Q1: Can I apply for a government ID directly through this app?',
      answer:
        'No. The app only provides guides, practice forms, and preparation tools. All applications must be done through official government channels.',
    },
    {
      question: 'Q2: Are the forms in the app the same as the real ones?',
      answer:
        'They are mock-up versions designed to help you understand how to fill them out. For real applications, use the official government forms.',
    },
    {
      question: 'Q3: Can the app update or change information on my government IDs?',
      answer:
        'No. Only the issuing government office can change or update ID details.',
    },
    {
      question: 'Q4: Is the driver’s license exam in the app the same as the real exam?',
      answer:
        'The app provides mock-up exams that simulate the real test, using updated questions and road rules. They are for practice only.',
    },
    {
      question: 'Q5: How does the AI roadmap work?',
      answer:
        'You enter your skills, interests, or goals, and the system creates a customized plan with suggested steps, resources, and timelines.',
    },
    {
      question: 'Q6: Can I get official documents or submit applications through the app?',
      answer:
        'No. The app is a learning and preparation tool only, not an official government platform.',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 16 }}>
          <Text variant="subtitle" style={{ marginBottom: 8 }}>
            FAQs
          </Text>

          <View style={{ gap: 12 }}>
            {faqs.map((faq, index) => (
              <Collapsible key={index} title={faq.question}>
                <Text variant="body">{faq.answer}</Text>
              </Collapsible>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


