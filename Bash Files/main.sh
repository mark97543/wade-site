#!/bin/bash

# Set the terminal title for clarity. This is an escape sequence.
printf "\033]0;Wade Development Bash\007"

# Get the directory where the *original* script is located
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR"
cd ..

# Load environment variables from the root .env file if it exists
if [ -f .env ]; then
  # The 'set -a' command exports all variables created from this point.
  # The 'set +a' command stops exporting.
  set -a; source .env; set +a
  #echo "Loaded .env variables from root."
  #read -p "Press [Enter] to continue..."
fi

# Set the terminal size to 80 columns and 24 rows.
# This is an XTerm control sequence and may not work on all terminals.
printf '\033[8;24;80t'

#Connecting Scripts
OPTION_1="./Bash Files/SubScript/Option_1.sh"
OPTION_2="./Bash Files/SubScript/Option_2.sh"

#Making the other scripts executable
chmod +x "$OPTION_1"
chmod +x "$OPTION_2"

while true
do
    clear
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║    Wade Dev                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Current Working Directory: $(pwd)"
    echo ""
    echo "Please Select an Option"
    echo ""
    echo "1. Git Commands"
    echo "2. Docker Commands"
    echo "q. Quit"
    echo ""

    read -p "Enter your choice: " OPTION

    case "$OPTION" in
        1)
            . "$OPTION_1"
            ;;
        2)
            . "$OPTION_2"
            ;;
        q)
            break
            ;;
        *)
            echo "Invalid Choice"
            read -p "Press [Enter] to coninue ..."
            ;;
    esac
done