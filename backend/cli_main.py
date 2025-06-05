import os
from voice_agent import start_voice_interaction#type: ignore
from text_agent import start_text_interaction
from quiet_agent import start_quiet_interaction

def main():
    while True:
        print("\nSelect Interaction Mode:")
        print("1. Voice Interaction")
        print("2. Text Interaction with TTS")
        print("3. Text Interaction (Quiet Mode)")
        print("4. Exit")

        choice = input("Enter your choice (1-4): ")

        if choice == '1':
            start_voice_interaction()
        elif choice == '2':
            start_text_interaction()
        elif choice == '3':
            query = input("Enter your message: ")
            start_quiet_interaction(query)
        elif choice == '4':
            print("Exiting the application.")
            break
        else:
            print("Invalid choice. Please select a valid option.")

if __name__ == "__main__":
    main()
