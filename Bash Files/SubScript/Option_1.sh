#!/bin/bash


while true
do
    clear
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║    Wade Dev: Git Menu                                                        ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Current Working Directory: $(pwd)"
    echo ""
    echo "Please Select an Option"
    echo ""
    echo "1. Local Commit"
    echo "2. Push to GitHub (Option 1 Needs to be done 1st)"
    echo "3. Git Log"
    echo "q. Quit"
    echo ""

    read -p "Enter your choice: " OPTION

    case "$OPTION" in
        1)
            echo "Running git add."
            git add .
            read -p "Enter Commit Title: " TITLE
            git add . 
            read -p "Enter Commit Message: " MESSAGE
            git commit -m "$TITLE: $MESSAGE"
            read -p "Press [Enter] to continue..."
            ;;
        2)
            # Check if the GIT_TOKEN variable exists.
            if [ -z "$GIT_TOKEN" ]; then
                echo "Error: GIT_TOKEN is not set. Make sure it is defined in your .env file."
            else
                echo "Preparing to push to GitHub..."
                # Get the current remote URL for 'origin'.
                REMOTE_URL=$(git remote get-url origin)

                # Remove the 'https://' part from the URL.
                URL_WITHOUT_PROTOCOL=${REMOTE_URL#https://}

                # Construct the new URL with the token for authentication.
                AUTH_URL="https://${GIT_TOKEN}@${URL_WITHOUT_PROTOCOL}"

                # Push to the authenticated URL.
                git push "${AUTH_URL}" main
            fi
            read -p "Press [Enter] to continue..."
            ;;
        3)
            git log
            read -p "Press [Enter] to continue..."
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
