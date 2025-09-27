import { StyleSheet } from 'react-native'

export const roadmapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 0,
    paddingBottom: 80, // Account for FAB space
    marginTop: -30, // Offset header height for better visual centering
  },
  iconContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 50,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  generateButton: {
    minWidth: 200,
  },
  fab: {
    position: 'absolute',
    bottom: 100, // Increased to position above tab bar (typical tab bar height ~80-90px)
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
})
